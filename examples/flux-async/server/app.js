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

// The port is hard coded in the client too. If you change it make sure to
// update it there as well.
const PORT = 3000;

// We will just save everything in a simple json file. Not very efficient, but
// this is just an example :)
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();

/**
 * Set up some help when you navigate to locahost:3000.
 */
app.get('/', (req, res) => {
  res.send(`<pre>

GET /todos
  Returns an array of strings that are the ids of all known todos. The ids
  are in the order they were saved. The array is empty if no todos have been
  saved.

GET /todo/<id>
  Returns the todo of the given \`id\`. The object returned has the shape:

    {
      id: string,
      text: string,
      complete: boolean,
    }

POST /todo/<id>?text=<text>&complete=<complete>
  Saves a todo with the given \`id\`, \`text\`, and \`complete\` status. If the
  \`id\` corresponds to an existing todo it will be updated.

DELETE /todo/<id>
  Removes the todo of the given \`id\`.

</pre>`);
});

/**
 * Read all the ids of todos. These will just be the keys of the json blob.
 */
app.get('/todos', (req, res) => {
  res.status(200).send(Object.keys(getTodos()));
});

/**
 * Return data for particular todo or a 404
 */
app.get('/todo/:id', (req, res) => {
  const todos = getTodos();

  if (!todos[req.params.id]) {
    res.status(404).send(`Todo "${req.params.id}" does not exist.`);
    return;
  }

  res.status(200).send(todos[req.params.id]);
});

/**
 * Update or create todo with given id, text, and complete.
 */
app.post('/todo/:id', (req, res) => {
  const todos = getTodos();

  const id = req.param.id;
  const text = req.query.text;
  const complete = req.query.complete;

  if (text == null) {
    res.status(400).send(`\`text\` query parameter is missing.`);
    return;
  }

  if (complete == null) {
    res.status(400).send(`\`complete\` query parameter is missing.`);
    return;
  }

  todos[id] = {
    id: id,
    text: text,
    complete: !!complete,
  };

  setTodos(todos);
  res.status(200).send();
});

/**
 * Delete an existing todo or 404 if the id doesn't exist.
 */
app.delete('/todo/:id', (req, res) => {
  const todos = getTodos();

  if (!todos[req.params.id]) {
    res.status(404).send(`Todo "${req.params.id}" does not exist.`);
    return;
  }

  delete todos[req.params.id];
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

function getTodos() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function setTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.strinify(todos, null, 2), 'utf8');
}
