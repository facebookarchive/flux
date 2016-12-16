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

import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import FakeID from '../utils/FakeID';
import Todo from '../records/Todo';
import TodoDispatcher from '../TodoDispatcher';
import TodoDraftStore from '../stores/TodoDraftStore';
import TodoListStore from '../stores/TodoListStore';
import TodoStore from '../stores/TodoStore';

function getStores() {
  return [
    TodoDraftStore,
    TodoListStore,
    TodoStore,
  ];
}

function getState() {
  const todos = TodoStore.getState();
  const ids = TodoListStore.getState();

  // Figure out which ids are being deleted.
  const deletedIDs = new Set();
  todos.forEach((lo, id) => {
    if (lo.isDeleting()) {
      deletedIDs.add(id);
    }
  });

  return {
    draft: TodoDraftStore.getState(),

    // Then optimistically remove todos that are being deleted.
    ids: ids.map(list => list.filter(id => !deletedIDs.has(id))),
    todos: todos.filter((_, id) => !deletedIDs.has(id)),

    onDelete,
    onDraftCreate,
    onDraftSet,
    onRetry,
    onUpdateTodos,
  };
}

function onDelete(ids: Array<string>) {
  TodoDispatcher.dispatch({
    type: 'todos/start-delete',
    ids,
  });
}

function onDraftCreate(value: string) {
  if (value && value.trim()) {
    TodoDispatcher.dispatch({
      type: 'todo/start-create',
      fakeID: FakeID.next(),
      value,
    });
  }
}

function onDraftSet(value: string) {
  TodoDispatcher.dispatch({
    type: 'draft/set',
    value,
  });
}

function onRetry(todo: Todo) {
  if (FakeID.isFake(todo.id)) {
    // If it's a fakeID we had an error creating it, try again.
    TodoDispatcher.dispatch({
      type: 'todo/start-create',
      value: todo.text,
      fakeID: todo.id,
    });
  } else {
    // It it's a real ID we had an error loading it, try again.
    TodoDispatcher.dispatch({
      type: 'todos/start-load',
      ids: [todo.id],
    });
  }
}

function onUpdateTodos(todos: Array<Todo>) {
  TodoDispatcher.dispatch({
    type: 'todos/start-update',
    ids: todos.map(todo => todo.id),
    texts: todos.map(todo => todo.text),
    completes: todos.map(todo => todo.complete),
  });
}

export default Container.createFunctional(AppView, getStores, getState);
