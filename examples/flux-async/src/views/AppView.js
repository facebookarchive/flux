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

import FakeID from '../utils/FakeID';
import React from 'react';

import classnames from 'classnames';

type AppViewProps = {
  draft: string,
  ids: LoadObjectState<Immutable.List<string>>,
  todos: LoadObjectMap<string, Todo>,

  onDelete: (ids: Array<string>) => void,
  onDraftCreate: (value: string) => void,
  onDraftSet: (value: string) => void,
  onRetry: (todo: Todo) => void,
  onUpdateTodos: (todos: Array<Todo>) => void,
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

  onDelete: (ids: Array<string>) => void,
  onRetry: (todo: Todo) => void,
  onUpdateTodos: (todos: Array<Todo>) => void,
};

function Main(props: MainProps): ?React.Element<*> {
  const {
    ids,
    todos,
    onDelete,
    onRetry,
    onUpdateTodos,
  } = props;

  if (!ids.getLoadObject().hasValue()) {
    return null;
  }

  const list = ids.getLoadObject().getValueEnforcing();
  if (list.size === 0) {
    return null;
  }

  const areAllComplete = list.every(id => {
    const todoLo = todos.get(id);
    return !todoLo.hasValue() || todoLo.getValueEnforcing().complete;
  });

  const onToggleAll = () => {
    const toUpdate = todos
      .filter(lo => lo.hasValue() && lo.isDone())
      .getValues()
      .map(lo => lo.getValueEnforcing())
      .filter(todo => areAllComplete ? todo.complete : !todo.complete)
      .map(todo => todo.set('complete', !todo.complete));
    onUpdateTodos(toUpdate);
  };

  const listItems = [];
  list.forEach((id, i) => {
    listItems.push(
      <TodoItem
        key={id}
        todoLo={todos.get(id)}
        onDelete={onDelete}
        onRetry={onRetry}
        onUpdateTodos={onUpdateTodos}
      />
    );
  });

  return (
    <section id="main">
      <input
        checked={areAllComplete ? 'checked' : ''}
        id="toggle-all"
        type="checkbox"
        onChange={onToggleAll}
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
  todos: LoadObjectMap<string, Todo>,

  onDelete: (ids: Array<string>) => void,
};

function Footer(props: FooterProps): ?React.Element<*> {
  const todos = props.todos
    .filter(lo => lo.hasValue())
    .getValues()
    .map(lo => lo.getValueEnforcing());

  if (todos.length === 0) {
    return null;
  }

  const remaining = todos.filter(todo => !todo.complete).length;
  const completed = todos.length - remaining;
  const phrase = remaining === 1 ? ' item left' : ' items left';

  let clearCompletedButton = null;
  if (completed > 0) {
    const completedIDs = todos
      .filter(todo => todo.complete)
      .map(todo => todo.id);
    clearCompletedButton =
      <button
        id="clear-completed"
        onClick={() => props.onDelete(completedIDs)}>
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
  todoLo: LoadObject<Todo>,

  onDelete: (ids: Array<string>) => void,
  onRetry: (todo: Todo) => void,
  onUpdateTodos: (todos: Array<Todo>) => void,
};

function TodoItem(props: TodoItemProps): ?React.Element<*> {
  const {
    todoLo,
    onDelete,
    onRetry,
    onUpdateTodos,
  } = props;

  if (!todoLo.hasValue()) {
    return (
      <li className={classnames({
        hasError: todoLo.hasError(),
        shimmer: todoLo.hasOperation(),
      })}>
        <div className="view">
          <label>Loading...</label>
        </div>
      </li>
    );
  }

  const todo = todoLo.getValueEnforcing();

  let boundOnToggle = () => {};
  let buttons = null;
  if (todoLo.isDone()) {
    // Can only toggle real todos.
    if (!FakeID.isFake(todo.id)) {
      boundOnToggle = () => onUpdateTodos([todo.set(
        'complete',
        !todo.complete,
      )]);
    }
    buttons = (
      <div className="todo-buttons">
        <button className="retry" onClick={() => onRetry(todo)} />
        <button className="destroy" onClick={() => onDelete([todo.id])} />
      </div>
    );
  }

  return (
    <li className={classnames({
      hasError: todoLo.hasError(),
      shimmer: todoLo.hasOperation(),
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.complete}
          onChange={boundOnToggle}
        />
        <label>{todo.text}</label>
        {buttons}
      </div>
    </li>
  );
}

export default AppView;
