/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

import React from 'react';

import classnames from 'classnames';

function AppView(props) {
  return (
    <div>
      <Header {...props} />
      <Main {...props} />
      <Footer {...props} />
    </div>
  );
}

function Header(props) {
  return (
    <header id="header">
      <h1>todos</h1>
      <NewTodo {...props} />
    </header>
  );
}

function Main(props) {
  if (props.todos.size === 0) {
    return null;
  }

  // If this were expensive we could move it to the container.
  const areAllComplete = props.todos.every(todo => todo.complete);

  return (
    <section id="main">
      <input
        checked={areAllComplete ? 'checked' : ''}
        id="toggle-all"
        type="checkbox"
        onChange={props.onToggleAllTodos}
      />
      <label htmlFor="toggle-all">
        Mark all as complete
      </label>
      <ul id="todo-list">
        {[...props.todos.values()].reverse().map(todo => (
          <TodoItem
            key={todo.id}
            editing={props.editing}
            todo={todo}
            onDeleteTodo={props.onDeleteTodo}
            onEditTodo={props.onEditTodo}
            onStartEditingTodo={props.onStartEditingTodo}
            onStopEditingTodo={props.onStopEditingTodo}
            onToggleTodo={props.onToggleTodo}
          />
        ))}
      </ul>
    </section>
  );
}

function Footer(props) {
  if (props.todos.size === 0) {
    return null;
  }

  const remaining = props.todos.filter(todo => !todo.complete).size;
  const completed = props.todos.size - remaining;
  const phrase = remaining === 1 ? ' item left' : ' items left';

  let clearCompletedButton = null;
  if (completed > 0) {
    clearCompletedButton =
      <button
        id="clear-completed"
        onClick={props.onDeleteCompletedTodos}>
        Clear completed ({completed})
      </button>
  }

  return (
    <footer id="footer">
      <span id="todo-count">
        <strong>
          {remaining}
        </strong>
        {phrase}
      </span>
      {clearCompletedButton}
    </footer>
  );
}

const ENTER_KEY_CODE = 13;
function NewTodo(props) {
  const addTodo = () => props.onAdd(props.draft);
  const onBlur = () => addTodo();
  const onChange = (event) => props.onUpdateDraft(event.target.value);
  const onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      addTodo();
    }
  };
  return (
    <input
      autoFocus={true}
      id="new-todo"
      placeholder="What needs to be done?"
      value={props.draft}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}

function TodoItem(props) {
  const {editing, todo} = props;
  const isEditing = editing === todo.id;
  const onDeleteTodo = () => props.onDeleteTodo(todo.id);
  const onStartEditingTodo = () => props.onStartEditingTodo(todo.id);
  const onToggleTodo = () => props.onToggleTodo(todo.id);

  // Construct the input for editing a task if necessary.
  let input = null;
  if (isEditing) {
    const onChange = (event) => props.onEditTodo(todo.id, event.target.value);
    const onStopEditingTodo = props.onStopEditingTodo;
    const onKeyDown = (event) => {
      if (event.keyCode === ENTER_KEY_CODE) {
        onStopEditingTodo();
      }
    };
    input =
      <input
        autoFocus={true}
        className="edit"
        value={todo.text}
        onBlur={onStopEditingTodo}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />;
  }

  return (
    <li
      className={classnames({
        completed: todo.complete,
        editing: isEditing,
      })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.complete}
          onChange={onToggleTodo}
        />
        <label onDoubleClick={onStartEditingTodo}>
          {todo.text}
        </label>
        <button className="destroy" onClick={onDeleteTodo} />
      </div>
      {input}
    </li>
  );
}


export default AppView;
