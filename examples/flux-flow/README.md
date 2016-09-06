# flux-flow

This is a simple application demonstrating how to use Flow types with Flux.

# Usage

```bash
cd path/to/flux-flow
flow
```

_Note: Since flow is a static analysis tool you don't actually need to build
anything for this example._

# Kinds of errors caught by flow

- Check out: [`__flowtests__/App-flowtest.js`](./src/__flowtests__/App-flowtest.js)
- Or remove the `suppress_comment` line from [`.flowconfig`](./.flowconfig)

# To set up Flow in your own project

Copy the [`./flow`](./flow) folder's library definitions, and
the [`./.flowconfig`](./.flowconfig) file.

### Const params

You may notice that `.flowconfig` has `experimental.const_params=true` in it.
This is generally necessary to make refinements on the payload stronger. If for
other reasons it's not possible to use this options in your project you may
need to do this to work around Flow refinement issues:

```
function reduce(state: State, _action: Action): State {
  const action = _action;
  ...
}
```
