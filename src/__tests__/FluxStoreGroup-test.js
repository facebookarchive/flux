/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+uiecommd
 * @typechecks
 */

import Dispatcher from 'Dispatcher';
import FluxStore from 'FluxStore';
import FluxStoreGroup from 'FluxStoreGroup';

class SimpleStore extends FluxStore {
  __onDispatch(payload) {
    this.__emitChange();
  }
}

describe('FluxStoreGroup', () => {
  let dispatcher;
  let storeA;
  let storeB;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    storeA = new SimpleStore(dispatcher);
    storeB = new SimpleStore(dispatcher);
  });

  it('should register a callback with the dispatcher', () => {
    const callback = jest.fn();
    new FluxStoreGroup([storeA, storeB], callback);

    dispatcher.dispatch({type: 'foo'});
    expect(callback).toBeCalled();
  });

  it('should wait for the store dependencies', () => {
    const callback = jest.fn().mockImplementation(() => {
      expect(storeA.hasChanged()).toBe(true);
      expect(storeB.hasChanged()).toBe(true);
    });
    new FluxStoreGroup([storeA, storeB], callback);

    dispatcher.dispatch({type: 'foo'});
    expect(callback).toBeCalled();
  });

  it('should not run the callback after being released', () => {
    const callback = jest.fn();
    const group = new FluxStoreGroup([storeA, storeB], callback);
    group.release();

    dispatcher.dispatch({type: 'foo'});
    expect(callback).not.toBeCalled();
  });

  it('should have at least one store', () => {
    const callback = jest.fn();
    expect(() => new FluxStoreGroup([], callback)).toThrow();
  });

  it('should make sure dispatchers are uniform in DEV', () => {
    const callback = jest.fn();
    const storeC = new SimpleStore(new Dispatcher());
    expect(() => new FluxStoreGroup([storeA, storeC], callback)).toThrow();
  });
});
