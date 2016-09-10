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

import type {Action} from '../TodoActions';

import FakeID from '../utils/FakeID';
import Immutable from 'immutable';
import LoadObject from '../load_object/LoadObject';
import LoadObjectMap from '../load_object/LoadObjectMap';
import {ReduceStore} from 'flux/utils';
import TodoDataManager from '../data_managers/TodoDataManager';
import TodoDispatcher from '../TodoDispatcher';
import Todo from '../records/Todo';

type State = LoadObjectMap<string, Todo>;

class TodoStore extends ReduceStore<Action, State> {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState(): State {
    return new LoadObjectMap(keys => TodoDispatcher.dispatch({
      type: 'todos/start-load',
      ids: Array.from(keys),
    }));
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {

      ///// Creating /////

      case 'todo/start-create':
        TodoDataManager.create(action.value, action.fakeID);
        // Optimistically create the todo with the fakeID.
        return state.set(
          action.fakeID,
          LoadObject.creating().setValue(new Todo({
            id: action.fakeID,
            text: action.value,
            complete: false,
          })),
        );

      case 'todo/created':
        // Replace the optimistic todo with the real data.
        return state
          .delete(action.fakeID)
          .set(action.todo.id, LoadObject.withValue(action.todo));

      case 'todo/create-error':
        // Clear the operation and save the error when there is one.
        return state.update(
          action.fakeID,
          lo => lo.setError(action.error).done(),
        );

      ///// Loading /////

      case 'todos/start-load':
        TodoDataManager.loadTodos(action.ids);
        return state.merge(action.ids.map(id => [id, LoadObject.loading()]));

      case 'todos/loaded':
        return state.merge(action.todos.map(todo => [
          todo.id,
          LoadObject.withValue(todo),
        ]));

      case 'todos/load-error':
        return state.merge(action.ids.map(id => [
          id,
          LoadObject.withError(action.error),
        ]));

      ///// Updating /////

      case 'todos/start-update': {
        let nextState = state;
        // We need to save the original todos so we know what to revert to
        // in case of a failure.
        const originalTodos = [];
        action.ids.forEach((id, i) => {
          const todoLo = state.get(id);
          if (!todoLo.hasValue()) {
            return;
          }
          originalTodos.push(todoLo.getValueEnforcing());
          nextState = nextState.update(id, lo => lo.updating().map(todo => {
            return todo
              .set('text', action.texts[i])
              .set('complete', action.completes[i]);
          }));
        });
        TodoDataManager.updateTodos(
          action.ids,
          action.texts,
          action.completes,
          originalTodos,
        );
        return nextState;
      }

      case 'todos/updated':
        return state.merge(action.todos.map(todo => [
          todo.id,
          LoadObject.withValue(todo),
        ]));

      case 'todos/update-error':
        return state.merge(action.originalTodos.map(todo => [
          todo.id,
          LoadObject.withValue(todo).setError(action.error),
        ]));

      ///// Deleting /////

      case 'todos/start-delete': {
        let nextState = state;
        const realIDs = [];
        action.ids.forEach(id => {
          if (FakeID.isFake(id)) {
            nextState = nextState.delete(id);
          } else {
            realIDs.push(id);
            nextState = nextState.update(id, lo => lo.deleting());
          }
        });
        TodoDataManager.deleteTodos(realIDs);
        return nextState;
      }

      case 'todos/deleted':
        const idSet = new Set(action.ids);
        return state.filter((_, id) => !idSet.has(id));

      case 'todos/delete-error': {
        let nextState = state;
        action.ids.forEach(id => {
          nextState = nextState.update(
            id,
            lo => lo.setError(action.error).done(),
          );
        });
        return nextState;
      }

      default:
        return state;
    }
  }
}

export default new TodoStore();
