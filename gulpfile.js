var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    postcss  = require('gulp-postcss'),
    cssnext  = require('postcss-cssnext'),
    data     = require('gulp-data'),
    pug      = require('gulp-pug'),
    prettify = require('gulp-html-prettify'),
    base64   = require('gulp-base64'),
    inlineimg= require('gulp-inline-image-html'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    replace  = require('gulp-replace')

var paths = {
  styles: {
    watch: './css/**/*.styl',
    src:   './css/main.styl'
  },
  config: './config.json',
  images: './gfx/**/*',
  pug:    './index.pug'
}

//
// Internal watch triggers
//

gulp.task( '_watch', function() {
  gulp.watch( paths.styles.watch, gulp.series( 'default' ) )
  gulp.watch( paths.pug,    gulp.series( 'pug' ) )
  gulp.watch( paths.config, gulp.series( 'pug' ) )
  gulp.watch( paths.images, gulp.series( 'pug' ) )
} )

//
// Build style.css
//

gulp.task( 'styles', function() {
  return gulp.src( paths.styles.src )
    .pipe( stylus( { compress: true } ) )
    .pipe( base64( { extensions: ['woff'] } ) )
    .pipe( postcss( [
      cssnext( { browsers: ['last 2 versions'] } )
    ] ) )
    .pipe( concat( 'style.css' ) )
    .pipe( gulp.dest( './css' ) )
} )

//
// Build index.html
//

gulp.task( 'pug', function() {
  return gulp.src( paths.pug )
    // Load link definitions from external file:
    //   https://codepen.io/hoichi/blog/json-to-jade-in-gulp
    .pipe( data( function() {
      return JSON.parse( fs.readFileSync( './config.json' ) )
    } ) )
    .pipe( pug() )
    .pipe( inlineimg() )
    // Import the CSS:
    //   https://stackoverflow.com/questions/23820703/how-to-inject-content-of-css-file-into-html-in-gulp
    .pipe( replace( /<link rel="stylesheet" href="(.*\.css)">/g, function( s, file ) {
      return '<style>' + fs.readFileSync( file, 'utf8' ) + '</style>'
    } ) )
    .pipe( prettify( {
      indent_size: 2,
      wrap_line_length: 32786,
      indent_inner_html: true,
      unformatted: ['span', 'strong']
    } ) )
    .pipe( gulp.dest( './' ) )
} )

//
// The default task is to build the product
//

gulp.task( 'default', gulp.series( 'styles', 'pug' ) )

//
// Build and watch
//

gulp.task( 'watch', gulp.series( 'default', '_watch' ) )