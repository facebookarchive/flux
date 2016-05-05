/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+uiecommd
 */

jest
  .dontMock('Dispatcher')
  .dontMock('FluxReduceStore')
  .dontMock('FluxStore');

var Dispatcher = require('Dispatcher');
var FluxReduceStore = require('FluxReduceStore');
var Immutable = require('immutable');

class FooStore extends FluxReduceStore {
  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case 'foo':
        return state.set('foo', action.foo);
      case 'bar':
        return state.set('bar', action.bar);
      case 'foobar':
        return state.set('foo', action.foo).set('bar', action.bar);
      case 'boom':
        return state.clear();
      default:
        return state;
    }
  }
}

describe('FluxReduceStore', () => {
  var dispatch;
  var onChange;
  var store;

  beforeEach(() => {
    var dispatcher = new Dispatcher();
    store = new FooStore(dispatcher);
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = store.__emitter.emit;
  });

  it('should respond to actions', () => {
    expect(store.getState().get('foo')).toBe(undefined);
    expect(store.getState().has('foo')).toBe(false);

    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(store.getState().get('foo')).toBe(100);
    expect(store.getState().has('foo')).toBe(true);
  });

  it('should only emit one change for multiple cache changes', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.getState().get('foo')).toBe(100);

    dispatch({
      type: 'foobar',
      foo: 200,
      bar: 400,
    });

    expect(onChange.mock.calls.length).toBe(2);
    expect(store.getState().get('foo')).toBe(200);
    expect(store.getState().get('bar')).toBe(400);
  });

  it('should not emit for empty changes', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.getState().get('foo')).toBe(100);

    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.getState().get('foo')).toBe(100);
  });

  it('should clear the cache', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.getState().get('foo')).toBe(100);

    dispatch({type: 'boom'});

    expect(onChange.mock.calls.length).toBe(2);
    expect(store.getState().get('foo')).toBe(undefined);
    expect(store.getState().has('foo')).toBe(false);
  });
});
