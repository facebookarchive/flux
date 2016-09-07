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
  Returns an array of strings that are the ids of all known todos. The array is
  empty if no todos have been saved.

GET /todo/$ID
  Returns the todo of the given $ID. The object returned has the shape:

    {
      id: string,
      text: string,
      complete: boolean,
    }

POST /todo/create?text=$TEXT&complete=$COMPLETE
  Creates a todo with the given $TEXT, and $COMPLETE status. The entire
  todo, including id, will be sent back in the response.

POST /todo/update/$ID?text=$TEXT&complete=$COMPLETE
  Updates a todo with the given $TET, and $COMPLETE status. The entire
  todo, including id, will be sent back in the response.

POST /todo/delete/$ID
  Removes the todo of the given $ID.

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
 * Create todo with text, and complete.
 */
app.post('/todo/create', (req, res) => {
  const todos = getTodos();

  const id = nextID();
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
  res.status(200).send(todos[id]);
});

/**
 * Update todo with given id, text, and complete.
 */
app.post('/todo/update/:id', (req, res) => {
  const todos = getTodos();

  const id = req.params.id;
  const text = req.query.text;
  const complete = req.query.complete;

  if (!todos[id]) {
    res.status(404).send(`Todo "${req.params.id}" does not exist.`);
    return;
  }

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
  res.status(200).send(todos[id]);
});

/**
 * Delete an existing todo or 404 if the id doesn't exist.
 */
app.post('/todo/delete/:id', (req, res) => {
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
