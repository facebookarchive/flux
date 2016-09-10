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

import type Todo from './records/Todo';

export type Action =

  // UI Actions for updating the draft.
  | {
    type: 'draft/create',
    value: string,
    fakeID: string,
  }
  | {
    type: 'draft/set',
    value: string,
  }

  // Dealing with todo ids.
  | {
    type: 'ids/start-load',
  }
  | {
    type: 'ids/loaded',
    ids: Array<string>,
  }
  | {
    type: 'ids/load-error',
    error: Error,
  }

  // Reading todos.
  | {
    type: 'todos/start-load',
    ids: Array<string>,
  }
  | {
    type: 'todos/loaded',
    todos: Array<Todo>,
  }
  | {
    type: 'todos/load-error',
    ids: Array<string>,
    error: Error,
  }

  // Creating todos.
  | {
    type: 'todo/created',
    todo: Todo,
    fakeID: string,
  }
  | {
    type: 'todo/create-error',
    error: Error,
    fakeID: string,
  }

  // This is a semi-colon, all hail the mighty semi-colon.
  ;
