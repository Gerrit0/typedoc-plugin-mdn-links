const baseLink =
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects";

const knownGlobalObjects = new Set([
    // Value properties
    "Infinity",
    "NaN",
    "undefined",
    "globalThis",

    // Function properties
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "encodeURI",
    "encodeURIComponent",
    "decodeURI",
    "decodeURIComponent",

    // Fundamental objects
    "Object",
    "Function",
    "Boolean",
    "Symbol",

    // Error objects
    "Error",
    "AggregateError",
    "EvalError",
    "InternalError",
    "RangeError",
    "ReferenceError",
    "SyntaxError",
    "TypeError",
    "URIError",

    // Numbers and dates
    "Number",
    "BigInt",
    "Math",
    "Date",

    // Text processing
    "String",
    "RegExp",

    // Indexed collections
    "Array",
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array",

    // Keyed collections
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",

    // Structured data
    "ArrayBuffer",
    "SharedArrayBuffer",
    "Atomics",
    "DataView",
    "JSON",

    // Control abstraction objects
    "Promise",
    "Generator",
    "GeneratorFunction",
    "AsyncFunction",
    "AsyncGenerator",
    "AsyncGeneratorFunction",
    // "IteratorResult", No file on MDN yet https://github.com/mdn/content/issues/23131

    // Reflection
    "Reflect",
    "Proxy",

    "Intl",
    "WebAssembly",
]);

const knownScopedGlobalObjects = {
    // Internationalization
    "Intl.Collator": "Intl/Collator",
    "Intl.DateTimeFormat": "Intl/DateTimeFormat",
    "Intl.ListFormat": "Intl/ListFormat",
    "Intl.NumberFormat": "Intl/NumberFormat",
    "Intl.PluralRules": "Intl/PluralRules",
    "Intl.RelativeTimeFormat": "Intl/RelativeTimeFormat",
    "Intl.Locale": "Intl/Locale",

    // WebAssembly
    "WebAssembly.Module": "WebAssembly/Module",
    "WebAssembly.Instance": "WebAssembly/Instance",
    "WebAssembly.Memory": "WebAssembly/Memory",
    "WebAssembly.Table": "WebAssembly/Table",
    "WebAssembly.CompileError": "WebAssembly/CompileError",
    "WebAssembly.LinkError": "WebAssembly/LinkError",
    "WebAssembly.RuntimeError": "WebAssembly/RuntimeError",
};

export function resolveGlobalName(name: string) {
    if (knownGlobalObjects.has(name)) {
        return `${baseLink}/${name}`;
    }

    if (knownScopedGlobalObjects.hasOwnProperty(name)) {
        return `${baseLink}/${knownScopedGlobalObjects[name as never]}`;
    }
}
