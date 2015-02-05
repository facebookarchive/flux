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
var TodoTextInput = require('./TodoTextInput.react');
var Helpers = require('../helpers');

var cx = require('react/lib/cx');

var TodoItem = React.createClass({
  styles: Helpers.styles(`
    #todo-list li {
      position: relative;
      font-size: 24px;
      border-bottom: 1px dotted #ccc;
    }

    #todo-list li:last-child {
      border-bottom: none;
    }
    
    #todo-list li .edit {
      display: inline;
    }

    #todo-list li.editing {
      border-bottom: none;
      padding: 0;
    }

    #todo-list li.editing .edit {
      display: block;
      width: 506px;
      padding: 13px 17px 12px 17px;
      margin: 0 0 0 43px;
    }

    #todo-list li.editing .view {
      display: none;
    }

    #todo-list li .toggle {
      text-align: center;
      width: 40px;
      /* auto, since non-WebKit browsers doesn't support input styling */
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      /* Mobile Safari */
      border: none;
      -webkit-appearance: none;
      -ms-appearance: none;
      -o-appearance: none;
      appearance: none;
    }

    #todo-list li .toggle:after {
      content: '✔';
      /* 40 + a couple of pixels visual adjustment */
      line-height: 43px;
      font-size: 20px;
      color: #d9d9d9;
      text-shadow: 0 -1px 0 #bfbfbf;
    }

    #todo-list li .toggle:checked:after {
      color: #85ada7;
      text-shadow: 0 1px 0 #669991;
      bottom: 1px;
      position: relative;
    }

    #todo-list li label {
      white-space: pre;
      word-break: break-word;
      padding: 15px 60px 15px 15px;
      margin-left: 45px;
      display: block;
      line-height: 1.2em;
      -webkit-transition: color 0.4s;
      transition: color 0.4s;
    }

    #todo-list li.completed label {
      color: #a9a9a9;
      text-decoration: line-through;
    }

    #todo-list li .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 22px;
      color: #a88a8a;
      -webkit-transition: all 0.2s;
      transition: all 0.2s;
    }

    #todo-list li .destroy:hover {
      text-shadow: 0 0 1px #000,
             0 0 10px rgba(199, 107, 107, 0.8);
      -webkit-transform: scale(1.3);
      -ms-transform: scale(1.3);
      transform: scale(1.3);
    }

    #todo-list li .destroy:after {
      content: '✖';
    }

    #todo-list li:hover .destroy {
      display: block;
    }

    #todo-list li .edit {
      display: none;
    }

    #todo-list li.editing:last-child {
      margin-bottom: -1px;
    }
    
    #todoapp input::-webkit-input-placeholder {
      font-style: italic;
    }

    #todoapp input::-moz-placeholder {
      font-style: italic;
      color: #a9a9a9;
    }
  `),

  propTypes: {
   todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {
    var todo = this.props.todo;

    var input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          style={[
            this.styles['#todoapp input::-moz-placeholder'],
            this.styles['#todo-list li .edit']
          ]}
          onSave={this._onSave}
          value={todo.text}
        />;
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <li
        className={cx({
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}
        style={Object.assign(
          {},
          this.styles['#todo-list li']
        )}
      >
        <div style={this.styles['#todo-list li .view']}>
          <div style={this.styles['#todo-list li .toggle:after']}></div>
          <input
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete}
            style={this.styles['#todo-list li .toggle']}
          />
          <label onDoubleClick={this._onDoubleClick} style={this.styles['#todo-list li label']}>
            {todo.text}
          </label>
          <button onClick={this._onDestroyClick} style={this.styles['#todo-list li .destroy']} />
        </div>
        {input}
      </li>
    );
  },

  _onToggleComplete: function() {
    TodoActions.toggleComplete(this.props.todo);
  },

  _onDoubleClick: function() {
    this.setState({isEditing: true});
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _onSave: function(text) {
    TodoActions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  },

  _onDestroyClick: function() {
    TodoActions.destroy(this.props.todo.id);
  }

});

module.exports = TodoItem;
