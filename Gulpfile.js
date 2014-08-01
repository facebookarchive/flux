var gulp = require('gulp');
var gRimraf = require('gulp-rimraf');
var gReact = require('gulp-react')
var gReplace = require('gulp-replace');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var browserifyConfig = {
  entries: ['./index.js'],
  standalone: 'Flux'
};

gulp.task('clean', function() {
  return gulp.src(['lib/', 'Flux.js'], { read: false })
             .pipe(gRimraf());
});

gulp.task('lib', function() {
  return gulp.src('src/*.js')
             .pipe(gReact({harmony: true}))
             .pipe(gReplace(/__DEV__/g, 'false'))
             .pipe(gulp.dest('lib'));

});

gulp.task('browserify', function() {
  return browserify(browserifyConfig)
          .bundle()
          .pipe(source('Flux.js'))
          .pipe(gulp.dest('./'))
});

gulp.task('publish', ['clean', 'default']);
gulp.task('default', ['lib', 'browserify']);

