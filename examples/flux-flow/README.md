# flux-flow

This is a very simple example that highlights how to set up Flux and
[Flow](https://flowtype.org/) in the same project. Flow is a static-type
checking tool that will help catch errors in your code statically. It
complements Flux well since it supports refining the action based on a
type string.

# Usage

```bash
cd path/to/flux-flow
flow
```

_Note: Since flow is a static analysis tool you don't actually need to build
anything for this example._

# Differences from flux-shell

The primary differences from the `flux-shell` project that are necessary to use
Flow are:

1. Copy the `Flux` library definitions from [`./flow`](./flow)
2. Create a [`.flowconfig`](./.flowconfig) file with the correct options

After that you can navigate to your project and run `flow` in the terminal.

# Kinds of errors caught by flow

- Check out: [`__flowtests__/App-flowtest.js`](./src/__flowtests__/App-flowtest.js)
- Or remove the `suppress_comment` line from [`.flowconfig`](./.flowconfig)

# Const params

You may notice that `.flowconfig` has `experimental.const_params=true` in it.
This is generally necessary to make refinements on the payload stronger. If for
other reasons it's not possible to use this option in your project you may
need to do this to work around Flow refinement issues:

```
function reduce(state: State, _action: Action): State {
  const action = _action;
  ...
}
```
