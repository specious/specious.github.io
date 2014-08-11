var gulp   = require('gulp'),
    stylus = require('gulp-stylus'),
    nib    = require('nib'),
    jade   = require('gulp-jade')

var paths = {
  styles: ['./css/flower.styl', './css/main.styl'],
  jades: './index.jade'
}

gulp.task( 'watch', function() {
  gulp.watch( paths.styles, ['styles'] )
  gulp.watch( paths.jades, ['jade'] )
} )

gulp.task( 'styles', function () {
  gulp.src( paths.styles )
    .pipe( stylus( { use: [nib()] } ) )
    .pipe( gulp.dest( './css' ) )
} )

gulp.task( 'jade', function () {
  gulp.src( paths.jades )
    .pipe( jade( { pretty: true } ) )
    .pipe( gulp.dest( './' ) )
} )

gulp.task( 'default', ['watch', 'styles', 'jade'] )