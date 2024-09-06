# typedoc-plugin-mdn-links

Adds support for linking references to global types like `HTMLElement`,
`WebAssembly`, and `Date` to their documentation pages on MDN.

If you're explicitly referencing a type in a comment, you can use `{@link
!HTMLElement}` to have it processed by this plugin.

If you set `--logLevel Verbose`, it will print out when failing to resolve a
symbol to a page on MDN. Pull requests to fix failed resolution are welcome!

Supports TypeDoc 0.23.14 through 0.26.x.

## Options

-   `resolveUtilityTypes`

    Defaults to `true`. If set, will resolve links to `Partial`, `Omit`, etc. to
    their documentation on the TypeScript website.

-   `additionalModuleSources`

    Defaults to `[]`. Specifies additional node_modules packages to attempt to
    resolve links to MDN from. By default, resolves types declared in the
    `typescript`, `@types/web`, and `@webgpu/types` packages. You should only
    need to set this option if using an unusual type package to define globally
    available types.

## Changelog

See full changelog [here](./CHANGELOG.md).
