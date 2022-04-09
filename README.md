# typedoc-plugin-mdn-links

Adds support for linking references to global types like `HTMLElement`, `WebAssembly`, and `Date` to their documentation pages on MDN.

This is probably missing links! If you set `--logLevel Verbose`, it will print out when failing to resolve a symbol to a page on MDN. Pull requests to fix failed resolution are welcome!

Supports TypeDoc 0.22.x.

## Changelog

### v1.0.6 (2022-04-09)

-   Added support for WebAudio and Canvas APIs (@johh)

### v1.0.5 (2022-01-26)

-   Fixed repository reference so that npm will link to GitHub (@mikaello)

### v1.0.4 (2021-09-05)

-   Added missing link for base `HTMLElement` interface.

### v1.0.3 (2021-09-05)

-   Added support for HTML element types (`HTMLAnchorElement`, `HTMLButtonElement`, etc.)

### v1.0.2 (2021-09-05)

-   Added `typedocplugin` to keywords so that TypeDoc will now automatically load this plugin if installed.
