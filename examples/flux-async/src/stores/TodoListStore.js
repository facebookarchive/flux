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

import Immutable from 'immutable';
import LoadObject from '../load_object/LoadObject';
import LoadObjectState from '../load_object/LoadObjectState';
import {ReduceStore} from 'flux/utils';
import TodoDataManager from '../data_managers/TodoDataManager';
import TodoDispatcher from '../TodoDispatcher';

type State = LoadObjectState<Immutable.List<string>>;

class TodoListStore extends ReduceStore<Action, State> {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState(): State {
    return new LoadObjectState(() => TodoDispatcher.dispatch({
      type: 'ids/start-load',
    }));
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'draft/create':
        return state.map(list => list.push(action.fakeID));

      case 'ids/start-load':
        TodoDataManager.loadIDs();
        return state.setLoadObject(LoadObject.loading());

      case 'ids/loaded':
        return state.setLoadObject(LoadObject.withValue(
          Immutable.List(action.ids)
        ));

      case 'ids/load-error':
        return state.setLoadObject(LoadObject.withError(action.error));

      case 'todo/created':
        // This replaces the fake ID we added optimistically with the real id.
        return state.map(list => list.map(
          id => id === action.fakeID ? action.todo.id : id
        ));

      case 'todo/create-error':
        // We don't need to remove the id on an error. It will be updated to
        // have an error and the user can explicitly remove it.
        return state;

      default:
        return state;
    }
  }
}

export default new TodoListStore();
