# typedoc-plugin-mdn-links

Adds support for linking references to global types like `HTMLElement`, `WebAssembly`, and `Date` to their documentation pages on MDN.

If you're explicitly referencing a type in a comment, you can use `{@link !HTMLElement}` to have it processed by this plugin.

If you set `--logLevel Verbose`, it will print out when failing to resolve a symbol to a page on MDN. Pull requests to fix failed resolution are welcome!

Supports TypeDoc 0.23.x, 0.24.x and 0.25.x

| Option                  | Default | Description                                                                                |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------ |
| resolveUtilityTypes     | `true`  | Resolve links to `Partial`, `Omit`, etc. to their documentation on the TypeScript website. |
| additionalModuleSources | `false` | Specify additional node_modules to attempt to resolve links to MDN from.                   |

## Changelog

See full changelog [here](./CHANGELOG.md).
