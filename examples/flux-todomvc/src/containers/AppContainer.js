/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import TodoActions from '../data/TodoActions';
import TodoDispatcher from '../data/TodoDispatcher';
import TodoStore from '../data/TodoStore';

const {deleteTodo, toggleTodo} = TodoActions;
const dispatch = TodoDispatcher.dispatch.bind(TodoDispatcher);

function getStores() {
  return [
    TodoStore,
  ];
}

function getState() {
  return {
    todos: TodoStore.getState(),

    onDeleteTodo: id => dispatch(deleteTodo(id)),
    onToggleTodo: id => dispatch(toggleTodo(id)),
  };
}

export default Container.createFunctional(AppView, getStores, getState);
