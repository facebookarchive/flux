/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

//import AppView from './views/AppView';
// now we have a container that wraps around the AppView and
// the stores it needs to look at

import AppContainer from './containers/AppContainer';

ReactDOM.render(
  /*<AppView />,*/
  <AppContainer />,
  document.getElementById('todoapp')
);

import TodoActions from './data/TodoActions'; // note: we can name this whatever we want here
// the default export is technically __default__ out of a module, and we can choose whatever
// identifier we want on the import side
// this would be equivalent to just choosing a name for a named export (non-default):
//import {namedExport as myImportIdentifier} from 'module';

// note how we are adding mock data here - this didn't come as an action from
// the view - actions can get sent to the store from other places as well
// assuming areas like browser, tests, etc.
TodoActions.addTodo('My first task');
TodoActions.addTodo('My second task');
TodoActions.addTodo('Finish this tutorial');


