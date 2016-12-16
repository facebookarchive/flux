# flux-async

This is an advanced example. It pulls a lot of the concepts from previous
examples into a single application. This implements TodoMVC where the data
is persisted and requested through a simple server. The server simulates
delays and errors. In the example we will handle things like optimistic
updates, loading states, and failing API requests.

# Disclaimer

This is just one way to handle asynchronous actions. It is not the only way,
and may not be the best way. This is simply how we deal with asynchronous
actions most commonly at Facebook.

# Usage

```bash
cd path/to/flux-async
npm install

# builds client code when it changes (npm run build to build just once)
npm run watch

# starts server, code is at ./server/app.js
npm run start

# this will run flow and make sure there are no type errors in the code
flow

# navigate to: http://localhost:3000/home/ to use the todo application
```

# Code Concepts

## DataManager

In this example we introduce DataManagers. This is how to communicate with a
server in Flux. A DataManager translates input arguments into an action. The
resulting action should always be dispatched asynchronously. This allows time
for an API request in before dispatching the action.

DataManagers should only be called from stores.

## LoadObject

`LoadObject`s are immutable objects that represent a piece of data that has to
be requested from the server. It can have any combination of: `value`, `error`,
and `operation`. We can represent many things, some examples:

A piece of data we just requested: (`null`, `null`, `'LOADING'`)

Data that has had an error: (`null`, `Invalid Request`, `'NONE'`)

Data that we are retrying: (`null`, `'Invalid Request'`, `'LOADING'`)

Normal piece of data: (`'Some data'`, `null`, `'NONE'`)

Data that we are updating: (`'Some data'`, `null`, `'UPDATING'`)

And many others states your data might be in. There are also several supporting
objects to `LoadObject`.

### LoadObjectMap

`LoadObjectMap` is an immutable map that has `LoadObject` values. When a key is
requested that does not exist instead of returning null it will return an empty
`LoadObject`, this helps prevent the need for null-checking when we can use
`LoadObject`'s to represent the absence of a value. Additionally on construction
you can provide a function that will be called with keys that are requested that
do not yet have a value. This makes it easy to figure out when to load data from
the server. Generally you dispatch an action with the missing keys so that a
store will start loading them.

### LoadObjectState

`LoadObjectState` provides similar functionality to `LoadObjectMap` but for
when your state is a single `LoadObject`.

## FakeID

ID's are always created on the server, so in order to optimistically update we
need a service to generate some fake IDs. We just use a really simple utility
that also has a mechanism for testing if IDs are fake. Without this it would be
hard to provide optimistic updates and properly correlate responses with data
that we are already rendering.

## ListStore

List stores are a kind of store responsible for keeping track of a list of IDs.
They only store IDs. They should never store lists of the objects themselves,
that should always be in another store that keeps track of a map of those
objects. This separates the concerns of simply loading the object data, and
figuring out in which order it should render, dealing with sorting, filtering,
etc. This makes it possible for the ordering to change without having to
re-render views that use the unchanged data.

## Flow actions

Instead of using action-creators we dispatch our actions manually. This only
works because we have strongly typed every possible action in `TodoActions`.
This means that Flow will have an error if we ever try to dispatch something
that is invalid. This also allows us to refine actions in our reduce functions
and make sure we are accessing valid properties based on what kind of action
we are dealing with.
