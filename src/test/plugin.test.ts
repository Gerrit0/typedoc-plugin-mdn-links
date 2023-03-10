import {
    Application,
    DeclarationReflection,
    InlineTagDisplayPart,
    ProjectReflection,
    QueryType,
    ReferenceType,
    TSConfigReader,
} from "typedoc";
import { test, expect, beforeAll } from "vitest";
import { load } from "../index";

let project: ProjectReflection;

beforeAll(() => {
    const app = new Application();
    app.options.addReader(new TSConfigReader());
    app.bootstrap({
        entryPoints: ["src/testdata/links.ts"],
    });
    load(app);

    project = app.convert()!;
    expect(project).toBeDefined();
});

test("Handles canvas links", () => {
    const refl = project.getChildByName("GLContext");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type).toBeInstanceOf(ReferenceType);

    const ref = type as ReferenceType;
    expect(ref.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext"
    );
});

test("Handles css links", () => {
    const refl = project.getChildByName("AE");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type).toBeInstanceOf(ReferenceType);

    const ref = type as ReferenceType;
    expect(ref.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent"
    );
});

test("Handles dom links", () => {
    const refl = project.getChildByName("Controller");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type).toBeInstanceOf(ReferenceType);

    const ref = type as ReferenceType;
    expect(ref.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
    );
});

test("Handles globalObject links", () => {
    const refl = project.getChildByName("Inf");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type instanceof QueryType).toBe(true);

    const ref = type as QueryType;
    expect(ref.queryType.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity"
    );
});

test("Handles scoped globalObject links", () => {
    const refl = project.getChildByName("DTF");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type instanceof QueryType).toBe(true);

    const ref = type as QueryType;
    expect(ref.queryType.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat"
    );
});

test("Handles web audio links", () => {
    const refl = project.getChildByName("AContext");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const type = (refl as DeclarationReflection).type;
    expect(type).toBeInstanceOf(ReferenceType);

    const ref = type as ReferenceType;
    expect(ref.externalUrl).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/API/AudioContext"
    );
});

test("Handles comment links", () => {
    const refl = project.getChildByName("comment");
    expect(refl).toBeInstanceOf(DeclarationReflection);
    const tags = refl?.comment?.summary.filter(
        (f) => f.kind === "inline-tag"
    ) as InlineTagDisplayPart[];

    expect(tags).toEqual([
        {
            kind: "inline-tag",
            tag: "@link",
            target: "https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext",
            text: "WebGLRenderingContext",
        },
        {
            kind: "inline-tag",
            tag: "@link",
            target: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN",
            text: "NaN",
        },
        {
            kind: "inline-tag",
            tag: "@link",
            target: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
            text: "Intl.DateTimeFormat",
        },
        {
            kind: "inline-tag",
            tag: "@link",
            target: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat",
            text: "custom",
        },
    ]);
});
