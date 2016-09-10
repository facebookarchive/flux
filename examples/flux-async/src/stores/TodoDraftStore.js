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

import {ReduceStore} from 'flux/utils';
import TodoDataManager from '../data_managers/TodoDataManager';
import TodoDispatcher from '../TodoDispatcher';

type State = string;

class TodoDraftStore extends ReduceStore<Action, State> {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState(): State {
    return '';
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
      case 'draft/create':
        TodoDataManager.create(state, action.fakeID);
        return '';

      case 'draft/set':
        return action.value;

      default:
        return state;
    }
  }
}

export default new TodoDraftStore();
