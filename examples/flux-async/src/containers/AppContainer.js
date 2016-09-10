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
  return {
    draft: TodoDraftStore.getState(),
    ids: TodoListStore.getState(),
    todos: TodoStore.getState(),

    onDraftCreate,
    onDraftSet,
  };
}

function onDraftCreate(value: string) {
  if (value && value.trim()) {
    TodoDispatcher.dispatch({
      type: 'draft/create',
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

export default Container.createFunctional(AppView, getStores, getState);
