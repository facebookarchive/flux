/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Store
 * @flow
 */

'use strict';

import type Dispatcher from './Dispatcher';

var {EventEmitter} = require('events');

var invariant = require('./invariant');

var CHANGE_EVENT = 'change';

/**
 * This class should be extended by the stores in your application, like so:
 *
 * var Flux = require('flux');
 * var MyDispatcher = require('MyDispatcher');
 *
 * class MyStore extends Flux.Store {
 *
 *   getFoo() {
 *     return this._foo;
 *   }
 *
 *   __onDispatch(action) {
 *     switch(action.type) {
 *       case 'an-action':
 *         changeState(action.someData);
 *         this.__emitChange();
 *         break;
 *
 *       case 'another-action':
 *         changeStateAnotherWay(action.otherData);
 *         this.__emitChange();
 *         break;
 *
 *       default:
 *         // no op
 *     }
 *   }
 *
 * }
 *
 * module.exports = new MyStore(MyDispatcher);
 */
class Store {

  // private
  _dispatchToken: string;

  // protected, available to subclasses
  __changed: boolean;
  __changeEvent: string;
  __className: any;
  __dispatcher: Dispatcher;
  __emitter: EventEmitter;

  /**
   * @public
   */
  constructor(dispatcher: Dispatcher): void {
    // Workaround for Flow preventing access to method properties
    this.__className = (this: any).constructor.name;

    this.__changed = false;
    this.__dispatcher = dispatcher;
    this.__changeEvent = this._getChangeEvent();
    this.__emitter = new EventEmitter();
    this._dispatchToken = dispatcher.register((payload) => {
      this.__invokeOnDispatch(payload);
    });
  }

  /**
   * Returns an EmitterSubscription that can be used with SubscriptionsHandler
   * or directly used to release the subscription.
   *
   * @public
   */
  addListener(callback: (eventType?: string) => void): Object {
    return this.__emitter.addListener(this.__changeEvent, callback);
  }

  /**
   * Gets the dispatcher that this store is registered with
   *
   * @public
   */
  getDispatcher(): Dispatcher {
    return this.__dispatcher;
  }

  /**
   * A string the dispatcher uses to identify each store's registered callback.
   * This is used with the dispatcher's waitFor method to declaratively depend
   * on other stores updating themselves first.
   *
   * @public
   */
  getDispatchToken(): string {
    return this._dispatchToken;
  }

  /**
   * Whether the store has changed during the most recent dispatch.
   *
   * @public
   */
  hasChanged(): boolean {
    invariant(
      this.__dispatcher.isDispatching(),
      '%s.hasChanged(): Must be invoked while dispatching.',
      this.__className
    );
    return this.__changed;
  }

  /**
   * Emit an event notifying listeners that the state of the store has changed.
   *
   * @protected
   */
  __emitChange(): void {
    invariant(
      this.__dispatcher.isDispatching(),
      '%s.__emitChange(): Must be invoked while dispatching.',
      this.__className
    );
    this.__changed = true;
  }

  /**
   * This method encapsulates all logic for invoking __onDispatch. It should
   * be used for things like catching changes and emitting them after the
   * subclass has handled a payload.
   *
   * @protected
   */
  __invokeOnDispatch(payload: Object): void {
    this.__changed = false;
    this.__onDispatch(payload);
    if (this.__changed) {
      this.__emitter.emit(this.__changeEvent);
    }
  }

  /**
   * The callback that will be registered with the dispatcher during
   * instantiation. Subclasses must override this method. This callback is the
   * only way the store receives new data.
   *
   * Paylod is the data dispatched by the dispatcher, describing something that
   * has happened in the real world: the user clicked, the server responded,
   * time passed, etc.
   *
   * @protected
   * @override
   */
  __onDispatch(payload: Object): void {
    invariant(
      false,
      '%s has not overridden Store.__onDispatch(), which is required',
      this.__className
    );
  }

  /**
   * The name of the change event. For debugging, this includes the name of the
   * store while in the development environment.
   *
   * @private
   */
  _getChangeEvent(): string {
    if (__DEV__) {
      return CHANGE_EVENT + (':' + this.__className);
    }
    return CHANGE_EVENT;
  }
}

module.exports = Store;
