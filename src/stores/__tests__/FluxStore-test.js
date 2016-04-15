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
  .dontMock('FluxStore')
  .dontMock('invariant'); // This shouldn't be necessary. Not sure why it is.

var FluxStore = require('FluxStore');
var Dispatcher = require('Dispatcher');

var {EventEmitter} = require('fbemitter');

class TestFluxStore extends FluxStore {
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

class IncompleteFluxStore extends FluxStore {}

class IllegalFluxStore extends FluxStore {
  __onDispatch() {}
  illegalEmit() {
    this.__emitChange();
  }
}

describe('FluxStore', () => {

  var dispatcher;
  var fluxStore;
  var mockEmit;
  var registeredCallback;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    dispatcher.register
      .mockReturnValueOnce('ID_1')
      .mockReturnValueOnce('ID_2');
    EventEmitter.mockClear();
    fluxStore = new TestFluxStore(dispatcher);
    mockEmit = EventEmitter.mock.instances[0].emit;
    registeredCallback = dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(dispatcher.register.mock.calls.length).toBe(1);
  });

  it('requires that subclasses override the __onDispatch() method', () => {
    new IncompleteFluxStore(dispatcher);
    var incompleteStoreCallback = dispatcher.register.mock.calls[1][0];
    expect(() => incompleteStoreCallback({type: 'action-type'})).toThrow();
    expect(() => registeredCallback({type: 'action-type'})).not.toThrow();
  });

  it('throws when __emitChange() is invoked outside of a dispatch', () => {
    var illegalFluxStore = new IllegalFluxStore(dispatcher);
    expect(() => illegalFluxStore.illegalEmit()).toThrow();
  });

  it('throws when hasChanged() is invoked outside of a dispatch', () => {
    expect(() => fluxStore.hasChanged()).toThrow();
  });

  it('emits an event on state change', () => {
    dispatcher.isDispatching = jest.genMockFunction().mockReturnValue(true);
    registeredCallback({type: 'store-will-change-state'});
    expect(mockEmit.mock.calls.length).toBe(1);
    expect(mockEmit.mock.calls[0][0]).toBe('change');
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
    var mockAddListener = EventEmitter.mock.instances[0].addListener;
    mockAddListener.mockImplementation(() => { return {}; });
    fluxStore.addListener(() => {});
    expect(mockAddListener.mock.calls.length).toBe(1);
    expect(typeof mockAddListener.mock.calls[0][0]).toBe('string');
    expect(typeof mockAddListener.mock.calls[0][1]).toBe('function');
  });

});
