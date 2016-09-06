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

import AppDispatcher from './AppDispatcher';
import AppStore from './AppStore';
import AppView from './AppView';
import {Container} from 'flux/utils';

function getStores() {
  return [
    AppStore,
  ];
}

function getState() {
  return {
    value: AppStore.getState(),

    // $FlowExpectedError: Cannot dispatch an incorrectly formed action.
    onFooChange: () => AppDispatcher.dispatch({
      type: 'foo',
      bar: 'Hello Bar!',
    }),
  };
}

export default Container.createFunctional(AppView, getStores, getState);
