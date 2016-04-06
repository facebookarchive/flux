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

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

import type Immutable from 'immutable';
import type {Store} from 'flux/utils';
import type Todo from '../flux-infra/Todo';

import {Container} from 'flux/utils';
import Footer from './Footer.react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React, {Component} from 'react';
import TodoStore from '../flux-infra/TodoStore';

type State = {
  todos: Immutable.Map<string, Todo>,
  areAllComplete: boolean,
};

class TodoApp extends Component<void, void, State> {
  state: State;

  static getStores(): Array<Store> {
    return [TodoStore];
  }

  static calculateState(prevState: ?State): State {
    return {
      todos: TodoStore.getState(),
      areAllComplete: TodoStore.areAllComplete(),
    };
  }

  render(): ?React.Element {
    return (
      <div>
        <Header />
        <MainSection
          todos={this.state.todos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer todos={this.state.todos} />
      </div>
    );
  }
}

const TodoAppContainer = Container.create(TodoApp);
export default TodoAppContainer;
