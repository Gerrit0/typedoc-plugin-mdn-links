import { Application, ComponentPath, Converter, ParameterType } from "typedoc";
import { resolveTsType } from "./typescript";
import { resolveWebApiPath } from "./webApi";

const version = Application.VERSION.split(/[\.-]/);
const supportsObjectReturn = +version[1] > 23 || +version[2] >= 26;

declare module "typedoc" {
    export interface TypeDocOptionMap {
        resolveUtilityTypes: boolean;
        additionalModuleSources: string[];
    }
}

const defaultModuleSources = ["typescript", "@types/web", "@webgpu/types"];

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

    const resolvers = [resolveWebApiPath];
    function resolveName(name: ComponentPath[]) {
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
            ...defaultModuleSources,
        ];
        const moduleSource = declaration.moduleSource;

        if (
            (moduleSource && validSources.includes(moduleSource)) ||
            (!moduleSource && declaration.resolutionStart === "global")
        ) {
            const names = declaration.symbolReference?.path;
            if (!names) return;
            const dottedName = stringifyPath(names);
            const result = resolveName(names);

            if (!result && !failed.has(dottedName)) {
                failed.add(dottedName);
                app.logger.verbose(
                    `[typedoc-plugin-mdn-links]: Failed to resolve type: ${dottedName}`,
                );
            }

            if (supportsObjectReturn && result) {
                return {
                    target: result,
                    caption: dottedName,
                };
            }

            return result;
        }
    });
}

function stringifyPath(path: ComponentPath[]) {
    let result = path[0].path;

    for (const part of path.slice(1)) {
        result += part.navigation + part.path;
    }

    return result;
}
