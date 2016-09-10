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

import Immutable from 'immutable';

declare class Todo {
  id: string;
  complete: boolean;
  text: string;

  constructor(data: {
    id: string;
    complete: boolean;
    text: string;
  }): void;

  set(key: 'id', value: string): Todo;
  set(key: 'complete', value: boolean): Todo;
  set(key: 'text', value: string): Todo;
}

// $FlowExpectedError: Intentional rebinding for flow.
const Todo = Immutable.Record({
  id: '',
  complete: false,
  text: '',
});

export default Todo;
