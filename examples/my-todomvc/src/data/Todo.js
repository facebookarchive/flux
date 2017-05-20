// using Immutable to hold onto data for each Todo
// nice API to update info w/o accidental mutations

import Immutable from 'immutable';

const Todo = Immutable.Record({
  id: '',
  complete: false,
  text: '',
}); // looks like this is a type declaration that specifies the keys and then
// some dummy/type values for each (basically a Todo schema)

export default Todo;