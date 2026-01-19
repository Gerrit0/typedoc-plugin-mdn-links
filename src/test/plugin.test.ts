import {
	Application,
	DeclarationReflection,
	type InlineTagDisplayPart,
	ProjectReflection,
	QueryType,
	ReferenceType,
} from "typedoc";
import { beforeAll, describe, expect, test } from "vitest";
import { load } from "../index.js";

describe("Statically defined names", () => {
	let project: ProjectReflection;

	beforeAll(async () => {
		const app = await Application.bootstrap({
			entryPoints: ["src/testdata/links.ts"],
		});
		load(app);
		project = (await app.convert())!;
		expect(project).toBeDefined();
	});

	test("Handles canvas links", () => {
		const refl = project.getChildByName("GLContext");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext",
		);
	});

	test("Handles css links", () => {
		const refl = project.getChildByName("AE");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/API/AnimationEvent",
		);
	});

	test("Handles dom links", () => {
		const refl = project.getChildByName("Controller");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/API/AbortController",
		);
	});

	test("Handles globalObject links", () => {
		const refl = project.getChildByName("Inf");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type instanceof QueryType).toBe(true);

		const ref = type as QueryType;
		expect(ref.queryType.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Infinity",
		);
	});

	test("Handles scoped globalObject links", () => {
		const refl = project.getChildByName("DTF");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type instanceof QueryType).toBe(true);

		const ref = type as QueryType;
		expect(ref.queryType.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
		);
	});

	test("Handles web audio links", () => {
		const refl = project.getChildByName("AContext");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/API/AudioContext",
		);
	});

	test("Handles Iterable links", () => {
		const refl = project.getChildByName("NumberIterable");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface",
		);
	});

	test("Handles comment links", () => {
		const refl = project.getChildByName("comment");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const tags = (
			refl?.comment?.summary.filter(
				(f) => f.kind === "inline-tag",
			) as InlineTagDisplayPart[]
		).map((part) => ({ target: part.target, text: part.text }));

		expect(tags).toEqual([
			{
				target: "https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext",
				text: "WebGLRenderingContext",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NaN",
				text: "NaN",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
				text: "Intl.DateTimeFormat",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
				text: "custom",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/API/AbortSignal/abort_static",
				text: "AbortSignal.abort",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/API/Response/json_static",
				text: "Response.json",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/API/Response/json",
				text: "Response#json",
			},
			{
				target: undefined,
				text: "!AbortSignal.abort_static",
			},
			{
				target: "https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#iterable-interface",
				text: "Iterable",
			},
		]);
	});

	test("Handles comment links with TS link resolution", () => {
		const refl = project.getChildByName("commentTsResolution");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const tags = (
			refl?.comment?.summary.filter(
				(f) => f.kind === "inline-tag",
			) as InlineTagDisplayPart[]
		).map((part) => ({ target: part.target, text: part.text }));

		expect(tags).toEqual([
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map",
				text: "Map",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/size",
				text: "map size",
			},
		]);
	});

	test("Handles types from @webgpu/types", () => {
		const refl = project.getChildByName("WGpuDevice");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBe(
			"https://developer.mozilla.org/docs/Web/API/GPUDevice",
		);
	});

	test("Does not handle non-existent links", () => {
		const refl = project.getChildByName("NotOnMdn");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const type = (refl as DeclarationReflection).type;
		expect(type).toBeInstanceOf(ReferenceType);

		const ref = type as ReferenceType;
		expect(ref.externalUrl).toBeUndefined();
	});

	test("Handles links to Iterator types #22", () => {
		const refl = project.getChildByName("GH22");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const tags = (
			refl?.comment?.summary.filter(
				(f) => f.kind === "inline-tag",
			) as InlineTagDisplayPart[]
		).map((part) => ({ target: part.target, text: part.text }));

		expect(tags).toEqual([
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator",
				text: "It",
			},
			{
				// Not an instance, so this link doesn't work
				target: undefined,
				text: "Iterator#from | fromHash",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Iterator/from",
				text: "fromDot",
			},
			{
				target: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/entries",
				text: "entries",
			},
		]);
	});

	test("Handles links to WebAssembly types #28", () => {
		const refl = project.getChildByName("GH28");
		expect(refl).toBeInstanceOf(DeclarationReflection);
		const tags = (
			refl?.comment?.summary.filter(
				(f) => f.kind === "inline-tag",
			) as InlineTagDisplayPart[]
		).map((part) => ({ target: part.target, text: part.text }));

		expect(tags).toEqual([
			{
				target: "https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/instantiateStreaming_static",
				text: "stream",
			},
			{
				target: "https://developer.mozilla.org/docs/WebAssembly/Reference/JavaScript_interface/Module",
				text: "Module",
			},
		]);
	});
});
