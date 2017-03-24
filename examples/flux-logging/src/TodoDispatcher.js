/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import TodoStore from '../../flux-todomvc/src/data/TodoStore';

// This is just a hack due to how we are requiring things from another project.
// We need to make sure we use the correct dispatcher in our logger store and
// this is the easiest way to ensure that. You should ignore this.
const dispatcher = TodoStore.__dispatcher;

export default dispatcher;
