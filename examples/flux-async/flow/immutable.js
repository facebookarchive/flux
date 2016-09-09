/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

// Not sure why this is necessary, but here we directly alias the
// flow typedefs inside of immutable to the module "immutable".

import type Immutable from 'immutable/dist/immutable.js.flow'

declare module 'immutable' {
  declare var exports: Immutable;
}
