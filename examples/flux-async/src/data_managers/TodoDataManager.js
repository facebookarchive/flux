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
  create(text: string, fakeID: string) {
    TodoAPI
      .post('/todo/create', {text})
      .then(rawTodo => {
        TodoDispatcher.dispatch({
          type: 'todo/created',
          todo: new Todo(rawTodo),
          fakeID,
        });
      })
      .catch(error => {
        TodoDispatcher.dispatch({
          type: 'todo/create-error',
          error,
          fakeID,
        });
      });
  },

  deleteTodos(ids: Array<string>) {
    TodoAPI
      .post('/todos/delete', {ids})
      .then(() => {
        TodoDispatcher.dispatch({
          type: 'todos/deleted',
          ids,
        });
      })
      .catch(error => {
        TodoDispatcher.dispatch({
          type: 'todos/delete-error',
          error,
          ids,
        });
      });
  },

  updateTodos(
    ids: Array<string>,
    texts: Array<string>,
    completes: Array<boolean>,
    originalTodos: Array<Todo>,
  ) {
    TodoAPI
      .post('/todos/update', {ids, texts, completes})
      .then(rawTodos => {
        TodoDispatcher.dispatch({
          type: 'todos/updated',
          todos: rawTodos.map(rawTodo => new Todo(rawTodo)),
        });
      })
      .catch(error => {
        TodoDispatcher.dispatch({
          type: 'todos/update-error',
          originalTodos,
          error,
        });
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
