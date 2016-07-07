function createCheckedReducer(reducer, State) {
  return function (state, action) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof state !== 'undefined') {
        State(state);
      }
    }
    state = reducer(state, action);
    if (process.env.NODE_ENV !== 'production') {
      State(state);
    }
    return state
  };
}

module.exports = createCheckedReducer;