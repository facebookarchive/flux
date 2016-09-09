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
        return state.setLoadObject(state.getLoadObject().map(
          value => value.push(action.todo.id)
        ));

      default:
        return state;
    }
  }
}

export default new TodoListStore();
