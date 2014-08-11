var gulp   = require('gulp'),
    stylus = require('gulp-stylus'),
    nib    = require('nib')

gulp.task( 'styles', function () {
  gulp.src( ['./css/flower.styl', './css/main.styl'] )
    .pipe( stylus( { use: [nib()] } ) )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'default', ['styles'] )