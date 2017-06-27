# flux-todomvc

This example is where you should start. It walks you through creating the
classic [TodoMVC](http://todomvc.com/) application using a simple Flux
implementation.

## Prerequisites

- ES6
  - [ES6 Overview in 350 Bullet Points](https://ponyfoo.com/articles/es6)
  - [Additional Resources](https://github.com/ericdouglas/ES6-Learning)
- React
  - [Getting Started](https://facebook.github.io/react/docs/getting-started.html)
- Exposure to the high-level concepts of Flux, this tutorial will be an application of those concepts
  - [Flux Concepts](../flux-concepts)
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
  - _If it doesn't, make sure `npm run watch` is still running_

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

Set up `data/TodoActions.js`. Each function here dispatches an action.

```js
import TodoActionTypes from './TodoActionTypes';
import TodoDispatcher from './TodoDispatcher';

const Actions = {
  addTodo(text) {
    TodoDispatcher.dispatch({
      type: TodoActionTypes.ADD_TODO,
      text,
    });
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

Finally, let's update the root of our application to render this new
`AppContainer`. Open `root.js`:

```js
import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<AppContainer />, document.getElementById('todoapp'));
```

- [ ] **Reload the page, it should look basically the same as the last step but say "Hello from Flux!"**

## 4. Rendering some Todos

We will use Immutable.js to hold onto data about each Todo. This will give us
a nice API to update their information without needing to worry about
accidentally mutating the Todo. Create `data/Todo.js`.

```js
import Immutable from 'immutable';

const Todo = Immutable.Record({
  id: '',
  complete: false,
  text: '',
});

export default Todo;
```


Now we can use this structure, along with a simple
[`Counter`](./src/data/Counter.js) to implement the `ADD_TODO` action. Create
or copy [`Counter`](./src/data/Counter.js) then update `data/TodoStore.js`

```js
import Counter from './Counter';
import Todo from './Todo';

class TodoStore extends ReduceStore {
  ...
  reduce(state, action) {
    switch (action.type) {
      case TodoActionTypes.ADD_TODO:
        // Don't add todos with no text.
        if (!action.text) {
          return state;
        }
        const id = Counter.increment();
        return state.set(id, new Todo({
          id,
          text: action.text,
          complete: false,
        }));

      default:
        return state;
    }
  }
}
```

Let's update our view to actually render the Todos that are being stored. Update
`views/AppView.js`.

```js
function AppView(props) {
  return (
    <div>
      <Header {...props} />
      <Main {...props} />
      <Footer {...props} />
    </div>
  );
}

function Header(props) {
  return (
    <header id="header">
      <h1>todos</h1>
    </header>
  );
}

function Main(props) {
  if (props.todos.size === 0) {
    return null;
  }
  return (
    <section id="main">
      <ul id="todo-list">
        {[...props.todos.values()].reverse().map(todo => (
          <li key={todo.id}>
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={todo.complete}
                onChange={
                  // Empty function for now, we will implement this later.
                  () => {}
                }
              />
              <label>{todo.text}</label>
              <button
                className="destroy"
                onClick={
                  // Empty function for now, we will implement this later.
                  () => {}
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer(props) {
  if (props.todos.size === 0) {
    return null;
  }
  return (
    <footer id="footer">
      <span id="todo-count">
        <strong>
          {props.todos.size}
        </strong>
        {' items left'}
      </span>
    </footer>
  );
}
```

To make sure it all works we have to create some fake data for now. Modify
`root.js` to create some fake Todos after the initial render.

```js
import AppContainer from './containers/AppContainer';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<AppContainer />, document.getElementById('todoapp'));

// We will remove these lines later:

import TodoActions from './data/TodoActions';

TodoActions.addTodo('My first task');
TodoActions.addTodo('Another task');
TodoActions.addTodo('Finish this tutorial');
```

- [ ] **Refresh the page and you should see some data that is coming from your `TodoStore`!**
  - _Keep in mind that it's not interactive yet, so no buttons will work_

## 5. Adding some interactivity

Let's add a few more actions so that the buttons do something.

Update `data/TodoActionTypes.js`

```js
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
};
```

Update `data/TodoActions.js`

```js
const Actions = {
  addTodo(text) {
    TodoDispatcher.dispatch({
      type: TodoActionTypes.ADD_TODO,
      text,
    });
  },

  deleteTodo(id) {
    TodoDispatcher.dispatch({
      type: TodoActionTypes.DELETE_TODO,
      id,
    });
  },

  toggleTodo(id) {
    TodoDispatcher.dispatch({
      type: TodoActionTypes.TOGGLE_TODO,
      id,
    });
  },
};
```

Update `data/TodoStore.js`

```js
class TodoStore extends ReduceStore {
  ...
  reduce(state, action) {
    switch (action.type) {
      ...
      case TodoActionTypes.DELETE_TODO:
        return state.delete(action.id);

      case TodoActionTypes.TOGGLE_TODO:
        return state.update(
          action.id,
          todo => todo.set('complete', !todo.complete),
        );
      ...
    }
  }
}
```

Now our store is capable of deleting or toggling a Todo. Let's hook it up to
our view now. In a Flux app the **only** place that should have knowledge of
Flux is the container, this means we have to define the callbacks in
`AppContainer` and pass them down to `AppView`, the view does not dispatch the
actions directly. This makes it easier to reuse, test, and change views.

Update `containers/AppContainer.js`

```js
import TodoActions from '../data/TodoActions';

function getState() {
  return {
    todos: TodoStore.getState(),

    onDeleteTodo: TodoActions.deleteTodo,
    onToggleTodo: TodoActions.toggleTodo,
  };
}
```

Now we need to use the callbacks and update a small amount of rendering logic
that displays the number of completed todos. Update `views/AppView.js`

```js
function Main(props) {
  if (props.todos.size === 0) {
    return null;
  }
  return (
    <section id="main">
      <ul id="todo-list">
        {[...props.todos.values()].reverse().map(todo => (
          <li key={todo.id}>
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={todo.complete}
                onChange={() => props.onToggleTodo(todo.id)}
              />
              <label>{todo.text}</label>
              <button
                className="destroy"
                onClick={() => props.onDeleteTodo(todo.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer(props) {
  if (props.todos.size === 0) {
    return null;
  }

  const remaining = props.todos.filter(todo => !todo.complete).size;
  const phrase = remaining === 1 ? ' item left' : ' items left';

  return (
    <footer id="footer">
      <span id="todo-count">
        <strong>
          {remaining}
        </strong>
        {phrase}
      </span>
    </footer>
  );
}
```

- [ ] **Refresh the page and you should be able to toggle todos and delete them. Toggling todos should also update the counter of todos remaining in the footer.**

## 6. Remaining functionality

Now you should be familiar enough with the structure of the todo app to
implement the remaining pieces on your own. This last step outlines a good
ordering for completing them. Make sure to reference the full example
implementation as needed.

1. Create the NewTodo view
  - Create the `TodoDraftStore` which tracks the contents of the NewTodo input, it will respond to two actions:
    - `UPDATE_DRAFT` which changes the draft contents
    - `ADD_TODO` which clears the draft contents (because the todo was added and is no longer a draft)
    - _Note: It would also be reasonable to keep track of this in React state, but in this tutorial we will make an effort to have all components be controlled so you get more experience dealing with stores._
  - Create the `updateDraft` action and pass through container
  - Hook everything up to the view
2. Add clear completed button to the Footer
  - Create `deleteCompletedTodos` action
  - Add button to fire action to the footer
3. Add Mark all as complete button
  - Create `toggleAllTodos` action
    - If any todos are incomplete, this marks them all as complete
    - If all todos are complete, this marks them all as incomplete
  - Hook it up to Main view
4. Add ability to edit todos on double click
  - Create the `TodoEditStore` which tracks the ID of the Todo currently being edited
  - Create `startEditingTodo` and `stopEditingTodo` actions
  - Create `editTodo` action
  - Create TodoItem view component with editing functionality
