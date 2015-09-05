var isValidAction = require('./isValidAction');

function getCheckedReducer(reducer, State, Action) {
  return function checkedReducer(state, action) {
    if (process.env.NODE_ENV !== 'production') {
      if (state) {
        State(state);
      }
      if (isValidAction(action)) {
        Action(action);
      }
    }
    state = reducer(state, action);
    if (process.env.NODE_ENV !== 'production') {
      State(state);
    }
    return state
  };
}

module.exports = getCheckedReducer;