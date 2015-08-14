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

'use strict';

import Immutable from 'immutable';

const TodoRecord = Immutable.Record({
  id: undefined,
  complete: undefined,
  text: undefined,
});

export default class Todo extends TodoRecord {
  id: string;
  complete: boolean;
  text: string;

  constructor(text: string) {
    super({
      id: Date.now() + Math.round(Math.random() * 1000),
      complete: false,
      text,
    });
  }
}
