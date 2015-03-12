/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore-test
 */

jest.dontMock('../../constants/TodoConstants');
jest.dontMock('../TodoStore');
jest.dontMock('object-assign');

describe('TodoStore', function() {

  var TodoConstants = require('../../constants/TodoConstants');
  var AppDispatcher;
  var TodoStore;
  var callback;

  // mock actions
  var actionTodoCreate = {
    actionType: TodoConstants.TODO_CREATE,
    text: 'foo'
  };
  var actionTodoDestroy = {
    actionType: TodoConstants.TODO_DESTROY,
    id: 'replace me in test'
  };

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/AppDispatcher');
    TodoStore = require('../TodoStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no to-do items', function() {
    var all = TodoStore.getAll();
    expect(all).toEqual({});
  });

  it('creates a to-do item', function() {
    callback(actionTodoCreate);
    var all = TodoStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    expect(all[keys[0]].text).toEqual('foo');
  });

  it('destroys a to-do item', function() {
    callback(actionTodoCreate);
    var all = TodoStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    actionTodoDestroy.id = keys[0];
    callback(actionTodoDestroy);
    expect(all[keys[0]]).toBeUndefined();
  });

  it('can determine whether all to-do items are complete', function() {
    var i = 0;
    for (; i < 3; i++) {
      callback(actionTodoCreate);
    }
    expect(Object.keys(TodoStore.getAll()).length).toBe(3);
    expect(TodoStore.areAllComplete()).toBe(false);

    var all = TodoStore.getAll();
    for (key in all) {
      callback({
        actionType: TodoConstants.TODO_COMPLETE,
        id: key
      });
    }
    expect(TodoStore.areAllComplete()).toBe(true);

    callback({
      actionType: TodoConstants.TODO_UNDO_COMPLETE,
      id: key
    });
    expect(TodoStore.areAllComplete()).toBe(false);
  });

});
