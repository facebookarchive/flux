/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

type DispatchToken = string;

declare module 'flux' {
  declare class Dispatcher<TPayload> {
    register(callback: (payload: TPayload) => void): DispatchToken;
    unregister(id: DispatchToken): void;
    waitFor(ids: Array<DispatchToken>): void;
    dispatch(payload: TPayload): void;
    isDispatching(): boolean;
  }
}
