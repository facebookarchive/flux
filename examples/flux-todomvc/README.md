# flux-todomvc

This is the simplest example. It walks you through creating the classic [TodoMVC](http://todomvc.com/) application using a reference Flux implementation. It does not describe how to create the reference Flux implementation, that will be saved for a later example.

## 1. Getting started

Clone and build the flux repo:

```bash
git clone https://github.com/facebook/flux.git
cd flux
npm install
```

Copy and build [flux-shell](../flux-shell):

```bash
cp -R examples/flux-shell examples/my-todomvc
cd examples/my-todomvc
npm install
npm run watch
```

Open `examples/my-todomvc/index.html` in your browser.

[ ] **You should see a blank page that says "Hello World!"**

## 2. Set up TodoMVC assets

Copy assets from `./examples/todomvc-common`

```bash
cp -R examples/todomvc-common examples/my-todomvc/todomvc-common
```

Update `./examples/my-todomvc/index.html` to include the assets:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flux • TodoMVC</title>
    <link rel="stylesheet" href="todomvc-common/base.css">
  </head>
  <body>
    <section id="todoapp"></section>
    <footer id="info">
      <p>Double-click to edit a todo</p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    <script src="./bundle.js"></script>
  </body>
</html>
```

Update `./examples/my-todomvc/src/root.js` to render into correct element:

```js
ReactDOM.render(<div>Hello World!</div>, document.getElementById('todoapp'));
```

Refresh `examples/my-todomvc/index.html` in your browser.

[ ] **The page should now have some styling and still say "Hello World!" in the center.**

_(If it doesn't, make sure `npm run watch` is still running)_