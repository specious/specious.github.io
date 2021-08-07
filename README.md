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

This project uses [Pug](https://pugjs.org/) and [Stylus](http://stylus-lang.com/). The build system is based on [Gulp](https://gulpjs.com/).

First, install the dependencies by running:

```
yarn install
```

Build the `index.html` file by running:

```
yarn build
```

You can start a watch process over the source files by running:

```
yarn watch
```

`index.html` will automatially be rebuilt every time you change a file.

## Really getting into it?

Read the `gulpfile`.

## License

ISC