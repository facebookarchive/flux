# Changelog

### 3.1.1

* No meaningful changes.

### 3.1.0

* `Dispatcher`: Methods `register` and `unregister` can once again be called in
 the middle of a dispatch.

### 3.0.0

* `FluxMapStore`: Removed. It added very little value over `FluxReduceStore`.
* `FluxContainer`: Subscriptions are setup in constructor rather than
 `componentDidMount`
* `FluxContainer`: Can create containers using stateless functional components
* `FluxContainer`: Uses functional version of `setState`
* `FluxMixin`: Subscriptions are setup in `componentWillMount` rather than
 `componentDidMount`
* `Dispatcher`: Methods `register` and `unregister` can not be called in the
 middle of a dispatch
* `React` added as peer dependency to `flux/utils`
* Package `dist/FluxUtils.js` alongside `dist/Flux.js`

_**Note**: This is marked as a breaking change due to the large number of small
changes in `FluxContainer`. Depending on how coupled code is to the timing of
`componentWillMount`, `componentDidMount`, or setting state synchronously it is
possible that there may be some breakages. Generally it should not be an issue._

### 2.1.1

* Publish `dist/` on npm

### 2.1.0

* Add flux-utils which include four main base classes: `Store`, `ReduceStore`,
 `MapStore`, `Container`
* Add flux-utils example and documentation
* Upgrade build script
* Publish a minified version of `Flux` in `dist/`
* Add flow types to `Dispatcher`
