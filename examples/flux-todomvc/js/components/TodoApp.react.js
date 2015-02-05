/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var TodoStore = require('../stores/TodoStore');
var Helpers = require('../helpers');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoApp = React.createClass({
  styles: Helpers.styles(`
    html,
    body {
      margin: 0;
      padding: 0;
    }

    button {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      color: inherit;
      -webkit-appearance: none;
      -ms-appearance: none;
      -o-appearance: none;
      appearance: none;
    }

    body {
      font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
      line-height: 1.4em;
      background: #eaeaea url('todomvc-common/bg.png');
      color: #4d4d4d;
      width: 550px;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      -ms-font-smoothing: antialiased;
      -o-font-smoothing: antialiased;
      font-smoothing: antialiased;
    }

    button,
    input[type="checkbox"] {
      outline: none;
    }

    #todoapp {
      background: #fff;
      background: rgba(255, 255, 255, 0.9);
      margin: 130px 0 40px 0;
      border: 1px solid #ccc;
      position: relative;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2),
            0 25px 50px 0 rgba(0, 0, 0, 0.15);
    }

    #todoapp:before {
      content: '';
      border-left: 1px solid #f5d6d6;
      border-right: 1px solid #f5d6d6;
      width: 2px;
      position: absolute;
      top: 0;
      left: 40px;
      height: 100%;
    }


    #todo-count {
      float: left;
      text-align: left;
    }

    #filters {
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      right: 0;
      left: 0;
    }

    #filters li {
      display: inline;
    }

    #filters li a {
      color: #83756f;
      margin: 2px;
      text-decoration: none;
    }

    #filters li a.selected {
      font-weight: bold;
    }

    #clear-completed {
      float: right;
      position: relative;
      line-height: 20px;
      text-decoration: none;
      background: rgba(0, 0, 0, 0.1);
      font-size: 11px;
      padding: 0 10px;
      border-radius: 3px;
      box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.2);
    }

    #clear-completed:hover {
      background: rgba(0, 0, 0, 0.15);
      box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.3);
    }

    #info {
      margin: 65px auto 0;
      color: #a6a6a6;
      font-size: 12px;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
      text-align: center;
    }

    #info a {
      color: inherit;
    }

    /*
      Hack to remove background from Mobile Safari.
      Can't use it globally since it destroys checkboxes in Firefox and Opera
    */

    @media screen and (-webkit-min-device-pixel-ratio:0) {
      #toggle-all,
      #todo-list li .toggle {
        background: none;
      }

      #todo-list li .toggle {
        height: 40px;
      }

      #toggle-all {
        top: -56px;
        left: -15px;
        width: 65px;
        height: 41px;
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
        -webkit-appearance: none;
        appearance: none;
      }
    }

    .hidden {
      display: none;
    }

    hr {
      margin: 20px 0;
      border: 0;
      border-top: 1px dashed #C5C5C5;
      border-bottom: 1px dashed #F7F7F7;
    }

    .learn a {
      font-weight: normal;
      text-decoration: none;
      color: #b83f45;
    }

    .learn a:hover {
      text-decoration: underline;
      color: #787e7e;
    }

    .learn h3,
    .learn h4,
    .learn h5 {
      margin: 10px 0;
      font-weight: 500;
      line-height: 1.2;
      color: #000;
    }

    .learn h3 {
      font-size: 24px;
    }

    .learn h4 {
      font-size: 18px;
    }

    .learn h5 {
      margin-bottom: 0;
      font-size: 14px;
    }

    .learn ul {
      padding: 0;
      margin: 0 0 30px 25px;
    }

    .learn li {
      line-height: 20px;
    }

    .learn p {
      font-size: 15px;
      font-weight: 300;
      line-height: 1.3;
      margin-top: 0;
      margin-bottom: 0;
    }

    .quote {
      border: none;
      margin: 20px 0 60px 0;
    }

    .quote p {
      font-style: italic;
    }

    .quote p:before {
      content: '“';
      font-size: 50px;
      opacity: .15;
      position: absolute;
      top: -20px;
      left: 3px;
    }

    .quote p:after {
      content: '”';
      font-size: 50px;
      opacity: .15;
      position: absolute;
      bottom: -42px;
      right: 3px;
    }

    .quote footer {
      position: absolute;
      bottom: -40px;
      right: 0;
    }

    .quote footer img {
      border-radius: 3px;
    }

    .quote footer a {
      margin-left: 5px;
      vertical-align: middle;
    }

    .speech-bubble {
      position: relative;
      padding: 10px;
      background: rgba(0, 0, 0, .04);
      border-radius: 5px;
    }

    .speech-bubble:after {
      content: '';
      position: absolute;
      top: 100%;
      right: 30px;
      border: 13px solid transparent;
      border-top-color: rgba(0, 0, 0, .04);
    }

    .learn-bar > .learn {
      position: absolute;
      width: 272px;
      top: 8px;
      left: -300px;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, .6);
      -webkit-transition-property: left;
      transition-property: left;
      -webkit-transition-duration: 500ms;
      transition-duration: 500ms;
    }

    @media (min-width: 899px) {
      .learn-bar {
        width: auto;
        margin: 0 0 0 300px;
      }

      .learn-bar > .learn {
        left: 8px;
      }

      .learn-bar #todoapp {
        width: 550px;
        margin: 130px auto 40px auto;
      }
    }
  `),

  getInitialState: function() {
    var parser = less.Parser();

    return getTodoState();
  },

  componentDidMount: function() {
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div style={Object.assign(
        {},
        this.styles['html, body'],
        this.styles['body']
      )}>
        <div style={this.styles['#todoapp']}>
          <div style={this.styles['#todoapp:before']}></div>
          <Header />
          <MainSection
            allTodos={this.state.allTodos}
            areAllComplete={this.state.areAllComplete}
          />
          <Footer allTodos={this.state.allTodos} />
        </div>
        <div style={this.styles['#info']}>
          <p>Double-click to edit a todo</p>
          <p>Created by <a href="http://facebook.com/bill.fisher.771" style={this.styles['#info a']}>Bill Fisher</a></p>
          <p>Part of <a href="http://todomvc.com" style={this.styles['#info a']}>TodoMVC</a></p>
        </div>
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.styles.refresh();

    this.setState(getTodoState());
  }

});

module.exports = TodoApp;
