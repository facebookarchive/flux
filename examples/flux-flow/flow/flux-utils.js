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

import type {Dispatcher} from 'flux';
import type React from 'react';

type DispatchToken = string;

type ContainerOptions = {
  pure?: ?boolean,
  withProps?: ?boolean,
  withContext?: ?boolean,
};

declare module 'flux/utils' {
  declare class Store<TPayload> {
    constructor(dispatcher: Dispatcher<TPayload>): void;
    addListener(callback: (eventType?: string) => void): {remove: () => void};
    getDispatcher(): Dispatcher<TPayload>;
    getDispatchToken(): DispatchToken;
    hasChanged(): boolean;
  }

  declare class ReduceStore<TPayload, TState> extends Store<TPayload> {
    getState(): TState;
    getInitialState(): TState;
    reduce(state: TState, action: TPayload): TState;
    areEqual(one: TState, two: TState): boolean;
  }

  // This isn't really a class, just a simple object. Not sure how to put that
  // in declare module.
  declare class Container {
    static create<Props, State>(
      base: React.Element<State>,
      options?: ?ContainerOptions,
    ): React.Class<Props>;

    static createFunctional<Props, State>(
      viewFn: (props: State) => React.Element<Props>,
      getStores: (props?: ?Props, context?: any) => Array<Store<any>>,
      calculateState: (
        prevState?: ?State,
        props?: ?Props,
        context?: any,
      ) => State,
      options?: ContainerOptions,
    ): React.Class<Props>;
  }
}
