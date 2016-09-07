# flux-jest-container

Testing the container logic that connects stores to views can be tricky. This
example shows you how to create some utilities to help mock out store data in
order to write these kinds of tests effectively.

# Usage

```bash
cd path/to/flux-jest
npm install
npm run test
```

# Differences from flux-shell

The primary differences from the `flux-shell` project that are necessary to use
Jest are:

1. Run `npm install --save-dev jest babel-jest react-test-renderer`
2. Add `"jest"` property to [`package.json`](./package.json)
3. Update `"test"` key in the `"scripts"` section of [`package.json`](./package.json)

Setting it up this way will reuse the [`.babelrc`](./babelrc) file we already
have set up so we can keep using the same syntax in our test files!

# Check out the tests

Check out the test file and make sure to read through the comments in
`beforeEach()` to get a sense of how and why we set up the test file the way
we did.

In this test we make use of `toMatchSnapshot()` which will serialize
the state of a react component to a snapshot file. Then if any changes are made
that cause the snapshot to change the test will fail unless we explicitly decide
to update the snapshot. This helps prevent any unexpected UI regressions. Read
more about snapshot testing in the blog post here:
[React Tree Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Important files for this example:

- [`AppContainer-test.js`](./src/__tests__/AppContainer-test.js)
- [`AppContainer-test.js.snap`](./src/__tests__/__snapshots__/AppContainer-test.js.snap)
- [`AppContainer.js`](../flux-todomvc/src/containers/AppContainer.js)
