var babel = require('gulp-babel');
var del = require('del');
var flatten = require('gulp-flatten');
var rename = require('gulp-rename');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var webpackStream = require('webpack-stream');

var babelDefaultOptions = require('./scripts/babel/default-options');

var paths = {
  dist: './dist/',
  lib: 'lib',
  entry: './index.js',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};

var buildDist = function(opts) {
  var webpackOpts = {
    debug: opts.debug,
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel'}
      ],
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: 'Flux'
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        ),
      })
    ]
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false
        }
      })
    );
  }
  return webpackStream(webpackOpts, null, function(err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
    }
  });
};

gulp.task('clean', function() {
  return del([paths.lib, 'Flux.js']);
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(babel(babelDefaultOptions))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('flow', function() {
  return gulp
    .src(paths.src)
    .pipe(flatten())
    .pipe(rename({extname: '.js.flow'}))
    .pipe(gulp.dest(paths.lib));
});

gulp.task('dist', ['lib'], function() {
  var distOpts = {
    debug: true,
    output: 'Flux.js'
  };
  return gulp
    .src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:min', ['lib'], function() {
  var distOpts = {
    debug: false,
    output: 'Flux.min.js'
  };
  return gulp
    .src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['lib', 'flow', 'dist']);

gulp.task('publish', function(cb) {
  runSequence('clean', 'flow', ['dist', 'dist:min'], cb);
});

gulp.task('default', ['build']);
