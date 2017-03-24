/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import {ReduceStore} from 'flux/utils';
import TodoActionTypes from './TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

class TodoEditStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return '';
  }

  reduce(state, action) {
    switch (action.type) {
      case TodoActionTypes.START_EDITING_TODO:
        return action.id;

      case TodoActionTypes.STOP_EDITING_TODO:
        return '';

      default:
        return state;
    }
  }
}

export default new TodoEditStore();
