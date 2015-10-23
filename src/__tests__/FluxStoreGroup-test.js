/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+uiecommd
 * @typechecks
 */

jest
  .dontMock('Dispatcher')
  .dontMock('FluxStore')
  .dontMock('FluxStoreGroup');

var Dispatcher = require('Dispatcher');
var FluxStore = require('FluxStore');
var FluxStoreGroup = require('FluxStoreGroup');

class SimpleStore extends FluxStore {
  __onDispatch(payload) {
    this.__emitChange();
  }
}

describe('FluxStoreGroup', () => {
  var dispatcher;
  var storeA;
  var storeB;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    storeA = new SimpleStore(dispatcher);
    storeB = new SimpleStore(dispatcher);
  });

  it('should register a callback with the dispatcher', () => {
    var callback = jest.genMockFn();
    new FluxStoreGroup([storeA, storeB], callback);

    dispatcher.dispatch({type: 'foo'});
    expect(callback).toBeCalled();
  });

  it('should wait for the store dependencies', () => {
    var callback = jest.genMockFn().mockImplementation(() => {
      expect(storeA.hasChanged()).toBe(true);
      expect(storeB.hasChanged()).toBe(true);
    });
    new FluxStoreGroup([storeA, storeB], callback);

    dispatcher.dispatch({type: 'foo'});
    expect(callback).toBeCalled();
  });

  it('should not run the callback after being released', () => {
    var callback = jest.genMockFn();
    var group = new FluxStoreGroup([storeA, storeB], callback);
    group.release();

    dispatcher.dispatch({type: 'foo'});
    expect(callback).not.toBeCalled();
  });

  it('should have at least one store', () => {
    var callback = jest.genMockFn();
    expect(() => new FluxStoreGroup([], callback)).toThrow();
  });

  it('should make sure dispatchers are uniform in DEV', () => {
    var callback = jest.genMockFn();
    var storeC = new SimpleStore(new Dispatcher());
    expect(() => new FluxStoreGroup([storeA, storeC], callback)).toThrow();
  });
});
