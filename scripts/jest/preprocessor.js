/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const assign = require('object-assign');
const babel = require('@babel/core');
const babelOpts = require('../babel/default-options');

module.exports = {
  process: function (src, path) {
    return {
      code: babel.transform(src, assign({filename: path}, babelOpts)).code,
    };
  },
};
