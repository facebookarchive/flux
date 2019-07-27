---
id: related-libraries
title: Related Libraries
---

### React – User Interfaces

If any JavaScript project has taken the front end ecosystem by storm in recent years, that would be [React](https://reactjs.org). React is a library built and open-sourced by the smart people at Facebook. In React, developers write components for their web interface and compose them together.

React brings about many radical ideas and encourages developers to [rethink best practices](https://www.youtube.com/watch?v=DgVS-zXgMTk). For many years, web developers were taught that it was a good practice to write HTML, JavaScript and CSS separately. React does the exact opposite, and encourages that you write your HTML and [CSS in your JavaScript](https://speakerdeck.com/vjeux/react-css-in-js) instead. This sounds like a crazy idea at first, but after trying it out, it actually isn't as weird as it sounds initially. Reason being the front end development scene is shifting towards a paradigm of component-based development. The features of React:

- **Declarative** - You describe what you want to see in your view and not how to achieve it. In the jQuery days, developers would have to come up with a series of steps to manipulate the DOM to get from one app state to the next. In React, you simply change the state within the component and the view will update itself according to the state. It is also easy to determine how the component will look like just by looking at the markup in the `render()` method.

- **Functional** - The view is a pure function of `props` and `state`. In most cases, a React component is defined by `props` (external parameters) and `state` (internal data). For the same `props` and `state`, the same view is produced. Pure functions are easy to test, and the same goes for functional components. Testing in React is made easy because a component's interfaces are well-defined and you can test the component by supplying different `props` and `state` to it and comparing the rendered output.

- **Maintainable** - Writing your view in a component-based fashion encourages reusability. We find that defining a component's `propTypes` make React code self-documenting as the reader can know clearly what is needed to use that component. Lastly, your view and logic is self-contained within the component, and should not be affected nor affect other components. That makes it easy to shift components around during large-scale refactoring, as long as the same `props` are supplied to the component.

- **High Performance** - You might have heard that React uses a virtual DOM (not to be confused with [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)) and it re-renders everything when there is a change in state. Why is there a need for a virtual DOM? While modern JavaScript engines are fast, reading from and writing to the DOM is slow. React keeps a lightweight virtual representation of the DOM in memory. Re-rendering everything is a misleading term. In React it actually refers to re-rendering the in-memory representation of the DOM, not the actual DOM itself. When there's a change in the underlying data of the component, a new virtual representation is created, and compared against the previous representation. The difference (minimal set of changes required) is then patched to the real browser DOM.

- **Ease of Learning** - Learning React is pretty simple. The React API surface is relatively small compared to [this](https://angular.io/docs/ts/latest/api/); there are only a few APIs to learn and they do not change often. The React community is one of the largest, and along with that comes a vibrant ecosystem of tools, open-sourced UI components, and a ton of great resources online to get you started on learning React.

- **Developer Experience** - There are a number of tools that improves the development experience with React. [React Developer Tools](https://github.com/facebook/react-devtools) is a browser extension that allows you to inspect your component, view and manipulate its `props` and `state`. [Hot reloading](https://github.com/gaearon/react-hot-loader) with webpack allows you to view changes to your code in your browser, without you having to refresh the browser. Front end development involves a lot of tweaking code, saving and then refreshing the browser. Hot reloading helps you by eliminating the last step. When there are library updates, Facebook provides [codemod scripts](https://github.com/reactjs/react-codemod) to help you migrate your code to the new APIs. This makes the upgrading process relatively pain-free. Kudos to the Facebook team for their dedication in making the development experience with React great.

### Immutable.js – Immutable Data

[Immutable.js](https://immutable-js.github.io/immutable-js/) is a library for creating immutable data structures. Immutable data cannot be changed once created, leading to much simpler application development, no defensive copying, and enabling advanced memoization and change detection techniques with simple logic. Persistent data presents a mutative API which does not update the data in-place, but instead always yields new updated data.

### Jest – Unit Testing

[Jest](http://facebook.github.io/jest/) is a testing library by Facebook that aims to make the process of testing pain-free. As with Facebook projects, it provides a great development experience out of the box. Tests can be run in parallel resulting in shorter duration. During watch mode, by default, only the tests for the changed files are run. One cool feature is "Snapshot Testing". Jest can save the generated output of your React component and Redux state and save it as serialized files, so you wouldn't have to manually come up with the expected output yourself. Jest also comes with built-in mocking, assertion and test coverage. One library to rule them all!

### Redux - Alternative State Management

As Flux is not a framework per se, developers have tried to come up with many implementations of the Flux pattern. Eventually, a clear winner emerged, which was [Redux](http://redux.js.org/). Redux combines the ideas from Flux, [Command pattern](https://www.wikiwand.com/en/Command_pattern) and [Elm architecture](https://guide.elm-lang.org/architecture/) and is the de facto state management library developers use with React these days. Its core concepts are:

- App **state** is described by a single plain old JavaScript object (POJO).
- Dispatch an **action** (also a POJO) to modify the state.
- **Reducer** is a pure function that takes in current state and action to produce a new state.

The concepts sound simple, but they are really powerful as they enable apps to:

- Have their state rendered on the server, booted up on the client.
- Trace, log and backtrack changes in the whole app.
- Implement undo/redo functionality easily.

The creator of Redux, [Dan Abramov](https://github.com/gaearon), has taken great care in writing up detailed documentation for Redux, along with creating comprehensive video tutorials for learning [basic](https://egghead.io/courses/getting-started-with-redux) and [advanced](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) Redux. They are extremely helpful resources for learning Redux.
