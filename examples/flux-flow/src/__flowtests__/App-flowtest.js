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

// This file will violate certain parts of flow definitions and expect errors
// using the annotation "FlowExpectedError". This works because if the error
// suppressing comment no longer suppresses an error that becomes a flow error.
// This means regressions where we expect an error and there is not an error
// will be caught.

import AppDispatcher from '../AppDispatcher';
import AppStore from '../AppStore';
import React from 'react';
import {Container} from 'flux/utils';

/**
 * Tests a simple dispatch with an invalid payload.
 */
function t1() {
  // $FlowExpectedError: Cannot dispatch an incorrectly formed action.
  AppDispatcher.dispatch({
    type: 'foo',
    bar: 'Hello Bar!',
  });
}

/**
 * Tests creating a container with state that doesn't match props of the view.
 */
function t2(): React.Element<*> {
  function MyView(props: {value: string}) {
    return <div>{props.value}</div>;
  }

  const MyContainer = Container.createFunctional(
    MyView,
    () => [AppStore],
    // $FlowExpectedError: Incorrect shape for state.
    () => ({notValue: AppStore.getState()}),
  );

  return <MyContainer />
}
