Extremely light, configurable, responsive intro page featuring a short info section and spinning circular menu.

My [website](https://git.io/specious) serves as the demo.

## Features

* Responsive layout with pure CSS animations (minimal dependence on JavaScript)
* Configurable rotating circular menu
* Menu cover swings open when hovered and reveals a hidden element

The build system performs these optimizations:

* Images and fonts are embedded directly in the HTML file (fast loading and portability)
* Custom fonts are pruned to remove all unused glyphs (super light weight)

The product is just one file.

## Start making this your own

This project uses [Pug](https://pugjs.org/) and [Stylus](http://stylus-lang.com/). The build system uses [Gulp](https://gulpjs.com/).

First, install the dependencies with [pnpm](https://pnpm.io/) or equivalent:

```
pnpm i
```

Build the `index.html` file:

```
pnpm build
```

You can start a watch process over the source files:

```
pnpm watch
```

`index.html` will automatially be rebuilt every time a change is detected in a source file.

## Really getting into it?

Look at the `gulpfile`.

## Caveats

- Font glyph pruning only works on TTF source fonts, but it outputs a WOFF version of the pruned font alongside the pruned TTF

## License

ISC