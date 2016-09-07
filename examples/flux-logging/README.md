# flux-logging

Taking advantage of the fact that a store gets every action makes it easy to
add logging to a Flux application. Check out this quick example where we add
a logger store to the TodoMVC app we created in an earlier example.

# Usage

```bash
cd path/to/flux-logging
npm install
npm run watch
# open path/to/flux-logging/index.html in your browser
```

# See the logging

Open the console in your browser and start adding todos. There should be
logging printed to the console for each action that is fired.

To see how this is accomplished in code look at the logger store we created:

- [`TodoLoggerStore.js`](./src/TodoLoggerStore.js)
