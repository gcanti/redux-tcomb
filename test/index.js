var tape = require('tape');
var combineReducers = require('redux').combineReducers;
var reduxTcomb = require('../.');
var t = reduxTcomb.t;
var createUnion = reduxTcomb.createUnion;
var getCheckedReducer = reduxTcomb.getCheckedReducer;
var createReducer = reduxTcomb.createReducer;
var isReduxAction = require('../lib/isReduxAction');
var actions = require('./actions');

var Todo = t.struct({
  id: t.Number,
  text: t.String,
  completed: t.Boolean
}, 'Todo');

var State = t.struct({
  todos: t.list(Todo)
}, 'State');

var Action = createUnion(actions, 'MyUnion');

var initialState = {todos: []};

tape('createUnion', function (test) {

  test.test('should throw if the actions argument is wrong', function (assert) {
    assert.plan(3);

    try {
      createUnion(1, 'MyUnion');
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid argument action 1 supplied to createUnion(actions, name) function (expected a dictionary String -> Type)');
    }

    try {
      createUnion({}, 'MyUnion');
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid argument types [] supplied to union(types, [name]) combinator (expected an array of at least 2 types)');
    }

    try {
      createUnion({ADD_TODO: actions.ADD_TODO}, 'MyUnion');
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid argument types [\n  null\n] supplied to union(types, [name]) combinator (expected an array of at least 2 types)');
    }

  });

  test.test('should throw if the name argument is wrong', function (assert) {
    assert.plan(1);

    try {
      createUnion({ADD_TODO: actions.ADD_TODO}, 1);
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid argument name 1 supplied to createUnion(actions, name) function (expected a string)');
    }

  });

  test.test('should throw if dispatch is called with a wrong action', function (assert) {
    assert.plan(3);

    try {
      Action.dispatch();
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid action undefined (expected an object with a type property)');
    }

    try {
      Action.dispatch({});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid action {} (expected an object with a type property)');
    }

    try {
      Action.dispatch({type: '<unknown>'});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Unknown action type <unknown> for union MyUnion');
    }

  });

  test.test('given a set of actions should return their union', function (assert) {
    assert.plan(3);

    var MyUnion = createUnion(actions, 'MyUnion');
    assert.strictEqual(MyUnion.meta.kind, 'union');
    assert.strictEqual(MyUnion.meta.name, 'MyUnion');
    assert.deepEqual(MyUnion.meta.types, [actions.ADD_TODO, actions.EDIT_TODO]);
  });

});

tape('getCheckedReducer', function (test) {

  function reducer(state, action) {
    if (typeof state === 'undefined') {
      state = {todos: []};
    }
    switch (action.type) {
      case 'ADD_TODO' :
        return {
          todos: state.todos.concat({
            id: 1,
            text: action.text,
            completed: false
          })
        };
      case 'EDIT_TODO' :
        return {};
      default :
        return state;
    }
  }

  var checkedReducer = getCheckedReducer(reducer, State, Action);

  test.test('should not check the state if undefined', function (assert) {
    assert.plan(1);
    var state = checkedReducer(undefined, {type: 'ADD_TODO', text: 'Use redux-tcomb'});
    assert.deepEqual(state, {todos: [{id: 1, text: 'Use redux-tcomb', completed: false}]});
  });

  test.test('should check the state', function (assert) {
    assert.plan(2);

    try {
      checkedReducer({}, {type: 'ADD_TODO', text: 'Use redux-tcomb'});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value undefined supplied to State/todos: Array<Todo> (expected an array of Todo)');
    }

    var state = checkedReducer({todos: []}, {type: 'ADD_TODO', text: 'Use redux-tcomb'});
    assert.deepEqual(state, {todos: [{id: 1, text: 'Use redux-tcomb', completed: false}]});
  });

  test.test('should check the action', function (assert) {
    assert.plan(2);

    try {
      checkedReducer(initialState, {text: 'Use redux-tcomb'});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid action {\n  "text": "Use redux-tcomb"\n} (expected an object with a type property)');
    }

    try {
      checkedReducer(initialState, {type: 'ADD_TODO', text: 1});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value 1 supplied to MyUnion(ADD_TODO)/text: String');
    }

  });

  test.test('should not check redux internal actions', function (assert) {
    assert.plan(1);
    assert.strictEqual(checkedReducer(initialState, {type: '@@redux/INIT'}), initialState);
  });

  test.test('should check the returned state', function (assert) {
    assert.plan(1);

    try {
      checkedReducer(initialState, {type: 'EDIT_TODO', id: 1, text: 'hello'});
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value undefined supplied to State/todos: Array<Todo> (expected an array of Todo)');
    }

  });

  test.test('should handle combineReducers', function (assert) {
    assert.plan(1);

    function todoReducer(state, action) {
      if (!isReduxAction(action)) {
        Action(action);
      }
      return state || [];
    }

    var reducer = combineReducers({
      todos: todoReducer
    });

    assert.deepEqual(reducer(undefined, {type: 'ADD_TODO', text: 'Use redux-tcomb'}), {todos: []}); // ok
  });

});

tape('createReducer', function (test) {

  test.test('should create a reducer', function (assert) {
    assert.plan(3);
    var reducer = createReducer(initialState, Action, State);
    assert.strictEqual(t.Function.is(reducer), true);
    assert.strictEqual(reducer.State, State);
    assert.strictEqual(reducer.Action, Action);
  });

  test.test('should throw if initialState has not a constructor', function (assert) {
    assert.plan(1);

    try {
      createReducer(undefined, Action);
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid argument State supplied to createReducer(initialState, Action, [State]) function (expected a type)');
    }

  });

  test.test('should use the initialState constructor if the argument State is not passed in', function (assert) {
    assert.plan(2);
    var reducer = createReducer(State(initialState), Action);
    assert.strictEqual(reducer.State, State);
    assert.strictEqual(reducer.Action, Action);
  });

  test.test('should not check redux internal actions', function (assert) {
    assert.plan(1);
    var reducer = createReducer(initialState, Action, State);
    assert.strictEqual(reducer(undefined, {type: '@@redux/INIT'}), initialState);
  });

  test.test('should handle initialState', function (assert) {
    assert.plan(1);
    var reducer = createReducer(initialState, Action, State);
    assert.deepEqual(reducer(undefined, {type: 'ADD_TODO', text: 'Use redux-tcomb'}), {todos: [{id: 1, text: 'Use redux-tcomb', completed: false}]});
  });

  test.test('should check actions', function (assert) {
    assert.plan(1);

    var reducer = createReducer(initialState, Action, State);
    try {
      reducer(undefined, {})
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid action {} (expected an object with a type property)');
    }

  });

  test.test('should check the state', function (assert) {
    assert.plan(1);

    var reducer = createReducer(initialState, Action, State);
    try {
      reducer(1, {type: 'ADD_TODO', text: 'Use redux-tcomb'})
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value 1 supplied to State (expected an object)');
    }

  });

  test.test('should check the returned state', function (assert) {
    assert.plan(1);

    var reducer = createReducer(initialState, Action, State);
    try {
      reducer(undefined, {type: 'EDIT_TODO', id: 1, text: 'Use redux-tcomb'})
    } catch (e) {
      assert.strictEqual(e.message, '[tcomb] Invalid value undefined supplied to State/todos: Array<Todo> (expected an array of Todo)');
    }

  });

});
