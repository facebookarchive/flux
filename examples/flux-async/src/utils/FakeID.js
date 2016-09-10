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

// We include some randomness so that it's not easy to create these id's through
// some other module. This should be the only place for testing fake ids.
const RANDOM_INT = Math.round(Math.random() * 10000);
const PREFIX = 'FAKE_' + RANDOM_INT + '_';

let count = 0;

/**
 * This generated fake ids we can use to optimistically update the UI.
 */
const FakeID = {
  next(): string {
    return PREFIX + (++count);
  },

  isFake(id: string): boolean {
    return id.startsWith(PREFIX);
  },
};

export default FakeID;
