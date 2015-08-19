/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var FluxStore = require('flux/lib/FluxStore');
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var _todos = {};

/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {
  // Hand waving here -- not showing how this interacts with XHR or persistent
  // server-side storage.
  // Using the current timestamp + random number in place of a real id.
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

/**
 * Update all of the TODO items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _todos) {
    update(id, updates);
  }
}

/**
 * Delete a TODO item.
 * @param  {string} id
 */
function destroy(id) {
  delete _todos[id];
}

/**
 * Delete all the completed TODO items.
 */
function destroyCompleted() {
  for (var id in _todos) {
    if (_todos[id].complete) {
      destroy(id);
    }
  }
}

// create a TodoStore subclass by doing classical inheritance
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
function TodoStore(dispatcher) {
  FluxStore.call(this, dispatcher); // call super constructor.
}
TodoStore.prototype = Object.create(FluxStore.prototype);
TodoStore.prototype.constructor = TodoStore;

/**
 * Tests whether all the remaining TODO items are marked as completed.
 * @return {boolean}
 */
TodoStore.prototype.areAllComplete = function() {
  for (var id in _todos) {
    if (!_todos[id].complete) {
      return false;
    }
  }
  return true;
};

/**
 * Get the entire collection of TODOs.
 * @return {object}
 */
TodoStore.prototype.getAll = function() {
  return _todos;
};

TodoStore.prototype.__onDispatch = function(action) {
  switch(action.actionType) {
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
        this.__emitChange();
      }
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if (this.areAllComplete()) {
        updateAll({complete: false});
      } else {
        updateAll({complete: true});
      }
      this.__emitChange();
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      this.__emitChange();
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      this.__emitChange();
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if (text !== '') {
        update(action.id, {text: text});
        this.__emitChange();
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      this.__emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      this.__emitChange();
      break;

    default:
      // no op
  }
};

module.exports = new TodoStore(AppDispatcher);
