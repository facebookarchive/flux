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
  .dontMock('../Store')
  .dontMock('../invariant');

var {EventEmitter} = require('events');
var Store = require('../Store');
var Dispatcher = require('../Dispatcher');

class TestFluxStore extends Store {
  __onDispatch(action) {
    switch (action.type) {
      case 'store-will-change-state':
        this.__emitChange();
        break;
      default:
        // no op
    }
  }
}

class IncompleteFluxStore extends Store {}

class IllegalFluxStore extends Store {
  __onDispatch() {}
  illegalEmit() {
    this.__emitChange();
  }
}

describe('Store', () => {

  var dispatcher;
  var fluxStore;
  var registeredCallback;

  beforeEach(() => {
    jest.resetModuleRegistry();
    dispatcher = new Dispatcher();
    dispatcher.register
      .mockReturnValueOnce('ID_1')
      .mockReturnValueOnce('ID_2');
    fluxStore = new TestFluxStore(dispatcher);
    registeredCallback = dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(dispatcher.register.mock.calls.length).toBe(1);
  });

  it('requires that subclasses override the __onDispatch() method', () => {
    new IncompleteFluxStore(dispatcher);
    var incompleteStoreCallback = dispatcher.register.mock.calls[1][0];
    expect(() => incompleteStoreCallback({type: 'action-type'})).toThrow(
      'Invariant Violation: IncompleteFluxStore has not overridden ' +
      'Store.__onDispatch(), which is required'
    );
    expect(() => registeredCallback({type: 'action-type'})).not.toThrow();
  });

  it('throws when __emitChange() is invoked outside of a dispatch', () => {
    var illegalFluxStore = new IllegalFluxStore(dispatcher);
    expect(() => illegalFluxStore.illegalEmit()).toThrow(
      'Invariant Violation: IllegalFluxStore.__emitChange(): Must be invoked ' +
      'while dispatching.'
    );
  });

  it('throws when hasChanged() is invoked outside of a dispatch', () => {
    expect(() => fluxStore.hasChanged()).toThrow(
      'Invariant Violation: TestFluxStore.hasChanged(): Must be invoked ' +
      'while dispatching.'
    );
  });

  it('emits an event on state change', () => {
    dispatcher.isDispatching = jest.genMockFunction().mockReturnValue(true);
    fluxStore.__emitChange = jest.genMockFunction();
    registeredCallback({type: 'store-will-change-state'});
    expect(fluxStore.__emitChange.mock.calls.length).toBe(1);
  });

  it('exposes whether the state has changed during current dispatch', () => {
    dispatcher.isDispatching = jest.genMockFunction();
    dispatcher.isDispatching.mockReturnValue(true);
    registeredCallback({type: 'store-will-change-state'});
    expect(fluxStore.hasChanged()).toBe(true);
    registeredCallback({type: 'store-will-ignore'});
    expect(fluxStore.hasChanged()).toBe(false);
  });

  it('exposes the dispatch token in a getter', () => {
    expect(fluxStore.getDispatchToken()).toBeTruthy();
  });

  it('wraps EventEmitter.addListener() with an addListener() method', () => {
    mockAddListener = jest.genMockFunction()
    mockAddListener.mockImplementation(() => { return {}; });
    fluxStore.__emitter.addListener = mockAddListener;
    fluxStore.addListener(() => {});
    expect(mockAddListener.mock.calls.length).toBe(1);
    expect(typeof mockAddListener.mock.calls[0][0]).toBe('string');
    expect(typeof mockAddListener.mock.calls[0][1]).toBe('function');
  });

});
