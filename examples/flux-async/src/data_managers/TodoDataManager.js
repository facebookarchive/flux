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

import Todo from '../records/Todo';
import TodoAPI from './TodoAPI';
import TodoDispatcher from '../TodoDispatcher';

const TodoDataManager = {
  create(text: string) {
    TodoAPI
      .post('/todo/create', {text})
      .then(rawTodo => {
        TodoDispatcher.dispatch({
          type: 'todo/created',
          todo: new Todo(rawTodo),
        });
      })
      .catch(error => {
        throw error;
      });
  },

  loadIDs() {
    TodoAPI
      .get('/ids')
      .then(ids => {
        TodoDispatcher.dispatch({
          type: 'ids/loaded',
          ids,
        });
      })
      .catch(error => {
        TodoDispatcher.dispatch({
          type: 'ids/load-error',
          error,
        });
      });
  },

  loadTodos(ids: Array<string>) {
    TodoAPI
      .get('/todos', {ids})
      .then(rawTodos => {
        TodoDispatcher.dispatch({
          type: 'todos/loaded',
          todos: rawTodos.map(rawTodo => new Todo(rawTodo)),
        });
      })
      .catch(error => {
        TodoDispatcher.dispatch({
          type: 'todos/load-error',
          ids,
          error,
        });
      });
  },
};


export default TodoDataManager;
