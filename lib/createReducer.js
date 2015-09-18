var t  = require('tcomb');
var isReduxAction = require('./isReduxAction');

function createReducer(initialState, Action, State) {

  // handle optional State argument (use the initialState constructor as default)
  if (!State && initialState && t.Function.is(initialState.constructor)) {
    State = initialState.constructor;
  }

  if (process.env.NODE_ENV !== 'production') {
    t.assert(t.isType(Action), function () { return 'Invalid argument Action supplied to createReducer(initialState, Action, [State]) function (expected a type)'; });
    t.assert(t.isType(State), function () { return 'Invalid argument State supplied to createReducer(initialState, Action, [State]) function (expected a type)'; });
  }

  var ret = function reducer(state, action) {
    if (t.Nil.is(state)) {
      state = initialState;
    }
    if (!isReduxAction(action)) {
      return State(Action(action).patch(State(state)));
    }
    return state;
  };

  ret.initialState = initialState;
  ret.State = State;
  ret.Action = Action;

  return ret;
}

module.exports = createReducer;