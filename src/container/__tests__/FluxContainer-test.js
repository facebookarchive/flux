/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails oncall+uiecommd
 * @typechecks
 */

'use strict';

jest.autoMockOff();

var Dispatcher = require('Dispatcher');
var FluxContainer = require('FluxContainer');
var FluxReduceStore = require('FluxReduceStore');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils');

var {Component} = React;
var {Container} = FluxContainer;

/**
 * Helper to create a container. The container must render a single div with
 * textContaner, this will return a function to access that content.
 */
function createContainer(containerClass, props, context) {
  var element = React.createElement(containerClass, props);
  var tag;
  if (context) {
    // Create a new component that provides the child context.
    var ComponentWithContext = React.createClass({
      childContextTypes: {
        value: React.PropTypes.string,
      },
      getChildContext: function() {
        return context;
      },
      render: function() {
        return <span>{this.props.children}</span>;
      },
    });
    var wrapper = React.createElement(ComponentWithContext, {}, element);
    tag = ReactTestUtils.renderIntoDocument(wrapper);
  } else {
    tag = ReactTestUtils.renderIntoDocument(element);
  }
  var component = ReactTestUtils.findRenderedDOMComponentWithTag(tag, 'div');
  var simpleDOMNode = ReactDOM.findDOMNode(component);
  return () => simpleDOMNode.textContent;
}

describe('FluxContainer', () => {

  var dispatch;
  var FooStore;

  class BaseContainer extends Container {
    getStores() {
      return [FooStore];
    }

    render() {
      return (
        <div>
          {this.state.value}
        </div>
      );
    }
  }

  beforeEach(() => {
    var dispatcher = new Dispatcher();
    dispatch = dispatcher.dispatch.bind(dispatcher);

    class FooStoreClass extends FluxReduceStore {
      constructor() {
        super(dispatcher);
      }

      getInitialState() {
        return 'foo';
      }

      reduce(state, action) {
        switch (action.type) {
          case 'set':
            return action.value;

          default:
            return state;
        }
      }
    }
    FooStore = new FooStoreClass();
  });

  it('should update the state', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      calculateState() {
        return {
          value: FooStore.getState(),
        };
      }
    }
    var getValue = createContainer(SimpleContainer);

    // Test it.
    expect(getValue()).toBe('foo');
    dispatch({
      type: 'set',
      value: 'bar',
    });
    expect(getValue()).toBe('bar');
  });

  it('should work with prevState', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      calculateState(prevState) {
        if (!prevState) {
          return {
            value: 'one',
          };
        }

        return {
          value: prevState.value + '-' + FooStore.getState(),
        };
      }
    }
    var getValue = createContainer(SimpleContainer);

    // Test it.
    expect(getValue()).toBe('one');
    dispatch({
      type: 'set',
      value: 'two',
    });
    expect(getValue()).toBe('one-two');
    dispatch({
      type: 'set',
      value: 'three',
    });
    expect(getValue()).toBe('one-two-three');

    // Shouldn't change when the store doesn't change.
    dispatch({
      type: 'set',
      value: 'three',
    });
    expect(getValue()).toBe('one-two-three');
  });

  it('should get access to props', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      calculateState() {
        return {
          value: this.props.value + '-' + FooStore.getState(),
        };
      }
    }

    var getValue = createContainer(
      SimpleContainer,
      {value: 'prop'}, // props
    );

    // Test it.
    expect(getValue()).toBe('prop-foo');
    dispatch({
      type: 'set',
      value: 'bar',
    });
    expect(getValue()).toBe('prop-bar');
  });

  it('should respect changes in componentWillMount', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      calculateState() {
        return {
          value: FooStore.getState(),
        };
      }

      componentWillMount() {
        dispatch({
          type: 'set',
          value: 'bar',
        });
      }
    }
    var getValue = createContainer(SimpleContainer);
    expect(getValue()).toBe('bar');
  });

  it('should get access to context', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      static contextTypes = {
        value: React.PropTypes.string,
      };

      calculateState() {
        return {
          value: this.context.value + '-' + FooStore.getState(),
        };
      }
    }

    var getValue = createContainer(
      SimpleContainer,
      {}, // props
      {
        value: 'context',
      }, // context
    );

    // Test it.
    expect(getValue()).toBe('context-foo');
    dispatch({
      type: 'set',
      value: 'bar',
    });
    expect(getValue()).toBe('context-bar');
  });

  // Still need to write a test for changing props. Can't figure out how to do
  // that with react test utils at the moment...

});
