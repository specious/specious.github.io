var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    nib      = require('nib'),
    data     = require('gulp-data'),
    jade     = require('gulp-pug'),
    prettify = require('gulp-html-prettify'),
    base64   = require('gulp-base64'),
    inlineimg= require('gulp-inline-image-html'),
    cleancss = require('gulp-clean-css'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    replace  = require('gulp-replace'),
    sequence = require('run-sequence')

var paths = {
  styles: './css/*.styl',
  config: './config.json',
  images: './gfx/**/*',
  jade:   './index.jade'
}

gulp.task( '_watch', function() {
  gulp.watch( paths.styles, ['styles-and-jade'] )
  gulp.watch( paths.jade,   ['jade'] )
  gulp.watch( paths.config, ['jade'] )
  gulp.watch( paths.images, ['jade'] )
} )

gulp.task( 'styles', function () {
  return gulp.src( paths.styles )
    .pipe( stylus( { use: [ nib() ] } ) )
    .pipe( concat( 'styles.css' ) )
    .pipe( base64( { extensions: ['woff'] } ) )
    .pipe( cleancss() )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'jade', function () {
  gulp.src( paths.jade )
    // Load link definitions from external file:
    //   http://codepen.io/hoichi/blog/json-to-jade-in-gulp
    .pipe( data( function() {
      return JSON.parse( fs.readFileSync( './config.json' ) )
    } ) )
    .pipe( jade() )
    .pipe( inlineimg() )
    // Import the CSS:
    //   http://stackoverflow.com/questions/23820703/how-to-inject-content-of-css-file-into-html-in-gulp
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

gulp.task( 'styles-and-jade', function() {
  /*
   * Compile Jade after styles because processed styles are
   * embedded into the HTML, which is derived from the *.jade.
   */
  sequence( 'styles', 'jade' )
} )

//
// Build
//

gulp.task( 'default', function() {
  sequence( 'styles', 'jade' )
} )

//
// Build and watch
//

gulp.task( 'watch', function() {
  sequence( 'default', '_watch' )
} )