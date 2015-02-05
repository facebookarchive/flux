/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var Helpers = require('../helpers');

var Footer = React.createClass({
  styles: Helpers.styles(`
    #footer {
      color: #777;
      padding: 0 15px;
      position: absolute;
      right: 0;
      bottom: -31px;
      left: 0;
      height: 20px;
      z-index: 1;
      text-align: center;
    }

    #footer:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 31px;
      left: 0;
      height: 50px;
      z-index: -1;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3),
            0 6px 0 -3px rgba(255, 255, 255, 0.8),
            0 7px 1px -3px rgba(0, 0, 0, 0.3),
            0 43px 0 -6px rgba(255, 255, 255, 0.8),
            0 44px 2px -6px rgba(0, 0, 0, 0.2);
    }
  `),

  propTypes: {
    allTodos: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var allTodos = this.props.allTodos;
    var total = Object.keys(allTodos).length;

    if (total === 0) {
      return null;
    }

    var completed = 0;
    for (var key in allTodos) {
      if (allTodos[key].complete) {
        completed++;
      }
    }

    var itemsLeft = total - completed;
    var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
    itemsLeftPhrase += 'left';

    // Undefined and thus not rendered if no completed items are left.
    var clearCompletedButton;
    if (completed) {
      clearCompletedButton =
        <button
          id="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed ({completed})
        </button>;
    }

    return (
      <footer style={this.styles['#footer']}>
        <span style={this.styles['#todo-count']}>
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
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
  }

});

module.exports = Footer;
