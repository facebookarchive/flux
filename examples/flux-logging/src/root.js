/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import AppContainer from '../../flux-todomvc/src/containers/AppContainer';
import {Container} from 'flux/utils';
import React from 'react';
import ReactDOM from 'react-dom';

// Import the logger store explicitly so that it registers with the dispatcher.
import TodoLoggerStore from './TodoLoggerStore';

ReactDOM.render(<AppContainer/>, document.getElementById('todoapp'));
