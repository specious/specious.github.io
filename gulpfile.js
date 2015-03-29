var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    nib      = require('nib'),
    jade     = require('gulp-jade'),
    base64   = require('gulp-base64'),
    minicss  = require('gulp-minify-css'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    repl     = require('gulp-replace'),
    sequence = require('run-sequence')

var paths = {
  styles: ['./css/*.styl'],
  jade: './index.jade'
}

gulp.task( 'watch', function() {
  gulp.watch( paths.styles, ['styles-and-jade'] )
  gulp.watch( paths.jade, ['jade'] )
} )

gulp.task( 'styles', function () {
  return gulp.src( paths.styles )
    .pipe( stylus( { use: [ nib() ] } ) )
    .pipe( concat( 'styles.css' ) )
    .pipe( base64( { extensions: ['woff'] } ) )
    .pipe( minicss() )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'jade', function () {
  gulp.src( paths.jade )
    .pipe( jade( { pretty: true } ) )
    // Import CSS: http://stackoverflow.com/questions/23820703/how-to-inject-content-of-css-file-into-html-in-gulp
    .pipe( repl( /<link rel="stylesheet" href="(.*\.css)">/g, function( s, file ) {
        return '<style>' + fs.readFileSync( file, 'utf8' ) + '</style>'
    } ) )
    .pipe( gulp.dest( './' ) )
} )

gulp.task( 'styles-and-jade', function() {
  /*
   * Compile Jade after styles because processed styles are
   * embedded into the HTML.
   */
  sequence( 'styles', 'jade' )
} )

gulp.task( 'default', function() {
  sequence( 'styles', 'jade', 'watch' )
} )