var gulp = require('gulp');
var browserify = require('browserify');
var bundleCollapser = require('bundle-collapser/plugin');
var derequire = require('derequire/plugin');
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
  var b = browserify(browserifyConfig)
    .plugin(bundleCollapser)
    .plugin(derequire);
  return b.bundle()
          .pipe(source('Flux.js'))
          .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['lib', 'browserify']);

gulp.task('publish', function(cb) {
  runSequence('clean', 'build', cb);
});

gulp.task('default', ['build']);
