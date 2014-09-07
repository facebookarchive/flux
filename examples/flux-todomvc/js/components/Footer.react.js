/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');

var Footer = React.createClass({

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    this._computeRenderingValues();
    // Undefined and thus not rendered if no completed items are left.
    var clearCompletedButton = this._clearCompletedButton(this._completed);
  	return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {this._itemsLeft}
          </strong>
          {this._itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  },

  /**
   * Event handler to delete all completed TODOs
   */
  _onClearCompletedClick: function() {
    TodoActions.destroyCompleted();
  },

  _computeItemsLeft: function() {
    this._itemsLeft = this._total - this._completed;
    this._itemsLeftPhrase = this._itemsLeft === 1 ? ' item ' : ' items ';
    this._itemsLeftPhrase += 'left';
  },

  _computeTotalCompleted: function() {
    var allTodos = this.props.allTodos;
    this._total = Object.keys(allTodos).length;

    if (this._total === 0) {
      this._completed = 0
    } else {
      var completed = 0;
      for (var key in allTodos) {
        if (allTodos[key].complete) {
          completed++;
        }
      }
      this._completed = completed;
    }
  },

  _computeRenderingValues: function() {
    this._computeTotalCompleted();
    this._computeItemsLeft();
  },

  _clearCompletedButton: function(completed) {
    if (completed) {
      return (
        <button
        id="clear-completed"
        onClick={this._onClearCompletedClick}>
        Clear completed ({completed})
        </button>
      );
    } else {
      return null;
    }
  }
});

module.exports = Footer;
