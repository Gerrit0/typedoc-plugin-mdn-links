import { Application } from "typedoc";
import { resolveCanvasName } from "./canvas";
import { resolveCssName } from "./css";
import { resolveDomName } from "./dom";
import { resolveGlobalName } from "./globalObjects";
import { resolveWebAudioName } from "./webaudio";

export function load(app: Application) {
    const failed = new Set<string>();

    app.renderer.addUnknownSymbolResolver("typescript", (name) => {
        const result =
            resolveGlobalName(name) ??
            resolveDomName(name) ??
            resolveCssName(name) ??
            resolveCanvasName(name) ??
            resolveWebAudioName(name);

        if (!result && !failed.has(name)) {
            failed.add(name);
            app.logger.verbose(
                `[typedoc-plugin-mdn-links]: Failed to resolve type: ${name}`
            );
        }

        return result;
    });
}
