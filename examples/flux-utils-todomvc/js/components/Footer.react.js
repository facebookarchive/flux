/**
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

import type Immutable from 'immutable';
import type Todo from '../flux-infra/Todo';

import React, {Component} from 'react';
import {dispatch} from '../flux-infra/TodoDispatcher';

type Props = {
  todos: Immutable.Map<string, Todo>,
};

export default class Footer extends Component<void, Props, void> {
  render(): ?React.Element {
    const {todos} = this.props;

    if (todos.size === 0) {
      return null;
    }

    const completed = todos.reduce((x, todo) => todo.complete ? x + 1 : x, 0);
    const itemsLeft = todos.size - completed;
    const itemsLeftPhrase = itemsLeft === 1 ? ' item left' : ' items left';

    let clearCompletedButton;
    if (completed > 0) {
      clearCompletedButton =
        <button
          id="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed ({completed})
        </button>;
    }

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  }

  _onClearCompletedClick(): void {
    dispatch({type: 'todo/destroy-completed'});
  }
}
