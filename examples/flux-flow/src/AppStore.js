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

import type {Action} from './AppActions';

import {ReduceStore} from 'flux/utils';
import AppDispatcher from './AppDispatcher';

class AppStore extends ReduceStore<Action, string> {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState(): string {
    return 'Hello World!';
  }

  reduce(state: string, action: Action): string {
    switch (action.type) {
      case 'foo':
        return action.foo;

      // This is an error that should be caught by flow.
      case 'bar':
        // $FlowExpectedError: action type 'bar' does not have a 'foo' property.
        return action.foo;

      // This case is okay though, bar actions have a bar property.
      case 'bar':
        return action.bar;

      default:
        return state;
    }
  }
}

export default new AppStore();
