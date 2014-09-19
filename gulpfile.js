var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    nib      = require('nib'),
    jade     = require('gulp-jade'),
    minicss  = require('gulp-minify-css'),
    concat   = require('gulp-concat'),
    fs       = require('fs'),
    repl     = require('gulp-replace'),
    sequence = require('run-sequence')

var paths = {
  styles: ['./css/flower.styl', './css/main.styl'],
  jades: './index.jade'
}

gulp.task( 'watch', function() {
  gulp.watch( paths.styles, ['styles'] )
  gulp.watch( paths.jades, ['jade'] )
} )

gulp.task( 'styles', function () {
  return gulp.src( paths.styles )
    .pipe( stylus( { use: [ nib() ] } ) )
    .pipe( concat( 'styles.css' ) )
    .pipe( minicss() )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'jade', function () {
  gulp.src( paths.jades )
    .pipe( jade( { pretty: true } ) )
    // Import CSS: http://stackoverflow.com/questions/23820703/how-to-inject-content-of-css-file-into-html-in-gulp
    .pipe( repl( /<link rel="stylesheet" href="(.*\.css)">/g, function( s, file ) {
        return '<style>' + fs.readFileSync( file, 'utf8' ) + '</style>'
    } ) )
    .pipe( gulp.dest( './' ) )
} )

gulp.task( 'default', function() {
  sequence( 'styles', 'jade', 'watch' )
} )