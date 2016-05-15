/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import TodoActionTypes from './TodoActionTypes';

const Actions = {
  addTodo(text) {
    return {
      type: TodoActionTypes.ADD_TODO,
      text,
    };
  },

  deleteTodo(id) {
    return {
      type: TodoActionTypes.DELETE_TODO,
      id,
    };
  },

  toggleTodo(id) {
    return {
      type: TodoActionTypes.TOGGLE_TODO,
      id,
    };
  },
};

export default Actions;
