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

'use strict';

import LoadObject from './LoadObject';

/**
 * This helps work with state that can be represented by a single load object.
 * Similar to LoadObjectMap.
 */
class LoadObjectState<V> {
  _data: LoadObject<V>;
  _load: () => void;
  _shouldLoad: (lo: LoadObject<V>) => boolean;

  _preventLoadsForThisFrame: boolean;
  _clearPreventLoadsForThisFrame: mixed;

  constructor(
    load: () => void,
    shouldLoad?: (lo: LoadObject<V>) => boolean,
  ) {
    this._data = LoadObject.empty();
    this._load = load;
    this._shouldLoad = shouldLoad || (lo => lo.isEmpty());
    this._preventLoadsForThisFrame = false;
    this._clearPreventLoadsForThisFrame = null;
  }

  getLoadObject(): LoadObject<V> {
    if (!this._preventLoadsForThisFrame && this._shouldLoad(this._data)) {
      this._clearPreventLoadsForThisFrame = setTimeout(
        () => {
          this._load();
          this._preventLoadsForThisFrame = false;
          this._clearPreventLoadsForThisFrame = null;
        },
        0,
      );
    }
    return this._data;
  }

  setLoadObject(lo: LoadObject<V>): LoadObjectState<V> {
    if (lo === this._data) {
      return this;
    }
    const next = new LoadObjectState(this._load, this._shouldLoad);
    next._data = lo;
    return next;
  }

  map(fn: (value: V) => V): LoadObjectState<V> {
    const lo = this.getLoadObject().map(fn);
    if (lo === this._data) {
      return this;
    }
    const next = new LoadObjectState(this._load, this._shouldLoad);
    next._data = lo;
    return next;
  }
}

export default LoadObjectState;
