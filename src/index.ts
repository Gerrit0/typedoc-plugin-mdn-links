import { Application, ExternalResolveResult } from "typedoc";
import { resolveCanvasName } from "./canvas";
import { resolveCssName } from "./css";
import { resolveDomName } from "./dom";
import { resolveGlobalName } from "./globalObjects";
import { resolveWebAudioName } from "./webaudio";

function resolveName(name: string) {
    return (
        resolveGlobalName(name) ??
        resolveDomName(name) ??
        resolveCssName(name) ??
        resolveCanvasName(name) ??
        resolveWebAudioName(name)
    );
}

const version = Application.VERSION.split(/[\.-]/);
const supportsObjectReturn = +version[1] > 23 || +version[2] >= 26;

export function load(app: Application) {
    const failed = new Set<string>();

    app.converter.addUnknownSymbolResolver((declaration) => {
        if (
            declaration.moduleSource === "typescript" ||
            (!declaration.moduleSource &&
                declaration.resolutionStart === "global")
        ) {
            const name = declaration.symbolReference?.path
                ?.map((path) => path.path)
                .join(".");
            if (!name) return;
            const result = resolveName(name);

            if (!result && !failed.has(name)) {
                failed.add(name);
                app.logger.verbose(
                    `[typedoc-plugin-mdn-links]: Failed to resolve type: ${name}`
                );
            }

            if (supportsObjectReturn && result) {
                return {
                    target: result,
                    caption: name,
                };
            }

            return result;
        }
    });
}
