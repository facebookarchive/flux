/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import type Immutable from 'immutable';
import type LoadObject from '../load_object/LoadObject';
import type LoadObjectMap from '../load_object/LoadObjectMap';
import type LoadObjectState from '../load_object/LoadObjectState';
import type Todo from '../records/Todo';

import React from 'react';

import classnames from 'classnames';

type AppViewProps = {
  draft: string,
  ids: LoadObjectState<Immutable.List<string>>,
  todos: LoadObjectMap<string, Todo>,

  onDraftCreate: (value: string) => void,
  onDraftSet: (value: string) => void,
};

function AppView(props: AppViewProps): ?React.Element<*> {
  return (
    <div>
      <Header {...props} />
      <Main {...props} />
      <Footer {...props} />
    </div>
  );
}

type HeaderProps = {
  draft: string,

  onDraftCreate: (value: string) => void,
  onDraftSet: (value: string) => void,
};

function Header(props: HeaderProps): ?React.Element<*> {
  return (
    <header id="header">
      <h1>todos</h1>
      <NewTodo {...props} />
    </header>
  );
}

type MainProps = {
  ids: LoadObjectState<Immutable.List<string>>,
  todos: LoadObjectMap<string, Todo>,
};

function Main(props: MainProps): ?React.Element<*> {
  const {ids, todos} = props;
  if (!ids.getLoadObject().hasValue()) {
    return null;
  }

  const list = ids.getLoadObject().getValueEnforcing();
  if (list.size === 0) {
    return null;
  }

  const areAllComplete = list.every(id => {
    const todo = todos.get(id);
    return !todo.hasValue() || todo.getValueEnforcing().complete;
  });

  const listItems = [];
  list.forEach((id, i) => {
    listItems.push(
      <TodoItem
        key={id}
        todo={todos.get(id)}
        todoBeingEdited={null}
      />
    );
  });

  return (
    <section id="main">
      <input
        checked={areAllComplete ? 'checked' : ''}
        id="toggle-all"
        type="checkbox"
        onChange={() => {}}
      />
      <label htmlFor="toggle-all">
        Mark all as complete
      </label>
      <ul id="todo-list">
        {listItems.reverse()}
      </ul>
    </section>
  );
}

type FooterProps = {

};

function Footer(props: FooterProps): ?React.Element<*> {
  return null;

  /*
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
  */
}

type NewTodoProps = {
  draft: string,

  onDraftCreate: (value: string) => void,
  onDraftSet: (value: string) => void,
};

const ENTER_KEY_CODE = 13;
function NewTodo(props: NewTodoProps): ?React.Element<*> {
  const create = () => props.onDraftCreate(props.draft);
  const onBlur = () => create();
  const onChange = (event) => props.onDraftSet(event.target.value);
  const onKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      create();
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

type TodoItemProps = {
  todo: LoadObject<Todo>,
  todoBeingEdited: ?string,
};

function TodoItem(props: TodoItemProps): ?React.Element<*> {
  const {
    todo,
    todoBeingEdited,
  } = props;

  if (!todo.hasValue()) {
    return (
      <li>
        <div className="view">
          <label>Loading...</label>
        </div>
      </li>
    );
  } else {
    return (
      <li>
        <div className="view">
          <label>{todo.getValueEnforcing().text}</label>
        </div>
      </li>
    );
  }

  /*
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
  */
}

export default AppView;
