/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.react');
var Helpers = require('../helpers');

var Header = React.createClass({
  styles: Helpers.styles(`
    #header {
      padding-top: 15px;
      border-radius: inherit;
    }

    #header:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 15px;
      z-index: 2;
      border-bottom: 1px solid #6c615c;
      background: #8d7d77;
      background: -webkit-gradient(linear, left top, left bottom, from(rgba(132, 110, 100, 0.8)),to(rgba(101, 84, 76, 0.8)));
      background: -webkit-linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));
      background: linear-gradient(top, rgba(132, 110, 100, 0.8), rgba(101, 84, 76, 0.8));
      filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,StartColorStr='#9d8b83', EndColorStr='#847670');
      border-top-left-radius: 1px;
      border-top-right-radius: 1px;
    }

    #todoapp h1 {
      position: absolute;
      top: -120px;
      width: 100%;
      font-size: 70px;
      font-weight: bold;
      text-align: center;
      color: #b3b3b3;
      color: rgba(255, 255, 255, 0.3);
      text-shadow: -1px -1px rgba(0, 0, 0, 0.2);
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      -ms-text-rendering: optimizeLegibility;
      -o-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
    }
    
    #todoapp input::-webkit-input-placeholder {
      font-style: italic;
    }

    #todoapp input::-moz-placeholder {
      font-style: italic;
      color: #a9a9a9;
    }
  `),

  /**
   * @return {object}
   */
  render: function() {
    return (
      <header style={this.styles['#header']}>
        <div style={this.styles['#header:before']}></div>
        <h1 style={this.styles['#todoapp h1']}>todos</h1>
        <TodoTextInput
          placeholder="What needs to be done?"
          onSave={this._onSave}
        />
      </header>
    );
  },

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  _onSave: function(text) {
    if (text.trim()){
      TodoActions.create(text);
    }

  }

});

module.exports = Header;
