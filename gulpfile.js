var gulp   = require('gulp'),
    stylus = require('gulp-stylus'),
    nib    = require('nib'),
    jade   = require('gulp-jade')

gulp.task( 'styles', function () {
  gulp.src( ['./css/flower.styl', './css/main.styl'] )
    .pipe( stylus( { use: [nib()] } ) )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'jade', function () {
  gulp.src( ['./index.jade'] )
    .pipe( jade( { pretty: true } ) )
    .pipe( gulp.dest( './' ) )
} )

gulp.task( 'default', ['styles', 'jade'] )