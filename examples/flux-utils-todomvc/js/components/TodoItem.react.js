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

import type Todo from '../flux-infra/Todo';

import {dispatch} from '../flux-infra/TodoDispatcher';
import React, {Component} from 'react';
import TodoTextInput from './TodoTextInput.react';

import classnames from 'classnames';

type Props = {
  todo: Todo,
};

type State = {
  isEditing: boolean,
};

export default class TodoItem extends Component<void, Props, State> {
  state: State = {
    isEditing: false,
  };

  render(): ?React.Element {
    const {todo} = this.props;

    let input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          className="edit"
          onSave={this._onSave}
          value={todo.text}
        />;
    }

    return (
      <li
        className={classnames({
          'completed': todo.complete,
          'editing': this.state.isEditing,
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
          />
          <label onDoubleClick={this._onDoubleClick}>
            {todo.text}
          </label>
          <button className="destroy" onClick={this._onDestroyClick} />
        </div>
        {input}
      </li>
    );
  }

  _onToggleComplete = (): void => {
    const {todo} = this.props;
    if (todo.complete) {
      dispatch({
        type: 'todo/undo-complete',
        id: todo.id,
      });
    } else {
      dispatch({
        type: 'todo/complete',
        id: todo.id,
      });
    }
  }

  _onDoubleClick = (): void => {
    this.setState({isEditing: true});
  }

  _onSave = (text: string): void => {
    const {todo} = this.props;
    dispatch({
      type: 'todo/update-text',
      id: todo.id,
      text,
    });
    this.setState({isEditing: false});
  }

  _onDestroyClick = (): void => {
    const {todo} = this.props;
    dispatch({
      type: 'todo/destroy',
      id: todo.id,
    });
  }
}
