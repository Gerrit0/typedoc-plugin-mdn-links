import { ComponentPath } from "typedoc";

export interface WebApiData {
    url: string;
    inst?: Record<string, WebApiData | string>;
    stat?: Record<string, WebApiData | string>;
}

import _webApi from "#data";
const webApi = _webApi as Record<string, WebApiData | string>;

function resolvePath(
    root: Record<string, WebApiData | string> | undefined,
    names: ComponentPath[],
    i = 0,
): string | undefined {
    if (!root) return;
    const api = root[names[i].path];
    if (typeof api === "string") {
        if (i === names.length - 1) {
            return api;
        }
        return undefined;
    } else if (typeof api === "object") {
        if (i === names.length - 1) {
            return api.url;
        }

        switch (names[i + 1].navigation) {
            case "#":
            case "~":
                return resolvePath(api.inst, names, i + 1);
            case ".":
                return (
                    resolvePath(api.stat, names, i + 1) ||
                    resolvePath(api.inst, names, i + 1)
                );
        }
    }

    return;
}

export function resolveWebApiPath(names: ComponentPath[]): string | undefined {
    return resolvePath(webApi, names);
}
