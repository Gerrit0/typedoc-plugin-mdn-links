import { Application } from "typedoc";
import { resolveCssName } from "./css";
import { resolveDomName } from "./dom";
import { resolveGlobalName } from "./globalObjects";

export function load(app: Application) {
    const failed = new Set<string>();

    app.renderer.addUnknownSymbolResolver("typescript", (name) => {
        const result =
            resolveGlobalName(name) ??
            resolveDomName(name) ??
            resolveCssName(name);

        if (!result && !failed.has(name)) {
            failed.add(name);
            app.logger.verbose(
                `[typedoc-plugin-mdn-links]: Failed to resolve type: ${name}`
            );
        }

        return result;
    });
}
