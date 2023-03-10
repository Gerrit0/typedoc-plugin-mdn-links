# typedoc-plugin-mdn-links

Adds support for linking references to global types like `HTMLElement`, `WebAssembly`, and `Date` to their documentation pages on MDN.

This is probably missing links! If you set `--logLevel Verbose`, it will print out when failing to resolve a symbol to a page on MDN. Pull requests to fix failed resolution are welcome!

Supports TypeDoc 0.23.x and 0.24.x

## Changelog

### v3.0.0 (2023-03-09)

-   Add support for TypeDoc 0.24 (@ocavue)
-   Drop support for TypeDoc 0.22

### v2.0.2 (2022-12-22)

-   Add missing `AsyncGenerator` and `AsyncGeneratorFunction` pages (@achingbrain)

### v2.0.1 (2022-12-16)

-   Add many missing links (@achingbrain)

### v2.0.0 (2022-06-26)

-   Support TypeDoc 0.23
-   Drop support for Node 12

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
