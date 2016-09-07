/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import Counter from '../../../flux-todomvc/src/data/Counter';
import Todo from '../../../flux-todomvc/src/data/Todo';
import TodoActionTypes from '../../../flux-todomvc/src/data/TodoActionTypes';
import TodoStore from '../../../flux-todomvc/src/data/TodoStore';

describe('TodoStore', function() {

  // Before each test case we set up some helper functions that makes the tests
  // easier to read. It's okay to have a fair amount of helper functions as long
  // as they make the tests simpler to read and write. Depending on the
  // complexity of your store it is perfectly reasonable to factor these out
  // into a separate `TodoTestHelpers.js` file that can be reused -- and then
  // you could write tests for the helpers too! :P (we actually do this for our
  // main stores)
  beforeEach(function() {
    // Always start with the initial state.
    this.state = TodoStore.getInitialState();

    // This function gets a more readable form of the todos that we can pass
    // to expect().
    this.todos = () => Array.from(this.state.values()).map(todo => ({
      text: todo.text,
      complete: !!todo.complete,
    }));

    // This function is for setting up data, it will add all the todos to the
    // state in a direct way.
    this.addTodos = (todos) => {
      todos.forEach(todo => {
        const id = Counter.increment();
        this.state = this.state.set(
          id,
          new Todo({id, text: todo.text, complete: !!todo.complete}),
        );
      });
    };

    // Because of how TodoStore is set up it's not easy to get access to ids of
    // todos. This will get the id of a particular todo based on the index it
    // was added to state in.
    this.id = (index) => {
      if (this.state.size <= index) {
        throw new Error(
          'Requested id for an index that is larger than the size of the ' +
          'current state.'
        );
      }
      return Array.from(this.state.keys())[index];
    };

    // This "dispatches" an action to our store. We can bypass the dispatcher
    // and just call the store's reduce function directly.
    this.dispatch = action => {
      this.state = TodoStore.reduce(this.state, action);
    };
  });

  ///// Begin tests /////

  it('can add multiple todos', function() {
    expect(this.todos()).toEqual([]);

    this.dispatch({
      type: TodoActionTypes.ADD_TODO,
      text: 'test0',
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
    ]);

    this.dispatch({
      type: TodoActionTypes.ADD_TODO,
      text: 'test1',
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
      {text: 'test1', complete: false},
    ]);
  });

  it('only removes completed todos', function() {
    this.addTodos([
      {text: 'test0', complete: false},
      {text: 'test1', complete: true},
      {text: 'test2', complete: false},
    ]);

    this.dispatch({type: TodoActionTypes.DELETE_COMPLETED_TODOS});

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
      {text: 'test2', complete: false},
    ]);
  });

  it('can delete a specific todo', function() {
    this.addTodos([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
      {text: 'test2', complete: false},
    ]);

    this.dispatch({
      type: TodoActionTypes.DELETE_TODO,
      id: this.id(2),
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
    ]);

    this.dispatch({
      type: TodoActionTypes.DELETE_TODO,
      id: this.id(0),
    });

    expect(this.todos()).toEqual([
      {text: 'test1', complete: true},
    ]);
  });

  it('can edit a specific todo', function() {
    this.addTodos([
      {text: 'test0', complete: false},
      {text: 'test1', complete: false},
      {text: 'test2', complete: false},
    ]);

    this.dispatch({
      type: TodoActionTypes.EDIT_TODO,
      id: this.id(1),
      text: 'foobar',
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
      {text: 'foobar', complete: false},
      {text: 'test2', complete: false},
    ]);
  });

  it('marks all todos complete if any are incomplete', function() {
    this.addTodos([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
      {text: 'test2', complete: false},
    ]);

    this.dispatch({type: TodoActionTypes.TOGGLE_ALL_TODOS});

    expect(this.todos()).toEqual([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
      {text: 'test2', complete: true},
    ]);
  });

  it('marks all todos incomplete if all are complete', function() {
    this.addTodos([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
      {text: 'test2', complete: true},
    ]);

    this.dispatch({type: TodoActionTypes.TOGGLE_ALL_TODOS});

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
      {text: 'test1', complete: false},
      {text: 'test2', complete: false},
    ]);
  });

  it('toggles a particular todo', function() {
    this.addTodos([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
    ]);

    this.dispatch({
      type: TodoActionTypes.TOGGLE_TODO,
      id: this.id(0),
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: false},
      {text: 'test1', complete: true},
    ]);

    this.dispatch({
      type: TodoActionTypes.TOGGLE_TODO,
      id: this.id(0),
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: true},
      {text: 'test1', complete: true},
    ]);

    this.dispatch({
      type: TodoActionTypes.TOGGLE_TODO,
      id: this.id(1),
    });

    expect(this.todos()).toEqual([
      {text: 'test0', complete: true},
      {text: 'test1', complete: false},
    ]);
  });
});
