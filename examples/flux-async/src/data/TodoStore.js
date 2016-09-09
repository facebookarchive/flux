/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import LoadObjectMap from '../load_object/LoadObjectMap';
import {ReduceStore} from 'flux/utils';
import Todo from './Todo';
import TodoActions from './TodoActions';
import TodoActionTypes from './TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

class TodoStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return new LoadObjectMap(todoIDs => TodoActions.loadAll(todoIDs));
  }

  reduce(state, action) {
    switch (action.type) {

      // These actions deal with getting data from data manager.

      case TodoActionTypes.LOAD_TODOS:
        // Tell the data manager to load all of these ids, and then mark them
        // as loading in the store.
        TodoDataManager.loadTodos(todoIDs);
        return state.merge(action.todoIDs.map(todoID => [
          todoID,
          LoadObject.loading(),
        ]));

      // TODO: Move some of this load object stuff into data manager, it is
      // tightly coupled to a request so it's okay for data manager to know
      // about LoadObject.
      case TodoActionTypes.TODOS_LOADED:
        // Mark all of these as loaded and then merge with current state.
        const loaded = Array.from(action.todos.values()).map(todo => [
          todo.id,
          LoadObject.withValue(todo),
        ]);
        return state.merge(loaded);

      case TodoActionTypes.TODOS_LOAD_ERROR:
        const errors = Array.from(action.errors.values()).map((error, key) => [
          key,
          LoadObject.withError(error),
        ]);
        return state.merge(errors);

      // These handle UI actions that do things.

      case TodoActionTypes.ADD_TODO:
        if (action.text && action.text.trim()) {
          TodoDataManager.create(action.text, false);
        }
        return state;

      case TodoActionTypes.DELETE_COMPLETED_TODOS:
        const idsToDelete = state
          .filter(lo => (!lo.hasValue() || lo.getValue().complete))
          .getKeys();
        TodoDataManager.deleteAll(idsToDelete);
        return state;

      case TodoActionTypes.DELETE_TODO:
        TodoDataManager.deleteAll([action.id]);
        return state;

      case TodoActionTypes.TOGGLE_ALL_TODOS:
        const allComplete = state
          .filter(lo => lo.hasValue())
          .every(lo => lo.getValue().complete);
        if (allComplete) {
          // Do something.
        } else {
          // Do something else.
        }
        return state;

      default:
        return state;
    }
  }
}

export default new TodoStore();
