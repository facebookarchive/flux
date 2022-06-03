/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

module.exports = {
  presets: [
    require('babel-preset-fbjs/configure')({
      rewriteModules: {
        map: {
          react: 'react',
          fbemitter: 'fbemitter',
          immutable: 'immutable',
          invariant: 'fbjs/lib/invariant',
          shallowEqual: 'fbjs/lib/shallowEqual',
        },
      },
      stripDEV: true,
    }),
  ],
};
