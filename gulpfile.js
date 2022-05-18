const { src, dest, series } = gulp = require('gulp')
const glob = require('glob-base')
const merge = require('merge2')
const tap = require('gulp-tap')
const gulpif = require('gulp-if')
const stylus = require('gulp-stylus')
const pug = require('gulp-pug')
const data = require('gulp-data')
const base64 = require('gulp-base64')
const inlineimg = require('gulp-inline-image-html')
const htmlflow = require('@specious/htmlflow')
const transform = require('gulp-transform')
const replace = require('gulp-replace')
const concat = require('gulp-concat')
const fs = require('fs')
const path = require('path')
const log = require('fancy-log')

const browser = require('./lib/browser')
const fontprune = require('./lib/fontprune')

const dirs = {
  src: './src/',
  out: './build/'
}

var sources = {
  config: './config.json',
  fonts: 'fonts/*',
  styles: {
    watch: 'styles/**/*.styl',
    compile: 'styles/main.styl'
  },
  images: 'images/**/*',
  pug: 'index.pug'
}

const config = require( sources.config )

//
// Full source path
//

const srcPath = (x) => (
  Array.isArray(x) ?
    x.map(path => dirs.src + path)
    : dirs.src + x
)

//
// Associated output directory for a source path
//

const outPath = (x) => (
  dirs.out + glob(x).base
)

//
// Preliminary build to get actual font usage from live page
//

let fontGlyphs

const analyze = ( done ) => {
  merge( [
      src( srcPath( sources.styles.compile ) )
        .pipe( stylus() )
        .pipe( concat( 'style.css' ) )
        .pipe( dest( outPath( sources.styles.compile) ) ),

      src( srcPath( sources.pug ) )
        .pipe( data( config ) )
        .pipe( pug() )
        .pipe( dest( dirs.out ) )
    ] )
    .pipe( tap( async( file ) => {
      if( path.extname( file.path ) !== '.html' )
        return

      let res = await browser.getTextByFontFamily( file.path )

      log( 'Building table of which text is associated with each custom font' )

      fontGlyphs = res.reduce(
        ( table, item ) => ( {
          ...table,
          [item.fontFamily]: (table[item.fontFamily] || "") + item.text
        } ), {}
      )

      console.log( fontGlyphs )

      done()
    }))
}

//
// Prune custom fonts to remove glyphs not used in the page
//

const fonts = function() {
  let fontDir = glob( sources.fonts ).base

  return src( srcPath( sources.fonts ) )
    .pipe( fontprune( { fontGlyphs } ) )
    .pipe( dest( outPath( sources.fonts ) ) )
}

//
// Build style.css
//

const styles = function() {
  return src( srcPath( sources.styles.compile ) )
    .pipe( stylus( { compress: true } ) )
    .pipe( base64( {
      extensions: ['ttf'],
      maxImageSize: 0, /* no size limit */
      debug: true
    } ) )
    .pipe( concat( 'style.css' ) )
    .pipe( dest( outPath( sources.styles.compile ) ) )
}

//
// Build index.html
//

const html = () => {
  return src( srcPath( sources.pug ) )
    .pipe( data( config ) ) // Inject configuration into pug context
    .pipe( pug() )
    .pipe( inlineimg() )
    .pipe( replace( /<link rel="stylesheet" href="(.*\.css)">/g, function( line, path ) {
      log('Replacing style tag with contents: ' + path + ' -> ' + (dirs.out + path))
      return '<style>' + fs.readFileSync( dirs.out + path ) + '</style>'
    } ) )
    .pipe(
      gulpif(
        config.build.prettify,
        transform( ('utf8', async (content, file) => (
          Buffer.from(await htmlflow(content.toString()))
        ) ) )
      )
    )
    .pipe( dest( outPath( sources.pug ) ) )
}

//
// Build
//

const build = series( analyze, fonts, styles, html )

//
// Watch file changes and trigger builds
//

const watch = function() {
  //
  // Task watch wrapper that prevents gulp from quitting when an error occurs
  //
  function keepWatching( glob, a, b ) {
    gulp.watch( glob, a, b ).on( 'error', () => this.emit('end') )
  }

  keepWatching( srcPath( [
      sources.config,
      sources.fonts,
      sources.styles.watch,
      sources.images,
      sources.pug
    ] ), series( 'build' )
  )

  log( "Watching source files..." )
}

module.exports = {
  analyze,
  fonts,
  styles,
  html,
  build,
  watch,
  default: build
}