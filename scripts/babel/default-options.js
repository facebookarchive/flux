/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var assign = require('object-assign');

var babelPluginDEV = require('fbjs-scripts/babel/dev-expression');
var babelPluginModules = require('fbjs-scripts/babel/rewrite-modules');

var moduleMap = require('fbjs/module-map');

module.exports = {
  stage: 1,
  blacklist: [
    'spec.functionName',
  ],
  loose: true,
  plugins: [babelPluginDEV, babelPluginModules],
  _moduleMap: assign({}, moduleMap, {
    'fbemitter': 'fbemitter',
    'immutable': 'immutable',
    'react': 'react',
  }),
};
