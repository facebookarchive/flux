const babel = require('gulp-babel');
const del = require('del');
const flatten = require('gulp-flatten');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const header = require('gulp-header');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const webpackStream = require('webpack-stream');

const babelDefaultOptions = require('./scripts/babel/default-options');

const DEVELOPMENT_HEADER = [
  '/**',
  ' * Flux v<%= version %>',
  ' */',
].join('\n') + '\n';
const PRODUCTION_HEADER = [
  '/**',
  ' * Flux v<%= version %>',
  ' *',
  ' * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.',
  ' *',
  ' * This source code is licensed under the BSD-style license found in the',
  ' * LICENSE file in the root directory of this source tree. An additional grant',
  ' * of patent rights can be found in the PATENTS file in the same directory.',
  ' */',
].join('\n') + '\n';

const paths = {
  dist: './dist/',
  lib: 'lib',
  entry: './index.js',
  entryUtils: './utils.js',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};

const buildDist = function(opts) {
  const webpackOpts = {
    debug: opts.debug,
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel'}
      ],
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: opts.library,
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
  const distOpts = {
    debug: true,
    output: 'Flux.js',
    library: 'Flux',
  };
  return gulp
    .src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(header(DEVELOPMENT_HEADER, {
      version: process.env.npm_package_version,
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:utils', ['lib'], function() {
  const distOpts = {
    debug: true,
    output: 'FluxUtils.js',
    library: 'FluxUtils',
  };
  return gulp
    .src(paths.entryUtils)
    .pipe(buildDist(distOpts))
    .pipe(header(DEVELOPMENT_HEADER, {
      version: process.env.npm_package_version,
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:min', ['lib'], function() {
  const distOpts = {
    debug: false,
    output: 'Flux.min.js',
    library: 'Flux',
  };
  return gulp
    .src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(header(PRODUCTION_HEADER, {
      version: process.env.npm_package_version,
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:utils:min', ['lib'], function() {
  const distOpts = {
    debug: false,
    output: 'FluxUtils.min.js',
    library: 'FluxUtils',
  };
  return gulp
    .src(paths.entryUtils)
    .pipe(buildDist(distOpts))
    .pipe(header(PRODUCTION_HEADER, {
      version: process.env.npm_package_version,
    }))
    .pipe(gulp.dest(paths.dist));
});


gulp.task('build', ['lib', 'flow', 'dist', 'dist:utils']);

gulp.task('publish', function(cb) {
  runSequence(
    'clean',
    'flow',
    ['dist', 'dist:min', 'dist:utils', 'dist:utils:min'],
    cb
  );
});

gulp.task('default', ['build']);
