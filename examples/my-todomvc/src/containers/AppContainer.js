// containers connect state from stores back to views

import AppView from '../views/AppView';
import {Container} from 'flux/utils';
import TodoStore from '../data/TodoStore';

import TodoActions from '../data/TodoActions';

const getStores = () => [
  TodoStore,
];

const getState = () => ({
  todos: TodoStore.getState(),
  onDeleteTodo: TodoActions.deleteTodo, // naming here is interesting: these are called at the
  // invocation of some event in the UI, so it seems the "on" prefix is warranted here: we want
  // the names to reflect that the action is being dispatched as result of user event interaction
  // with our view component
  onToggleTodo: TodoActions.toggleTodo, // functions that do dispatching of the action of concern
}); // interesting here that they are passed down as "state"

// connect stores to functional stateless view
export default Container.createFunctional(AppView, getStores, getState);