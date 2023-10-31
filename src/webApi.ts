import { webApiIndex } from "./webApiIndex";

export const webAPIUrl = "https://developer.mozilla.org/en-US/docs/Web/API";

export function resolveWebApiPath(name: string) {
    for (const url of webApiIndex) {
        const parts = url.split("/");
        if (parts[parts.length - 1] === name) {
            return url;
        }
    }
}
