# flux-todomvc

This is the simplest example. It walks you through creating the classic [TodoMVC](http://todomvc.com/) application using a reference Flux implementation. It does not describe how to create the reference Flux implementation, that will be saved for a later example.

## Prerequisites

- Be comfortable with ES6
  - [ES6 Overview in 350 Bullet Points](https://ponyfoo.com/articles/es6)
  - [Additional Resources](https://github.com/ericdouglas/ES6-Learning)
- Understand the basics of flux at a high-level, this guide will be an application of those basics
  - TODO: Write and link to a proper guide
  - [Flux Utils](../../docs/Flux-Utils.md)

## 1. Getting started

Clone and build the flux repo:

```bash
git clone https://github.com/facebook/flux.git
cd flux
npm install
```

Copy and build [flux-shell](../flux-shell):

```bash
cp -R examples/flux-shell examples/my-todomvc
cd examples/my-todomvc
npm install
npm run watch
```

Open `examples/my-todomvc/index.html` in your browser.

- [ ] **You should see a blank page that says "Hello World!"**

## 2. Set up TodoMVC assets

Copy assets from `examples/todomvc-common`

```bash
cp -R ../todomvc-common todomvc-common
```

Update `examples/my-todomvc/index.html` to include the assets:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flux • TodoMVC</title>
    <link rel="stylesheet" href="todomvc-common/base.css">
  </head>
  <body>
    <section id="todoapp"></section>
    <footer id="info">
      <p>Double-click to edit a todo</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <script src="./bundle.js"></script>
  </body>
</html>
```

Update `examples/my-todomvc/src/root.js` to render into correct element:

```js
ReactDOM.render(<div>Hello World!</div>, document.getElementById('todoapp'));
```

Refresh `examples/my-todomvc/index.html` in your browser.

- [ ] **The page should now have some styling and still say "Hello World!" in the center.**
  - _(If it doesn't, make sure `npm run watch` is still running)_

## 3. Setting up Flux

Set up folder structure:

```
src
├── containers
│   └── AppContainer.js
├── data
│   ├── TodoActions.js
│   ├── TodoActionTypes.js
│   ├── TodoDispatcher.js
│   └── TodoStore.js
├── root.js
└── views
    └── AppView.js
```

Set up `TodoDispatcher`. Here we just need to import dispatcher from Flux
and instantiate a new dispatcher to use throughout the application.

```js
import {Dispatcher} from 'flux';

export default new Dispatcher();
```

Create the actions and action types. Let's set up the files that will eventually
contain all of the actions in the application.

Set up `data/TodoActionTypes.js`. This is a simple enum to list the kinds of
actions we will be creating.

```js
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
};

export default ActionTypes;
```

Set up `data/TodoActions.js`. Each function here returns an action that we can
then dispatch.

```js
import TodoActionTypes from './TodoActionTypes';

const Actions = {
  addTodo(text) {
    return {
      type: TodoActionTypes.ADD_TODO,
      text,
    };
  },
};

export default Actions;
```

Now we can set up our first store! Open `data/TodoStore.js`. This will save
information about all of the Todo objects in our application. It will use an
Immutable map as the state.

```js
import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import TodoActionTypes from './TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

class TodoStore extends ReduceStore {
  constructor() {
    super(TodoDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case TodoActionTypes.ADD_TODO:
        // Do nothing for now, we will add logic here soon!
        return state;

      default:
        return state;
    }
  }
}

export default new TodoStore();
```

Let's set up a really simple view using React. Open `views/AppView.js`.

```js
import React from 'react';

function AppView() {
  return <div>Hello from Flux!</div>;
}

export default AppView;
```

Containers are what connects the state from stores to views, let's set up
`containers/AppContainer.js` now.

```js
import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import TodoStore from '../data/TodoStore';

function getStores() {
  return [
    TodoStore,
  ];
}

function getState() {
  return {
    todos: TodoStore.getState(),
  };
}

export default Container.createFunctional(AppView, getStores, getState);
```

Then finally, let's update the root of our application to render this new
`AppContainer`. Open `root.js`:

```js
import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<AppContainer />, document.getElementById('todoapp'));
```

- [ ] **Reload the page, it should look basically the same as the last step but say "Hello from Flux!"**
