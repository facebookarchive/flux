/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import {dispatch} from '../flux-infra/TodoDispatcher';
import React, {Component} from 'react';
import TodoTextInput from './TodoTextInput.react';

export default class Header extends Component<void, any, void> {
  render(): ?React.Element {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  }

  _onSave(text: string): void {
    if (text.trim()) {
      dispatch({
        type: 'todo/create',
        text,
      });
    }
  }
}
