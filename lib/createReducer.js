var t  = require('tcomb');
var isValidAction = require('./isValidAction');

function createReducer(initialState, Action, State) {
  State = State || initialState.constructor;
  return function reducer(state, action) {
    if (t.Nil.is(state)) {
      state = initialState;
    }
    if (isValidAction(action)) {
      return State(Action(action).patch(state));
    }
    return state;
  };
}

module.exports = createReducer;