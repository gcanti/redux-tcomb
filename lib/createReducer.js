var t  = require('tcomb');

function createReducer(initialState, Action, State) {
  State = State || initialState.constructor;
  return function reducer(state, action) {
    if (t.Nil.is(state)) {
      state = initialState;
    }
    if (action.type.indexOf('@@redux') !== 0) {
      return State(Action(action).patch(state));
    }
    return state;
  };
}

module.exports = createReducer;