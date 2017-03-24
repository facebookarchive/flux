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

import React from 'react';

export type Props = {value: string};

function AppView(props: Props): React.Element<*> {
  return <div>{props.value}</div>;
}

export default AppView;
