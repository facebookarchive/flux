/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

// We simulate an error a percentage of the time, this helps show how our app
// is robust to network errors.
const ERROR_PCT = 25.0;

// The port is hard coded in the client too. If you change it make sure to
// update it there as well.
const PORT = 3000;

// We will just save everything in a simple json file. Not very efficient, but
// this is just an example :)
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();

app.use('/home', express.static('.'));

// Add a random delay to all requests. Set SHOULD_DELAY to false for a more
// responsive server, or play around with the delay RANGE.
const SHOULD_DELAY = true;
const RANGE = [250, 2000];
app.use((req, res, next) => {
  if (SHOULD_DELAY) {
    const delay = Math.random() * (RANGE[1] - RANGE[0]) + RANGE[0];
    const start = Date.now();
    while (Date.now() - start < delay) {}
  }
  next();
});

/**
 * Set up some help when you navigate to locahost:3000.
 */
app.get('/', (req, res) => {
  res.send(`<pre>

To view the todo app go to http://localhost:${PORT}/home.

==========

GET /ids
  Description:
    Gets a list of all known todo ids.

  Query Params:
    None

  Response:
    (list<string>): ids of all todos

GET /todo
  Description:
    This is a way to request data for a single todo.

  Query Params:
    id (string): the id to get data for

  Response:
    (Todo): todo for given id

GET /todos
  Description:
    This is a way to request data for multiple todos.

  Query Params:
    ids (list<string>): the ids to get data for

  Response:
    (list<Todo>): todos for given ids

POST /todo/create
  Description:
    Creates a new todo. The ID will be created on the server. Text is the only
    input. All todos start out with complete being false.

  Query Params:
    text (string): text content for the new todo

  Response:
    (Todo): the created todo

POST /todos/create
  Description:
    Creates many new todos. The IDs will be created on the server. Text is the
    only input. All todos start out with complete being false.

  Query Params:
    texts (list<string>): text content for the new todos

  Response:
    (list<Todo>): the created todos

POST /todo/update
  Description:
    Updates a single todo. The todo must already exist.

  Query Params:
    id (string): the id to update
    text (string): the new text value
    complete (bool): the new complete value

  Response:
    (Todo): the updated todo

POST /todos/update
  Description:
    Updates multiple todos. The todos must already exist. All of the following
    lists must be the same size and in the same order.

  Query Params:
    ids (list<string>): the ids to update
    texts (list<string>): the new text values
    completes (list<bool>): the new complete values

  Response:
    (list<Todo>): the updated todos

POST /todo/delete
  Description:
    Deletes a single todo. The todo must already exist.

  Query Params:
    id (string): the id to delete

  Response:
    (none): no response, just check the status code

POST /todos/delete
  Description:
    Deletes multiple todos. The todos must already exist.

  Query Params:
    ids (list<string>): the ids to delete

  Response:
    (none): no response, just check the status code

</pre>`);
});

app.get('/ids', (req, res) => {
  res.status(200).send(Object.keys(getTodos()));
});

app.get('/todo', (req, res) => {
  const rawID = req.query.id;
  if (rawID == null) {
    missing(res, 'id');
    return;
  }
  const id = JSON.parse(rawID);

  const todos = getTodos();
  if (todos[id] == null) {
    missingID(res, id);
    return;
  }

  res.status(200).send(todos[id]);
});

app.get('/todos', (req, res) => {
  const rawIDs = req.query.ids;
  if (rawIDs == null) {
    missing(res, 'ids');
    return;
  }

  const ids = JSON.parse(rawIDs);
  if (!unique(ids)) {
    res.status(400).send('ids contains duplicates');
    return;
  }
  const todos = getTodos();
  const result = [];
  for (const id of ids) {
    if (todos[id] == null) {
      missingID(res, id);
      return;
    }
    result.push(todos[id]);
  }

  res.status(200).send(result);
});

app.post('/todo/create', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawText = req.query.text;
  if (rawText == null) {
    missing(res, 'text');
    return;
  }
  const text = JSON.parse(rawText);

  const newTodo = {
    id: nextID(),
    text: String(text),
    complete: false,
  };

  const todos = getTodos();
  todos[newTodo.id] = newTodo;
  setTodos(todos);

  res.status(200).send(newTodo);
});

app.post('/todos/create', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawTexts = req.query.texts;
  if (rawTexts == null) {
    missing(res, 'texts');
    return;
  }

  const texts = JSON.parse(rawTexts);
  const newTodos = [];
  for (const text of texts) {
    newTodos.push({
      id: nextID(),
      text: String(text),
      complete: false,
    });
  }

  const todos = getTodos();
  for (const newTodo of newTodos) {
    todos[newTodo.id] = newTodo;
  }
  setTodos(todos);

  res.status(200).send(newTodos);
});

app.post('/todo/update', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawID = req.query.id;
  if (rawID == null) {
    missing(res, 'id');
    return;
  }
  const id = JSON.parse(rawID);

  const rawText = req.query.text;
  if (rawText == null) {
    missing(res, 'text');
    return;
  }
  const text = JSON.parse(rawText);

  const rawComplete = req.query.complete;
  if (rawComplete == null) {
    missing(res, 'complete');
    return;
  }
  const complete = JSON.parse(rawComplete);

  const todos = getTodos();
  if (todos[id] == null) {
    missingID(res, id);
    return;
  }

  todos[id].text = String(text);
  todos[id].complete = Boolean(complete);
  setTodos(todos);

  res.status(200).send(todos[id]);
});

app.post('/todos/update', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawIDs = req.query.ids;
  const rawTexts = req.query.texts;
  const rawCompletes = req.query.completes;
  if (rawIDs == null) {
    missing(res, 'ids');
    return;
  }
  if (rawTexts == null) {
    missing(res, 'texts');
    return;
  }
  if (rawCompletes == null) {
    missing(res, 'completes');
    return;
  }
  const ids = JSON.parse(rawIDs);
  if (!unique(ids)) {
    res.status(400).send('ids contains duplicates');
    return;
  }
  const texts = JSON.parse(rawTexts);
  const completes = JSON.parse(rawCompletes);
  if (ids.length !== texts.length) {
    res.status(400).send("The number of ids does not match number of texts.");
    return;
  }
  if (ids.length !== completes.length) {
    res
      .status(400)
      .send("The number of ids does not match number of completes.");
    return;
  }

  const results = [];
  const todos = getTodos();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const text = texts[i];
    const complete = completes[i];
    if (todos[id] == null) {
      missingID(res, id);
      return;
    }
    todos[id].text = String(text);
    todos[id].complete = Boolean(complete);
    results.push(todos[id]);
  }

  setTodos(todos);
  res.status(200).send(results);
});

app.post('/todo/delete', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawID = req.query.id;
  if (rawID == null) {
    missing(res, 'id');
    return;
  }
  const id = JSON.parse(rawID);

  const todos = getTodos();
  if (todos[id] == null) {
    missingID(res, id);
    return;
  }

  delete todos[id];
  setTodos(todos);
  res.status(200).send();
});

app.post('/todos/delete', (req, res) => {
  if (randomError(res)) {
    return;
  }

  const rawIDs = req.query.ids;
  if (rawIDs == null) {
    missing(res, 'ids');
    return;
  }

  const ids = JSON.parse(rawIDs);
  if (!unique(ids)) {
    res.status(400).send('ids contains duplicates');
    return;
  }

  const todos = getTodos();
  for (let id of ids) {
    if (todos[id] == null) {
      missingID(res, id);
      return;
    }
    delete todos[id];
  }

  setTodos(todos);
  res.status(200).send();
});

/**
 * Start listening on port 3000
 */
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

///// Some helper functions /////

function randomError(res) {
  if (Math.random() * 100 <= ERROR_PCT) {
    res
      .status(400)
      .send('A random error occurred. Adjust frequency of these in app.js.');
    return true;
  }
  return false;
}

function unique(arr) {
  const set = new Set(arr);
  return set.size === arr.length;
}

function missing(res, field) {
  res.status(400).send(`Missing required query param: ${field}.`);
}

function missingID(res, id) {
  res.status(404).send('Todo not found for ID: ${id}.');
}

function getTodos() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function setTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
}

let max = null;
function nextID() {
  if (max == null) {
    max = 0;
    Object.keys(getTodos()).forEach(key => {
      if (/^id_[1-9]\d*$/.test(key)) {
        const idPart = key.split('_')[1];
        max = Math.max(max, Number(idPart));
      } else {
        throw new Error(
          `Invalid id "${key}" found, ids must look like id_<number>`
        );
      }
    });
  }
  return 'id_' + (++max);
}
