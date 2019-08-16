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
var ReactTestUtils = require('react-dom/test-utils');

var {Component} = React;

/**
 * Helper to create a container. The container must render a single div with
 * text content, this will return a function to access that content.
 */
function createContainer(containerClass, options, props) {
  var container = FluxContainer.create(containerClass, options);
  var element = React.createElement(container, props);
  var tag = ReactTestUtils.renderIntoDocument(element);
  var component = ReactTestUtils.findRenderedDOMComponentWithTag(tag, 'div');
  var simpleDOMNode = ReactDOM.findDOMNode(component);
  return () => simpleDOMNode.textContent;
}

describe('FluxContainer', () => {

  var dispatch;
  var FooStore;

  class BaseContainer extends Component {
    static getStores() {
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
      static calculateState(prevState) {
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
      static calculateState(prevState) {
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
      static calculateState(prevState, props) {
        return {
          value: props.value + '-' + FooStore.getState(),
        };
      }
    }

    var getValue = createContainer(
      SimpleContainer,
      {withProps: true}, // options
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

  it('should react to props changes', () => {
    class SimpleContainer extends BaseContainer {
      static calculateState(prevState, props) {
        return {
          value: props.value + '-' + FooStore.getState(),
        };
      }
    }
    const SimpleContainerComponent = FluxContainer.create(SimpleContainer, {withProps: true});

    const node = document.createElement('div');
    const component = ReactDOM.render(<SimpleContainerComponent value="initial" />, node);
    ReactDOM.render(<SimpleContainerComponent value="changed" />, node);
    const text = ReactDOM.findDOMNode(component).textContent;
    expect(text).toBe('changed-foo');
  });

  it('should preserve initial state set in constructor', () => {
    // Hack to expose internal state for testing.
    let dangerouslyGetState = () => ({});

    // Setup the container.
    class SimpleContainer extends BaseContainer {
      static calculateState(prevState, props) {
        return {
          value: FooStore.getState(),
        };
      }

      constructor(props) {
        super(props);
        this.state = {
          someOtherValue: 42,
        };
        dangerouslyGetState = () => this.state;
      }
    }
    var getValue = createContainer(SimpleContainer);

    // Make sure our other value is there initially.
    expect(dangerouslyGetState().someOtherValue).toBe(42);

    // Standard test.
    expect(getValue()).toBe('foo');
    dispatch({
      type: 'set',
      value: 'bar',
    });
    expect(getValue()).toBe('bar');

    // And make sure other value persists after changes.
    expect(dangerouslyGetState().someOtherValue).toBe(42);
  });

  it('should respect changes in componentWillMount', () => {
    // Setup the container.
    class SimpleContainer extends BaseContainer {
      static calculateState(prevState, props) {
        return {
          value: FooStore.getState(),
        };
      }

      UNSAFE_componentWillMount() {
        dispatch({
          type: 'set',
          value: 'bar',
        });
      }
    }
    var getValue = createContainer(SimpleContainer);
    expect(getValue()).toBe('bar');
  });

  it('should get access to context in getStores', () => {
    const MyContext = React.createContext(
      {value: FooStore}
    );

    class SimpleContainer extends BaseContainer {

      static contextType = MyContext;

      static getStores(props, context) {
        return [context.value];
      }

      static calculateState(prevState, props, context) {
        return {
          value: context.value.getState(),
        };
      }
    }
    SimpleContainer.contextType = MyContext;

    var getValue = createContainer(
      SimpleContainer,
      {withContext: true}, // options
      {}, // props
    );

    expect(getValue()).toBe('foo');
  });

  it('should get access to context in calculateState', () => {
    const MyContext = React.createContext(
      {value: "context"}
    );

    class SimpleContainer extends BaseContainer {

      static contextType = MyContext;

      static calculateState(prevState, props, context) {
        return {
          value: context.value + '-' + FooStore.getState(),
        };
      }
    }

    var getValue = createContainer(
      SimpleContainer,
      {withProps: true, withContext: true}, // options
      {}, // props
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
