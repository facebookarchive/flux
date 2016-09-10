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

'use strict';

const PREFIX = 'FAKE_';
let count = 0;

/**
 * This generated fake ids we can use to optimistically update the UI.
 */
const FakeID = {
  next(): string {
    return PREFIX + (++count);
  },
};

export default FakeID;
