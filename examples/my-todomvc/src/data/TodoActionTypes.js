const ActionTypes = {
  ADD_TODO: 'ADD_TODO', // recall: we cannot use shorthand here because we need to have the value be an identifier of a variable defined the same name as a property; here, it is just a string literal
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
};

export default ActionTypes;

