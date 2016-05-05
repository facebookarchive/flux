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

import React, {Component} from 'react';

const ENTER_KEY_CODE = 13;

type Props = {
  className?: ?string,
  id?: ?string,
  placeholder?: ?string,
  value?: string,

  onSave: (text: string) => void,
};

type State = {
  value: string,
};

export default class TodoTextInput extends Component<void, Props, State> {
  state: State = {
    value: this.props.value || '',
  };

  render(): ?React.Element {
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        value={this.state.value}
        autoFocus={true}
      />
    );
  }

  _save = () : void => {
    this.props.onSave(this.state.value);
    this.setState({value: ''});
  }

  _onChange = (event: any) : void => {
    this.setState({value: event.target.value});
  }

  _onKeyDown = (event: any) : void => {
    if (event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  }
}
