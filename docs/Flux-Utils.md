---
id: flux-utils
title: Flux Utils
layout: docs
category: Reference
permalink: docs/flux-utils.html
next: videos
---

Flux Utils is a set of basic utility classes to help get you started with Flux. These base classes are a solid foundation for a simple Flux application, but they are **not** a feature-complete framework that will handle all use cases. There are many other great Flux frameworks out there if these utilities do not fulfill your needs.

## Usage

There are four main classes exposed in Flux Utils:

1. Store
2. ReduceStore
3. Container

These base classes can be imported from `flux/utils` like this:

```js
import {ReduceStore} from 'flux/utils';

class CounterStore extends ReduceStore<number> {
  getInitialState(): number {
    return 0;
  }

  reduce(state: number, action: Object): number {
    switch (action.type) {
      case 'increment':
        return state + 1;

      case 'square':
        return state * state;

      default:
        return state;
    }
  }
}
```

## Best practices

There are some best practices we try to follow when using these classes:

### Stores

1. Cache data
2. Expose public getters to access data (never have public setters)
3. Respond to specific actions from the dispatcher
4. Always emit a change when their data changes
5. Only emit changes during a dispatch

### Actions

1. Describe a user's action, are not setters. (e.g. `select-page` not `set-page-id`)

### Containers

1. Are react components that control a view
2. Primary job is to gather information from stores and save it in their state
3. Have no props and no UI logic

### Views

1. Are react components that are controlled by a container
2. Have all of the UI and rendering logic
3. Receive all information and callbacks as props

# API

## Store

- **constructor(dispatcher: Dispatcher)**
Constructs and registers an instance of this store with the given dispatcher.

- **addListener(callback: Function): {remove: Function}**
Adds a listener to the store, when the store changes the given callback will be called. A token is returned that can be used to remove the listener. Calling the `remove()` function on the returned token will remove the listener.

- **getDispatcher(): Dispatcher**
Returns the dispatcher this store is registered with.

- **getDispatchToken(): DispatchToken**
Returns the dispatch token that the dispatcher recognizes this store by. Can be used to `waitFor()` this store.

- **hasChanged(): boolean**
Ask if a store has changed during the current dispatch. Can only be invoked while dispatching. This can be used for constructing derived stores that depend on data from other stores.

- **__emitChange(): void**
Emit an event notifying all listeners that this store has changed. This can only be invoked when dispatching. Changes are de-duplicated and resolved at the end of this store's `__onDispatch` function.

- **__onDispatch(payload: Object): void**
Subclasses must override this method. This is how the store receives actions from the dispatcher. All state mutation logic must be done during this method.

## ReduceStore<T>

- **extends Store**
This class extends the base Store.

- **getState(): T**
Getter that exposes the entire state of this store. If your state is not immutable you should override this and not expose state directly.

- **getInitialState(): T**
Constructs the initial state for this store. This is called once during construction of the store.

- **reduce(state: T, action: Object): T**
Reduces the current state, and an action to the new state of this store. All subclasses must implement this method. This method should be pure and have no side-effects.

- **areEqual(one: T, two: T): boolean**
Checks if two versions of state are the same. You do not need to override this if your state is immutable.

- **Doesn't need to emit a change**
Note that any store that extends `ReduceStore` does not need to manually emit changes in `reduce()` (you still can if you want to though). The state is compared before and after each dispatch and changes are emitted automatically. If you need to control this behavior (perhaps because your state is mutable) override `areEqual()`.

## Container

- **create(base: ReactClass, options: ?Object): ReactClass**
Create is used to transform a react class into a container that updates its state when relevant stores change. The provided base class must have static methods `getStores()` and `calculateState()`.

```js
import {Component} from 'react';
import {Container} from 'flux/utils';

class CounterContainer extends Component {
  static getStores() {
    return [CounterStore];
  }

  static calculateState(prevState) {
    return {
      counter: CounterStore.getState(),
    };
  }

  render() {
    return <CounterUI counter={this.state.counter} />;
  }
}

const container = Container.create(CounterContainer);
```

Additional options may be provided when creating your container in order to control certain behaviors.

- **containers are pure**
By default containers are pure, meaning they will not re-render when their props and state do not change (as determined by `shallowEquals()`). To disable this behavior pass options `{pure: false}` as the second argument to `create()`.

- **containers cannot access props**
By default containers are not able to access any props. This is both for performance reasons, and to ensure that containers are re-usable and props do not have to be threaded throughout a component tree. There are some valid situations in which you need to determine your state based on both props and a store's state. In those situations pass options `{withProps: true}` as the second argument to `create()`. This will expose the components props as the second argument to `calculateState()`.

If you are unable to utilize react classes most of this functionality is also mirrored in a mixin. `import {Mixin} from 'flux/utils';`
