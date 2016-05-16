/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FluxContainer
 * @flow
 */

'use strict';

import type FluxStore from 'FluxStore';

const FluxContainerSubscriptions = require('FluxContainerSubscriptions');
const React = require('react');

const shallowEqual = require('shallowEqual');
const abstractMethod = require('abstractMethod');

const {Component} = React;

/**
 * A FluxContainer is used to subscribe a react component to multiple stores.
 * The stores that are used must be returned from a static `getStores()` method.
 *
 * The component receives information from the stores via state. The state
 * is generated using a static `calculateState()` method that each container
 * must implement. A simple container may look like:
 *
 *   class FooContainer extends Container {
 *     getStores() {
 *       return [FooStore];
 *     }
 *
 *     calculateState() {
 *       return {
 *         foo: FooStore.getState(),
 *       };
 *     }
 *
 *     render() {
 *       return <FooView {...this.state} />;
 *     }
 *   }
 *
 *   module.exports = FooContainer;
 *
 * Flux container also supports some other, more advanced use cases. If you need
 * to base your state off of props as well:
 *
 *   class FooContainer extends Container {
 *     ...
 *
 *     calculateState() {
 *       return {
 *         foo: FooStore.getSpecificFoo(this.props.id),
 *       };
 *     }
 *
 *     ...
 *   }
 *
 *   module.exports = FooContainer;
 *
 * Or if your stores are passed through your props:
 *
 *   class FooContainer extends Container {
 *     ...
 *
 *     getStores() {
 *       const {BarStore, FooStore} = this.props.stores;
 *       return [BarStore, FooStore];
 *     }
 *
 *     calculateState() {
 *       const {BarStore, FooStore} = this.props.stores;
 *       return {
 *         bar: BarStore.getState(),
 *         foo: FooStore.getState(),
 *       };
 *     }
 *
 *     ...
 *   }
 *
 *   module.exports = FooContainer;
 */
class FluxContainer extends Component<DefaultProps, Props, State> {
  state: State;
  constructor(props: Props, context: any) {
    super(props, context);
    this._fluxContainerSubscriptions = new FluxContainerSubscriptions();
    this._fluxContainerSubscriptions.setStores(this.getStores());
    this._fluxContainerSubscriptions.addListener(() => {
      this.setState((prevState) => this.calculateState(prevState));
    });
    this.state = this.calculateState();
  }

  getStores(): Array<FluxStore> {
    return abstractMethod('FluxContainer', 'getStores');
  }

  calculateState(): State {
    return abstractMethod('FluxContainer', 'calculateState');
  }

  componentWillReceiveProps(nextProps: Props, nextContext: any): void {
    this._fluxContainerSubscriptions.setStores(this.getStores());
    this.setState((prevState) => this.calculateState(prevState, nextProps, nextContext));
  }

  componentWillUnmount(): void {
    this._fluxContainerSubscriptions.reset();
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}

/**
 * This is a way to connect stores to a functional stateless view. Here's a
 * simple example:
 *
 *   // FooView.js
 *
 *   function FooView(props) {
 *     return <div>{props.value}</div>;
 *   }
 *
 *   module.exports = FooView;
 *
 *
 *   // FooContainer.js
 *
 *   function getStores() {
 *     return [FooStore];
 *   }
 *
 *   function calculateState() {
 *     return {
 *       value: FooStore.getState();
 *     };
 *   }
 *
 *   module.exports = FluxContainer.createFunctional(
 *     FooView,
 *     getStores,
 *     calculateState,
 *   );
 *
 */
function createFunctional<Props, State, A, B>(
  viewFn: (props: State) => React.Element<State>,
  getStores: (props?: ?Props, context?: any) => Array<FluxStore>,
  calculateState: (prevState?: ?State, props?: ?Props, context?: any) => State,
): ReactClass<Props> {
  class FunctionalContainer extends FluxContainer<void, Props, State> {
    state: State;
    getStores(): Array<FluxStore> {
      return getStores(this.props, this.context);
    }

    calculateState(): State {
      return calculateState(this.state, this.props, this.context);
    }

    render(): React.Element<State> {
      return viewFn(this.state);
    }
  }

  return FunctionalContainer;
}

module.exports = {Container: FluxContainer, createFunctional};
