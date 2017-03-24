/*
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

let _counter = 1;

/**
 * This is a simple counter for providing unique ids.
 */
const Counter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default Counter;
