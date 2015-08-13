/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import type {Action} from './TodoActions';

import {Dispatcher} from 'flux';

class TodoDispatcher extends Dispatcher<Action> {
  constructor() {
    super();
    // bind to this so we can do: import {dispatch} from './TodoDispatcher';
    (this: any).dispatch = this.dispatch.bind(this);
  }
}

const instance = new TodoDispatcher();
export default instance;
