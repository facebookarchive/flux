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
import TodoDraftStore from '../data/TodoDraftStore';
import TodoEditStore from '../data/TodoEditStore';
import TodoStore from '../data/TodoStore';

function getStores() {
  return [
    TodoEditStore,
    TodoDraftStore,
    TodoStore,
  ];
}

function getState() {
  return {
    draft: TodoDraftStore.getState(),
    editing: TodoEditStore.getState(),
    todos: TodoStore.getState(),

    onAdd: TodoActions.addTodo,
    onDeleteCompletedTodos: TodoActions.deleteCompletedTodos,
    onDeleteTodo: TodoActions.deleteTodo,
    onEditTodo: TodoActions.editTodo,
    onStartEditingTodo: TodoActions.startEditingTodo,
    onStopEditingTodo: TodoActions.stopEditingTodo,
    onToggleAllTodos: TodoActions.toggleAllTodos,
    onToggleTodo: TodoActions.toggleTodo,
    onUpdateDraft: TodoActions.updateDraft,
  };
}

export default Container.createFunctional(AppView, getStores, getState);
