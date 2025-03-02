import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentPath } from "typedoc";

export interface WebApiData {
	url: string;
	inst?: Record<string, WebApiData | string>;
	stat?: Record<string, WebApiData | string>;
}

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const webApi = JSON.parse(
	readFileSync(join(REPO_ROOT, "data/web-api.json"), "utf-8"),
);

function resolvePath(
	root: Record<string, WebApiData | string> | undefined,
	names: ComponentPath[],
	i = 0,
): string | undefined {
	if (!root) return;
	let api = root[names[i].path];

	// Global objects like `Object` and `Iterator` have interfaces defined
	// in TS declarations as `ObjectConstructor` and `IteratorConstructor`
	if (!api && names[i].path.endsWith("Constructor")) {
		api = root[names[i].path.replace(/Constructor$/, "")];
	}

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
					resolvePath(api.stat, names, i + 1)
					|| resolvePath(api.inst, names, i + 1)
				);
		}
	}

	return;
}

export function resolveWebApiPath(names: ComponentPath[]): string | undefined {
	return resolvePath(webApi, names);
}
