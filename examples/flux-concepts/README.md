# flux-concepts

These are the important high-level concepts and principles you should know
about when writing applications that use Flux.

## Overview

Flux is a pattern for managing data flow in your application. The most
important concept is that data flows in one direction. As we go through
this guide we'll talk about the different pieces of a Flux application
and show how they form unidirectional cycles that data can flow through.

## Flux Parts

- Dispatcher
- Store
- Action
- View

## Dispatcher

The dispatcher receives actions and dispatches them to stores that have
registered with the dispatcher. **Every store will receive every action.**
There should be only one singleton dispatcher in each application.

Example:

1. User types in title for a todo and hits enter.
2. The view captures this event and **dispatches** an "add-todo" action
   containing the title of the todo.
3. **Every store** will then receive this action.

## Store

A store is what holds the data of an application. Stores will register
with the application's dispatcher so that they can receive actions. **The
data in a store must only be mutated by responding to an action.** There
should not be any public setters on a store, only getters. Stores decide
what actions they want to respond to. **Every time a store's data changes it
must emit a "change" event.** There should be many stores in each
application.

Examples:

1. Store receives an "add-todo" action.
2. It decides it is relevant and adds the todo to the list of things
   that need to be done today.
3. The store updates its data and then emits a "change" event.

## Actions

Actions define the internal API of your application. They capture the ways
in which anything might interact with your application. They are simple
objects that have a "type" field and some data.

Actions should be semantic and descriptive of the action taking place.
They should not describe implementation details of that action. Use
"delete-user" rather than breaking it up into "delete-user-id",
"clear-user-data", "refresh-credentials" (or however the process works).
Remember that all stores will receive the action and can know they need
to clear the data or refresh credentials by handling the same "delete-user"
action.

Examples:

1. When a user clicks "delete" on a completed todo a single "delete-todo"
   action is dispatched:

```
  {
    type: 'delete-todo',
    todoID: '1234',
  }
```

## Views

Data from stores is displayed in views. Views can use whatever framework
you want (In most examples here we will use React). **When a view uses data
from a store it must also subscribe to change events from that store.** Then
when the store emits a change the view can get the new data and re-render.
If a component ever uses a store and does not subscribe to it then there
is likely a subtle bug waiting to be found. Actions are typically dispatched
from views as the user interacts with parts of the application's interface.

Example:

1. The main view subscribes to the TodoStore.
2. It accesses a list of the Todos and renders them in a readable format for
   the user to interact with.
3. When a user types in the title of a new Todo and hits enter the view tells 
   the Dispatcher to dispatch an action.
4. All stores receive the dispatched action.
5. The TodoStore handles the action and adds another Todo to its internal
   data structure, then emits a "change" event.
6. The main view is listening for the "change" event. It gets the event,
   gets new data from the TodoStore, and then re-renders the list of Todos
   in the user interface.
   
## Flow of data

We can piece the parts of Flux above into a diagram describing how data flows
through the system.

1. Views send actions to the dispatcher.
2. The dispatcher sends actions to every store.
3. Stores send data to the views.
  - _(Different phrasing: Views get data from the stores.)_

![Data flow within Flux application](./flux-simple-f8-diagram-with-client-action-1300w.png)

_(There is also another node in the diagram accounting for actions that do not
originate from views, which is common)_

## Next steps

There are also plenty of great summaries of the Flux architecture online, feel
free to search around for more resources if you need to.

Otherwise you can start coding with the [flux-todomvc](../flux-todomvc) example,
or head back to check out the full list of [example topics](..).
