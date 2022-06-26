Extremely light, configurable, responsive intro page featuring a short info section and spinning circular menu.

My [website](https://git.io/specious) serves as the demo.

## Features

* [Responsive](https://en.wikipedia.org/wiki/Responsive_web_design) layout with pure CSS animations (virtually no dependence on JavaScript)
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

Even better, you can start a watch process over the source files:

```
pnpm watch
```

Now `index.html` will automatially be rebuilt every time a change is detected in a source file.

## Really getting into it?

Start by looking at the build system in `gulpfile.js`.

## Caveats

- Font glyph pruning only works on TTF source fonts, but it outputs a WOFF version of the pruned font alongside the pruned TTF

## Reducing the size of the produced index.html

### Fonts

TrueType fonts contain [required and optional](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html) tables. Use a tool like [ftCLI](https://github.com/ftCLI/ftCLI) to remove optional tables from the source font files.

### Images

- Optimize SVGs with a tool like [svgo](https://github.com/svg/svgo) or by hand. Read the [docs](https://www.w3.org/TR/svg-paths/#Introduction).
- Optimize PNG files with [optipng](http://optipng.sourceforge.net) or [pngcrush](https://pmt.sourceforge.io/pngcrush/).
- Optimize JPG files with [jpegoptim](https://github.com/tjko/jpegoptim).

## License

ISC