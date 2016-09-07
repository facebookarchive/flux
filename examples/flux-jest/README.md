# flux-jest

Being able to unit test stores is critical. This example shows you how to write
tests for the TodoMVC stores we created in an earlier example.

# Usage

```bash
cd path/to/flux-jest
npm install
npm run test
```

# Differences from flux-shell

The primary differences from the `flux-shell` project that are necessary to use
Jest are:

1. Run `npm install --save-dev jest babel-jest`
2. Add `"jest"` property to [`package.json`](./package.json)
3. Update `"test"` key in the `"scripts"` section of [`package.json`](./package.json)

Setting it up this way will reuse the [`.babelrc`](./babelrc) file we already
have set up so we can keep using the same syntax in our test files!

# Check out the tests

Check out the test file and make sure to read through the comments in
`beforeEach()` to get a sense of how and why we set up the test file the way
we did.

- [`TodoStore-test.js`](./src/__tests__/TodoStore-test.js)
- [`TodoStore.js`](../flux-todomvc/src/data/TodoStore.js)
