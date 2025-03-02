import {
	Application,
	type CommentDisplayPart,
	type ComponentPath,
	Converter,
	type DeclarationReference,
	ParameterType,
	Reflection,
	ReflectionSymbolId,
	splitUnquotedString,
	type SymbolReference,
} from "typedoc";
import { resolveTsType } from "./typescript.js";
import { resolveWebApiPath } from "./webApi.js";

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

	app.converter.addUnknownSymbolResolver(resolveSymbol);

	function resolveSymbol(
		declaration: DeclarationReference,
		_refl: Reflection,
		_part: CommentDisplayPart | undefined,
		symbolId: ReflectionSymbolId | undefined,
	) {
		if (symbolId) {
			return resolveDeclaration(makeDeclarationReference(symbolId));
		}

		return resolveDeclaration(declaration);
	}

	function resolveDeclaration(declaration: DeclarationReference) {
		const validSources = [
			...app.options.getValue("additionalModuleSources"),
			...defaultModuleSources,
		];
		const moduleSource = declaration.moduleSource;

		if (
			(moduleSource && validSources.includes(moduleSource))
			|| (!moduleSource && declaration.resolutionStart === "global")
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

			if (result) {
				return {
					target: result,
					caption: dottedName,
				};
			}

			return result;
		}
	}
}

function stringifyPath(path: ComponentPath[]) {
	let result = path[0].path;

	for (const part of path.slice(1)) {
		result += part.navigation + part.path;
	}

	return result;
}

function makeDeclarationReference(
	symbolId: ReflectionSymbolId,
): DeclarationReference {
	return removeLeadingGlobalRef(
		symbolId.toDeclarationReference(),
	);
}

function removeLeadingGlobalRef(
	ref: DeclarationReference,
): DeclarationReference {
	// This takes care of lib.esnext.iterator.d.ts which
	// defines Iterator under declare global in a special way.

	if (
		ref.resolutionStart === "global"
		&& ref.symbolReference?.path?.[0].path === "__global"
	) {
		return {
			...ref,
			symbolReference: {
				...ref.symbolReference,
				path: ref.symbolReference.path.slice(1),
			},
		};
	}

	return ref;
}
