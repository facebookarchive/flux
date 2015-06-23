/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
__DEV__ = true; // simulate dev environment to test if errors are thrown

jest
  .dontMock('immutable')
  .dontMock('../Dispatcher')
  .dontMock('../ReduceStore')
  .dontMock('../MapStore')
  .dontMock('../Store');

var Dispatcher = require('../Dispatcher');
var MapStore = require('../MapStore');

class FooStore extends MapStore {
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

describe('MapStore', () => {
  var dispatch;
  var onChange;
  var store;

  beforeEach(() => {
    var dispatcher = new Dispatcher();
    store = new FooStore(dispatcher);
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = jest.genMockFn();
    store.__emitChange = onChange;
  });

  it('should respond to actions', () => {
    expect(store.get('foo')).toBe(undefined);
    expect(store.has('foo')).toBe(false);

    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(store.get('foo')).toBe(100);
    expect(store.has('foo')).toBe(true);
  });

  it('should only emit one change for multiple cache changes', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.get('foo')).toBe(100);

    dispatch({
      type: 'foobar',
      foo: 200,
      bar: 400,
    });

    expect(onChange.mock.calls.length).toBe(2);
    expect(store.get('foo')).toBe(200);
    expect(store.get('bar')).toBe(400);
  });

  it('should not emit for empty changes', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.get('foo')).toBe(100);

    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.get('foo')).toBe(100);
  });

  it('should clear the cache', () => {
    dispatch({
      type: 'foo',
      foo: 100,
    });

    expect(onChange.mock.calls.length).toBe(1);
    expect(store.get('foo')).toBe(100);

    dispatch({type: 'boom'});

    expect(onChange.mock.calls.length).toBe(2);
    expect(store.get('foo')).toBe(undefined);
    expect(store.has('foo')).toBe(false);
  });
});
