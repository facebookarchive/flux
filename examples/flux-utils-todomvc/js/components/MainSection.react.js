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

import type Immutable from 'immutable';
import type Todo from '../flux-infra/Todo';

import {dispatch} from '../flux-infra/TodoDispatcher';
import React, {Component} from 'react';
import TodoItem from './TodoItem.react';

type Props = {
  todos: Immutable.Map<string, Todo>,
  areAllComplete: boolean,
};

export default class MainSection extends Component<void, Props, void> {
  render(): ?React.Element {
    const {todos, areAllComplete} = this.props;

    if (todos.size === 0) {
      return null;
    }

    const todoItems = [];
    for (let [id, todo] of todos) {
      todoItems.push(<TodoItem key={id} todo={todo} />);
    }

    return (
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={areAllComplete ? 'checked' : ''}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul id="todo-list">{todoItems}</ul>
      </section>
    );
  }

  _onToggleCompleteAll(): void {
    dispatch({type: 'todo/toggle-complete-all'});
  }
}
