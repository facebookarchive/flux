/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

jest.dontMock('Dispatcher');
jest.dontMock('invariant');

var Dispatcher = require('Dispatcher');

describe('Dispatcher', () => {
  var dispatcher;
  var callbackA;
  var callbackB;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    callbackA = jest.genMockFunction();
    callbackB = jest.genMockFunction();
  });

  it('should execute all subscriber callbacks', () => {
    dispatcher.register(callbackA);
    dispatcher.register(callbackB);

    var payload = {};
    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(1);
    expect(callbackA.mock.calls[0][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(1);
    expect(callbackB.mock.calls[0][0]).toBe(payload);

    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(2);
    expect(callbackA.mock.calls[1][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(2);
    expect(callbackB.mock.calls[1][0]).toBe(payload);
  });

  it('should wait for callbacks registered earlier', () => {
    var tokenA = dispatcher.register(callbackA);

    dispatcher.register((payload) => {
      dispatcher.waitFor([tokenA]);
      expect(callbackA.mock.calls.length).toBe(1);
      expect(callbackA.mock.calls[0][0]).toBe(payload);
      callbackB(payload);
    });

    var payload = {};
    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(1);
    expect(callbackA.mock.calls[0][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(1);
    expect(callbackB.mock.calls[0][0]).toBe(payload);
  });

  it('should wait for callbacks registered later', () => {
    dispatcher.register((payload) => {
      dispatcher.waitFor([tokenB]);
      expect(callbackB.mock.calls.length).toBe(1);
      expect(callbackB.mock.calls[0][0]).toBe(payload);
      callbackA(payload);
    });

    var tokenB = dispatcher.register(callbackB);

    var payload = {};
    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(1);
    expect(callbackA.mock.calls[0][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(1);
    expect(callbackB.mock.calls[0][0]).toBe(payload);
  });

  it('should throw if dispatch() while dispatching', () => {
    dispatcher.register((payload) => {
      dispatcher.dispatch(payload);
      callbackA();
    });

    var payload = {};
    expect(() => dispatcher.dispatch(payload)).toThrow();
    expect(callbackA.mock.calls.length).toBe(0);
  });

  it('should throw if waitFor() while not dispatching', () => {
    var tokenA = dispatcher.register(callbackA);

    expect(() => dispatcher.waitFor([tokenA])).toThrow();
    expect(callbackA.mock.calls.length).toBe(0);
  });

  it('should throw if waitFor() with invalid token', () => {
    var invalidToken = 1337;

    dispatcher.register(() => {
      dispatcher.waitFor([invalidToken]);
    });

    var payload = {};
    expect(() => dispatcher.dispatch(payload)).toThrow();
  });

  it('should throw on self-circular dependencies', () => {
    var tokenA = dispatcher.register((payload) => {
      dispatcher.waitFor([tokenA]);
      callbackA(payload);
    });

    var payload = {};
    expect(() => dispatcher.dispatch(payload)).toThrow();
    expect(callbackA.mock.calls.length).toBe(0);
  });

  it('should throw on multi-circular dependencies', () => {
    var tokenA = dispatcher.register((payload) => {
      dispatcher.waitFor([tokenB]);
      callbackA(payload);
    });

    var tokenB = dispatcher.register((payload) => {
      dispatcher.waitFor([tokenA]);
      callbackB(payload);
    });

    expect(() => dispatcher.dispatch({})).toThrow();
    expect(callbackA.mock.calls.length).toBe(0);
    expect(callbackB.mock.calls.length).toBe(0);
  });

  it('should remain in a consistent state after a failed dispatch', () => {
    dispatcher.register(callbackA);
    dispatcher.register((payload) => {
      if (payload.shouldThrow) {
        throw new Error();
      }
      callbackB();
    });

    expect(() => dispatcher.dispatch({shouldThrow: true})).toThrow();

    // Cannot make assumptions about a failed dispatch.
    var callbackACount = callbackA.mock.calls.length;

    dispatcher.dispatch({shouldThrow: false});

    expect(callbackA.mock.calls.length).toBe(callbackACount + 1);
    expect(callbackB.mock.calls.length).toBe(1);
  });

  it('should properly unregister callbacks', () => {
    dispatcher.register(callbackA);

    var tokenB = dispatcher.register(callbackB);

    var payload = {};
    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(1);
    expect(callbackA.mock.calls[0][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(1);
    expect(callbackB.mock.calls[0][0]).toBe(payload);

    dispatcher.unregister(tokenB);

    dispatcher.dispatch(payload);

    expect(callbackA.mock.calls.length).toBe(2);
    expect(callbackA.mock.calls[1][0]).toBe(payload);

    expect(callbackB.mock.calls.length).toBe(1);
  });

  it('should throw if register() while dispatching', () => {
    dispatcher.register((payload) => {
      dispatcher.register(callbackB);
      callbackA();
    });

    var payload = {};
    expect(() => dispatcher.dispatch(payload)).toThrow();
    expect(callbackA.mock.calls.length).toBe(0);
  });

  it('should throw if unregister() while dispatching', () => {
    var tokenA = dispatcher.register(callbackA);
    dispatcher.register((payload) => {
      dispatcher.unregister(tokenA);
      callbackB();
    });

    var payload = {};
    expect(() => dispatcher.dispatch(payload)).toThrow();
    expect(callbackA.mock.calls.length).toBe(1);
    expect(callbackB.mock.calls.length).toBe(0);
  });
});
