var tape = require('tape');
var t = require('tcomb');
var reduxTcomb = require('../.');
var createCheckedMiddleware = reduxTcomb.createCheckedMiddleware;
var createCheckedReducer = reduxTcomb.createCheckedReducer;
var createActionType = reduxTcomb.createActionType;
var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;

var State = t.Integer;
var PositiveInteger = t.refinement(t.Integer, function (n) { return n >= 0 }, 'PositiveInteger');
var Action = createActionType({
  INCREMENT: t.interface({ delta: PositiveInteger }),
  DECREMENT: t.interface({ delta: PositiveInteger })
});

function reducer(state, action) {
  if (typeof state === 'undefined') {
    state = 0;
  }
  switch(action.type) {
    case 'INCREMENT' :
      return state + action.delta;
    case 'DECREMENT' :
      return 'wrong';
  }
  return state;
}

tape('createCheckedMiddleware', function (test) {

  test.test('todo', function (assert) {
    assert.plan(1);

    var store = createStore(
      reducer,
      applyMiddleware(
        createCheckedMiddleware(Action)
      )
    )

    store.dispatch({ type: 'INCREMENT', delta: 2 })
    store.dispatch(Action.INCREMENT({ delta: 2 }))
    store.dispatch({ type: 'DECREMENT', delta: 2 })
    try {
      store.dispatch(1)
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value 1 supplied to Action (no constructor returned by dispatch)');
    }
  });

});

tape('createCheckedReducer', function (test) {

  test.test('todo', function (assert) {
    assert.plan(1);

    var store = createStore(
      createCheckedReducer(reducer, State),
      applyMiddleware(
        createCheckedMiddleware(Action)
      )
    )

    try {
      store.dispatch({ type: 'DECREMENT', delta: 2 })
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value "wrong" supplied to Integer');
    }
  });

});
