/*
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

export type Action =
  {
    type: 'todo/complete',
    id: string,
  } |
  {
    type: 'todo/create',
    text: string,
  } |
  {
    type: 'todo/destroy',
    id: string,
  } |
  {
    type: 'todo/destroy-completed',
  } |
  {
    type: 'todo/toggle-complete-all',
  } |
  {
    type: 'todo/undo-complete',
    id: string,
  } |
  {
    type: 'todo/update-text',
    id: string,
    text: string,
  };
