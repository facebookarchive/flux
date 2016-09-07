/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import AppContainer from '../../../flux-todomvc/src/containers/AppContainer';
import Counter from '../../../flux-todomvc/src/data/Counter';
import Immutable from 'immutable';
import React from 'react';
import Todo from '../../../flux-todomvc/src/data/Todo';
import TodoDraftStore from '../../../flux-todomvc/src/data/TodoDraftStore';
import TodoEditStore from '../../../flux-todomvc/src/data/TodoEditStore';
import TodoStore from '../../../flux-todomvc/src/data/TodoStore';

import renderer from 'react-test-renderer';

describe('AppContainer', function() {

  // Set up functions to help mock the data in each store that is used by
  // our container. If there are child containers you may also need to mock that
  // data as well. We do not need to mock all of the callbacks because we are
  // just testing how it renders at a particular point in time. If you also
  // wanted to test how the callbacks behave you would need to make these helper
  // functions actually inject their data into the stores rather than
  // overridding each store's getState() function. As your application grows
  // you should move these into test utils that can be reused across tests for
  // many containers. This should prevent the need for any code to be in the
  // beforeEach() function of your container tests.
  beforeEach(function() {

    let editStore = '';
    this.setEditID = (id) => editStore = id;

    let draftStore = '';
    this.setDraftText = (text) => draftStore = text;

    let todoStore = Immutable.OrderedMap();
    this.setTodos = (todos) => {
      todos.forEach(todo => {
        const id = Counter.increment();
        todoStore = todoStore.set(
          id,
          new Todo({id, text: todo.text, complete: !!todo.complete}),
        );
      });
    };

    // Because of how TodoStore is set up it's not easy to get access to ids of
    // todos. This will get the id of a particular todo based on the index it
    // was added to state in.
    this.id = (index) => {
      if (todoStore.size <= index) {
        throw new Error(
          'Requested id for an index that is larger than the size of the ' +
          'current state.'
        );
      }
      return Array.from(todoStore.keys())[index];
    };

    // Override all the get state's to read from our fake data.
    TodoDraftStore.getState = () => draftStore;
    TodoEditStore.getState = () => editStore;
    TodoStore.getState = () => todoStore;

    // Simple helper so tests read easier.
    this.render = () => renderer.create(<AppContainer />).toJSON();
  });

  ///// Begin tests /////

  it('renders some todos', function() {
    this.setTodos([
      {text: 'Hello', complete: false},
      {text: 'World!', complete: false},
      // Uncomment this to see what it looks like when a snapshot doesn't match.
      // {text: 'Some changes', complete: false},
    ]);

    expect(this.render()).toMatchSnapshot();
  });

  it('renders with no todos', function() {
    expect(this.render()).toMatchSnapshot();
  });

  it('renders todos that are complete', function() {
    this.setTodos([
      // Try changing complete to "true" for test0 to see how snapshot changes.
      {text: 'test0', complete: false},
      {text: 'test1', complete: true},
      {text: 'test2', complete: true},
      {text: 'test3', complete: false},
    ]);

    expect(this.render()).toMatchSnapshot();
  });

  it('can edit task that is not complete', function() {
    this.setTodos([
      {text: 'test0', complete: false},
      {text: 'test1', complete: true},
      {text: 'test2', complete: true},
      {text: 'test3', complete: false},
    ]);

    this.setEditID(this.id(0));

    expect(this.render()).toMatchSnapshot();
  });

  it('can edit task that is complete', function() {
    this.setTodos([
      {text: 'test0', complete: false},
      {text: 'test1', complete: true},
      {text: 'test2', complete: true},
      {text: 'test3', complete: false},
    ]);

    this.setEditID(this.id(1));

    expect(this.render()).toMatchSnapshot();
  });

  it('renders draft with todos', function() {
    this.setTodos([
      {text: 'test0', complete: false},
    ]);

    this.setDraftText('test1');

    expect(this.render()).toMatchSnapshot();
  });

  it('renders draft with no todos', function() {
    this.setDraftText('test0');

    expect(this.render()).toMatchSnapshot();
  });

  it('renders draft with todos while editing', function() {
    this.setTodos([
      {text: 'test0', complete: false},
      {text: 'test1', complete: false},
    ]);

    this.setEditID(this.id(1));

    this.setDraftText('test1 edit');

    expect(this.render()).toMatchSnapshot();
  });
});
