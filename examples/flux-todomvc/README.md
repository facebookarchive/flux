# Flux TodoMVC Example

> An application architecture for React utilizing a unidirectional data flow.


## Learning Flux

The [Flux](http://facebook.github.io/flux) and [React](http://facebook.github.io/react) websites are great resources for getting started.

Read the blog post announcing Flux: ["An Application Architecture for React"](http://facebook.github.io/react/blog/2014/05/06/flux.html), then read more about the [Flux architecture](http://facebook.github.io/react/docs/flux-overview.html) and a [TodoMVC tutorial](http://facebook.github.io/react/docs/flux-todo-list.html) explaining the structure of the files in this folder.  After you feel comfortable with the TodoMVC example, you may be interested in the [Chat App example](../flux-chat), which is more complex.


## Overview

Flux applications have three major parts: the ___dispatcher___, the ___stores___, and the ___views___ (React components).  These should not be confused with Model-View-Controller.  Controllers do exist in a Flux application, but they are ___controller-views___ -- views often found at the top of the hierarchy that retrieve data from the stores and pass this data down to their children.  Additionally, ___action creators___ — dispatcher helper methods — are often used to support a semantic dispatcher API.  It can be useful to think of them as a fourth part of the Flux update cycle.

Flux eschews MVC in favor of a unidirectional data flow. When a user interacts with a React ___view___, the view propagates an ___action___ through a central ___dispatcher___, to the various ___stores___ that hold the application's data and business logic, which updates all of the views that are affected. This works especially well with React's declarative programming style, which allows the store to send updates without specifying how to transition views between states.

We originally set out to deal correctly with derived data: for example, we wanted to show an unread count for message threads while another view showed a list of threads, with the unread ones highlighted. This was difficult to handle with MVC — marking a single thread as read would update the thread model, and then also need to update the unread count model.  These dependencies and cascading updates often occur in a large MVC application, leading to a tangled weave of data flow and unpredictable results.

Control is inverted with ___stores___: the stores accept updates and reconcile them as appropriate, rather than depending on something external to update its data in a consistent way. Nothing outside the store has any insight into how it manages the data for its domain, helping to keep a clear separation of concerns. This also makes stores more testable than models, especially since stores have no direct setter methods like `setAsRead()`, but instead have only an input point for a data payload, which is delivered through the ___dispatcher___ and originates with ___action creators___.


## Structure and Data Flow

Data in a Flux application flows in a single direction, in a cycle:

<img src="../../docs/img/flux-diagram-white-background.png" style="width: 100%;" />

A unidirectional data flow is central to the Flux pattern, and in fact Flux takes its name from the Latin word for flow. In the above diagram, the ___dispatcher___, ___stores___ and ___views___ are independent nodes with distinct inputs and outputs. The ___action creators___ are simply discrete, semantic helper functions that facilitate passing data to the ___dispatcher___ in the form of an ___action___.

All data flows through the ___dispatcher___ as a central hub.  ___Actions___ most often originate from user interactions with the ___views___, and ___action creators___ are nothing more than a call into the ___dispatcher___.  The ___dispatcher___ then invokes the callbacks that the ___stores___ have registered with it, effectively dispatching the data payload contained in the ___actions___ to all ___stores___.  Within their registered callbacks, ___stores___ determine which ___actions___ they are interested in, and respond accordingly.  The ___stores___ then emit a "change" event to alert the ___controller-views___ that a change to the data layer has occurred.  ___Controller-views___ listen for these events and retrieve data from the ___stores___ in an event handler.  The ___controller-views___ call their own `render()` method via `setState()` or `forceUpdate()`, updating themselves and all of their children.

This structure allows us to reason easily about our application in a way that is reminiscent of functional reactive programming, or more specifically data-flow programming or flow-based programming, where data flows through the application in a single direction — there are no two-way bindings. Application state is maintained only in the ___stores___, allowing the different parts of the application to remain highly decoupled. Where dependencies do occur between ___stores___, they are kept in a strict hierarchy, with synchronous updates managed by the ___dispatcher___.

We found that two-way data bindings led to cascading updates, where changing one object led to another object changing, which could also trigger more updates. As applications grew, these cascading updates made it very difficult to predict what would change as the result of one user interaction. When updates can only change data within a single round, the system as a whole becomes more predictable.

Let's look at the various parts of the Flux update cycle up close. A good place to start is the dispatcher.


### A Single Dispatcher

The dispatcher is the central hub that manages all data flow in a Flux application. It is essentially a registry of callbacks into the stores. Each store registers itself and provides a callback. When the dispatcher is invoked in an action creator method, all stores in the application are sent a data payload via the callbacks in the registry.

As an application grows, the dispatcher becomes more vital, as it can manage dependencies between stores by invoking the registered callbacks in a specific order.  Stores can declaratively wait for other stores to finish updating, and then update themselves accordingly.


### Stores

Stores contain the application state and logic. Their role is somewhat similar to a model in a traditional MVC, but they manage the state of many objects — they are not instances of one object. Nor are they the same as Backbone's collections. More than simply managing a collection of ORM-style objects, stores manage the application state for a particular __domain__ within the application.

For example, Facebook's [Lookback Video Editor](https://facebook.com/lookback/edit) utilized a TimeStore that kept track of the playback time position and the playback state. On the other hand, the same application's ImageStore kept track of a collection of images.  The TodoStore in our TodoMVC example is similar in that it manages a collection of to-do items.  A store exhibits characteristics of both a collection of models and a singleton model of a logical domain.

As mentioned above, a store registers itself with the dispatcher and provides it with a callback. This callback receives a data payload as a parameter. The payload contains an action with an attribute identifying the action's type. Within the store's registered callback, a switch statement based on the action's type is used to interpret the payload and to provide the proper hooks into the store's internal methods. This allows an action to result in an update to the state of the store, via the dispatcher. After the stores are updated, they broadcast an event declaring that their state has changed, so the views may query the new state and update themselves.


### Views and Controller-Views

React provides the kind of composable views we need for the view layer. Close to the top of the nested view hierarchy, a special kind of view listens for events that are broadcast by the stores that it depends on. One could call this a ___controller-view___, as it provides the glue code to get the data from the stores and to pass this data down the chain of its descendants. We might have one of these controller-views governing any significant section of the page.

When it receives the event from the store, it first requests the new data it needs via the stores' public getter methods. It then calls its own `setState()` or `forceUpdate()` methods, causing its `render()` method and the `render()` method of all its descendants to run.

We often pass the entire state of the store down the chain of views in a single object, allowing different descendants to use what they need. In addition to keeping the controller-like behavior at the top of the hierarchy, and thus keeping our descendant views as functionally pure as possible, passing down the entire state of the store in a single object also has the effect of reducing the number of props we need to manage.

Occasionally we may need to add additional controller-views deeper in the hierarchy to keep components simple.  This might help us to better encapsulate a section of the hierarchy related to a specific  data domain.  Be aware, however, that controller-views deeper in the hierarchy can violate the singular flow of data by introducing a new, potentially conflicting entry point for the data flow.  In making the decision of whether to add a deep controller-view, balance the gain of simpler components against the complexity of multiple data updates flowing into the hierarchy at different points.  These multiple data updates can lead to odd effects, with React's render method getting invoked repeatedly by updates from different controller-views, potentially increasing the difficulty of debugging.


### Actions and Action Creators

The dispatcher exposes a method that allows a view to trigger a dispatch to the stores, and to include a payload of data.  This data payload contains an action, an object literal containing the various fields of data and a specific action type. The action construction may be wrapped into a semantic helper method, which we refer to as action creators. These methods provide the payload to the dispatcher. For example, we may want to change the text of a to-do item in a to-do list application. We would create an action creator method like `updateText(todoId, newText)` in our `TodoActions` module. This method may be invoked from within our views' event handlers, so we can call it in response to a user interaction. The action creator method also adds the type to the action, so that when the payload is interpreted in the store, it can respond appropriately to a payload with a particular action type. In our example, this type might be named something like `TODO_UPDATE_TEXT`.

Actions may also come from other places, such as the server. This happens, for example, during data initialization. It may also happen when the server returns an error code or when the server has updates to provide to the application. We'll talk more about server actions in a future article. In this example application we're only concerned with the basics of the data flow.


### What About that Dispatcher?

As mentioned earlier, the dispatcher is also able to manage dependencies between stores. This functionality is available through the Dispatcher's `waitFor()` method.  The TodoMVC application is extremely simple, so we did not need to use this method, but in a larger, more complex application, this method becomes vital.

Within the TodoStore's registered callback we can explicitly wait for any dependencies to first update before moving forward:

```
case 'TODO_CREATE':
  Dispatcher.waitFor([
    PrependedTextStore.dispatchToken,
    YetAnotherStore.dispatchToken
  ]);
  TodoStore.create(PrependedTextStore.getText() + ' ' + action.text);
  TodoStore.emit('change');
  break;
```

The arguments for `waitFor()` are an array of dipatcher registry indexes, which we refer to here as each store's dispatchToken. When waitFor() is encountered in a callback, it tells the Dispatcher to invoke the callbacks for the required stores. After these callbacks complete, the original callback can continue to execute. Thus the store that is invoking `waitFor()` can depend on the state of another store to inform how it should update its own state.

A problem arises if we create circular dependencies. If Store A waits for Store B, and B waits for A, then we could wind up in an endless loop. The Dispatcher will flag these circular dependencies with console errors.


## TodoMVC Example Implementation

In this TodoMVC example application, we can see the elements of Flux in our directory structure. Views here are referred to as "components" as they are React components.

<pre>
./
  index.html
  js/
    actions/
      TodoActions.js
    app.js
    bundle.js
    dispatcher/
      AppDispatcher.js
      Dispatcher.js
    components/
      Footer.react.js
      Header.react.js
      MainSection.react.js
      TodoApp.react.js
      TodoItem.react.js
      TodoTextInput.react.js
    stores/
      TodoStore.js
</pre>

The primary entry point into the application is app.js.  This file bootstraps the React rendering inside of index.html.  TodoApp.react.js is our controller-view and it passes all data down into its child React components.

TodoActions.js is a collection of action creator methods that views may call from within their event handlers, in response to user interactions.  They are nothing more than helpers that call into the AppDispatcher.

Dispatcher.js is a base class for AppDispatcher.js which extends it with a small amount of application-specific code.

TodoStore.js is our only store.  It provides all of the application logic and in-memory storage.  Based on EventEmitter from Node.js, it emits "change" events after responding to actions in the callback it registers with the dispatcher.

The bundle.js file is automatically genenerated by the build process, explained below.


## Running

You must have [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

    npm install

This will install all dependencies.

To build the project, first run this command:

    npm start

This will perform an initial build and start a watcher process that will update build.js with any changes you wish to make.  This watcher is based on [Browserify](http://browserify.org/) and [Watchify](https://github.com/substack/watchify), and it transforms React's JSX syntax into standard JavaScript with [Reactify](https://github.com/andreypopp/reactify).

To run the app, spin up an HTTP server and visit http://localhost/.../todomvc-flux/.  Or simply open the index.html file in a browser.


## Credit

This TodoMVC application was created by [Bill Fisher](https://www.facebook.com/bill.fisher.771).  This README document was written by Bill Fisher and the principal creator of Flux, [Jing Chen](https://www.facebook.com/jing).


## License
Flux is BSD-licensed. We also provide an additional patent grant.
