/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import Immutable from 'immutable';

const TodoRecord = Immutable.Record({
  id: undefined,
  complete: undefined,
  text: undefined,
});

export class Todo extends TodoRecord {
  id: string;
  complete: boolean;
  text: string;

  constructor(text: string) {
    super({
      id: Date.now(),
      complete: false,
      text,
    });
  }
}
