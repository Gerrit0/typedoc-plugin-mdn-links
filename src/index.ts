import {
    Application,
    Converter,
    ExternalResolveResult,
    ParameterType,
} from "typedoc";
import { resolveCanvasName } from "./canvas";
import { resolveCssName } from "./css";
import { resolveDomName } from "./dom";
import { resolveGlobalName } from "./globalObjects";
import { resolveTsType } from "./typescript";
import { resolveWebApiPath } from "./webApi";
import { resolveWebAudioName } from "./webaudio";
import packageInfo from "../package.json";

const version = Application.VERSION.split(/[\.-]/);
const supportsObjectReturn = +version[1] > 23 || +version[2] >= 26;

declare module "typedoc" {
    export interface TypeDocOptionMap {
        resolveUtilityTypes: boolean;
        additionalModuleSources: string[];
    }
}

export function load(app: Application) {
    const failed = new Set<string>();

    app.options.addDeclaration({
        name: "resolveUtilityTypes",
        defaultValue: true,
        help: "[typedoc-plugin-mdn-links]: Resolve references to Partial, Omit, etc to the TypeScript website.",
        type: ParameterType.Boolean,
    });

    app.options.addDeclaration({
        name: "additionalModuleSources",
        help: "[typedoc-plugin-mdn-links]: Additional module sources to resolve.",
        type: ParameterType.Array,
        defaultValue: [],
    });

    const resolvers = [
        resolveGlobalName,
        resolveDomName,
        resolveCssName,
        resolveCanvasName,
        resolveWebAudioName,
        resolveWebApiPath,
    ];
    function resolveName(name: string) {
        for (const res of resolvers) {
            const result = res(name);
            if (result) return result;
        }
    }

    app.converter.on(Converter.EVENT_BEGIN, () => {
        if (app.options.getValue("resolveUtilityTypes")) {
            resolvers.push(resolveTsType);
        }
    });

    app.converter.addUnknownSymbolResolver((declaration) => {
        const validSources = [
            ...app.options.getValue("additionalModuleSources"),
            "typescript",
        ];
        const moduleSource = declaration.moduleSource;

        if (
            (moduleSource && validSources.includes(moduleSource)) ||
            (!moduleSource && declaration.resolutionStart === "global")
        ) {
            const name = declaration.symbolReference?.path
                ?.map((path) => path.path)
                .join(".");
            if (!name) return;
            const result = resolveName(name);

            if (!result && !failed.has(name)) {
                failed.add(name);
                app.logger.verbose(
                    `[typedoc-plugin-mdn-links]: Failed to resolve type: ${name}`,
                );
            }

            if (supportsObjectReturn && result) {
                return {
                    target: result,
                    caption: name,
                };
            }

            return result;
        } else if (
            moduleSource &&
            moduleSource !== "typedoc-plugin-mdn-links"
        ) {
            app.logger.info(
                `[typedoc-plugin-mdn-links]: Skipping unexpected module source ${moduleSource}.`,
            );
            app.logger.info(
                "If this is a valid module source, please add it to the --additionalModuleSources option.",
            );
            app.logger.info(
                `If you think this module source should be supported by default, please open an issue at ${packageInfo.bugs.url}.`,
            );
        }
    });
}
