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
var TodoItem = require('./TodoItem.react');
var Helpers = require('../helpers');

var MainSection = React.createClass({
  styles: Helpers.styles(`

    #todoapp input::-webkit-input-placeholder {
      font-style: italic;
    }

    #todoapp input::-moz-placeholder {
      font-style: italic;
      color: #a9a9a9;
    }

    label[for='toggle-all'] {
      display: none;
    }

    #toggle-all {
      position: absolute;
      top: -42px;
      left: -4px;
      width: 40px;
      text-align: center;
      /* Mobile Safari */
      border: none;
    }

    #toggle-all:before {
      content: '»';
      font-size: 28px;
      color: #d9d9d9;
      padding: 0 25px 7px;
    }

    #toggle-all:checked:before {
      color: #737373;
    }

    #todo-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }


    #main {
      position: relative;
      z-index: 2;
      border-top: 1px dotted #adadad;
    }
  `),
  
  propTypes: {
    allTodos: ReactPropTypes.object.isRequired,
    areAllComplete: ReactPropTypes.bool.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allTodos).length < 1) {
      return null;
    }

    var allTodos = this.props.allTodos;
    var todos = [];

    for (var key in allTodos) {
      todos.push(<TodoItem key={key} todo={allTodos[key]} />);
    }

    return (
      <section style={this.styles['#main']}>
        <input
          type="checkbox"
          onChange={this._onToggleCompleteAll}
          checked={this.props.areAllComplete ? 'checked' : ''}
          style={this.styles['#toggle-all']}
        />
        <label htmlFor="toggle-all" style={this.styles['label[for=\'toggle-all\']']}>Mark all as complete</label>
        <ul id="todo-list" style={this.styles['#todo-list']}>{todos}</ul>
      </section>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    TodoActions.toggleCompleteAll();
  }

});

module.exports = MainSection;
