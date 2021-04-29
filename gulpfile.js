var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    postcss  = require('gulp-postcss'),
    cssnext  = require('postcss-cssnext'),
    fontmin  = require('gulp-fontmin'),
    data     = require('gulp-data'),
    pug      = require('gulp-pug'),
    prettify = require('gulp-html-prettify'),
    base64   = require('gulp-base64'),
    inlineimg= require('gulp-inline-image-html'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    replace  = require('gulp-replace')

var paths = {
  config: './config.json',
  styles: {
    watch:  './src/styles/**/*.styl',
    src:    './src/styles/main.styl',
    outDir: './build/styles'
  },
  images: './images/**/*',
  fonts: {
    watch:  './src/fonts/*',
    src:    './src/fonts',
    outDir: './build/fonts'
  },
  pug:    './src/index.pug'
}

var config = JSON.parse( fs.readFileSync( paths.config ) )

//
// Prune custom fonts to remove glyphs not used in the page
//

gulp.task( 'fonts', function() {
  return gulp.src( paths.fonts.src + '/airstream.ttf' )
    .pipe( fontmin( { text: config.title, verbose: true } ) )
    .pipe( gulp.dest( paths.fonts.outDir ) )
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
    .pipe( gulp.dest( paths.styles.outDir ) )
} )

//
// Build index.html (which embeds a built style.css)
//

gulp.task( 'pug', function() {
  return gulp.src( paths.pug )
    // Inject configuration into pug context
    .pipe( data( config ) )
    .pipe( pug() )
    .pipe( inlineimg() )
    // Inline the CSS content directly into the HTML
    //   ( https://stackoverflow.com/questions/23820703/how-to-inject-content-of-css-file-into-html-in-gulp )
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
// Build the product
//

gulp.task( 'build', gulp.series( 'fonts', 'styles', 'pug' ) )

//
// Watch file changes and trigger builds
//

gulp.task( 'watch', function() {
  //
  // Task watch wrapper that prevents the watch process exiting from an error bubbling up to the build script
  //
  function gulpWatch( globs, fn ) {
    gulp.watch( globs, fn )
      .on( 'error', function() { this.emit('end') } )
  }

  gulpWatch( paths.styles.watch, gulp.series( 'build' ) )
  gulpWatch( paths.fonts.watch,  gulp.series( 'build' ) )
  gulpWatch( paths.pug,    gulp.series( 'pug' ) )
  gulpWatch( paths.config, gulp.series( 'pug' ) )
  gulpWatch( paths.images, gulp.series( 'pug' ) )
} )

//
// The default task is to build the product
//

gulp.task( 'default', gulp.series( 'build' ) )

//
// Build and watch
//

gulp.task( 'build-and-watch', gulp.series( 'build', 'watch' ) )