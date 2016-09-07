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
import TodoActionTypes from '../../flux-todomvc/src/data/TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

// This would be the util for logging data to wherver you want to keep it.
// For now we will just log it to the console.
const TodoLogger = {
  log(...args) {
    console.log(...args);
  },
};

class TodoLoggerStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    // We don't actually have any state in this store. Eventually you may want
    // to keep state here in order to track "sequences of actions", but we won't
    // cover that in this example.
    return null;
  }

  reduce(state, action) {
    // We will always log the action type. Could extend this to log the entire
    // action, but depending on your actions and applications that could be a
    // large amount of data.
    TodoLogger.log('general_action_logging', action.type);

    // Here we can log additional information for specific action types we
    // care about. Can handle any kind of action here from any store.
    switch (action.type) {
      case TodoActionTypes.DELETE_TODO:
        TodoLogger.log('direct_deletion', action.id);
        break;
    }

    // Always return the old state.
    return state;
  }
}

export default new TodoLoggerStore();
