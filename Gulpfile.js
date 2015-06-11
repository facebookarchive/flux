var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

var browserifyConfig = {
  entries: ['./index.js'],
  standalone: 'Flux'
};

gulp.task('clean', function(cb) {
  del(['lib/', 'Flux.js'], cb);
});

gulp.task('lib', function() {
  return gulp.src('src/*.js')
             .pipe(babel({
               loose: true,
               blacklist: ['spec.functionName'],
               optional: ['utility.inlineEnvironmentVariables']
              }))
             .pipe(gulp.dest('lib'));

});

gulp.task('browserify', ['lib'], function() {
  return browserify(browserifyConfig)
          .bundle()
          .pipe(source('Flux.js'))
          .pipe(gulp.dest('./dist/'))
});

gulp.task('build', ['lib', 'browserify']);

gulp.task('publish', function(cb) {
  runSequence('clean', 'build', cb);
});

gulp.task('default', ['build']);
