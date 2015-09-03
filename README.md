Type checked immutable actions and state for redux.

# Features

- actions are immutables and type checked
- state is immutable and type checked
- action are dfined as tcomb structs: constructors can be used as action creators
- `actionTypes` constants are not required
- default reducer implementation (no `switch` required)

# Workflow

1. define the state structure
2. define the actions and their effect on state (patch functions)
3. wire them up and get a default reducer implementation

# Example

## 1.

```js
// State.js

import { t } from 'redux-tcomb';

const Todo = t.struct({
  id: t.Number,         // a required number
  text: t.String,       // a required string
  completed: t.Boolean  // a required boolean
}, 'Todo');

export default t.list(Todo, 'State'); // a list of `Todo`s
```

## 2.

```js
// actions.js

import { t, createUnion } from 'redux-tcomb';

// t.struct(props, name) defines a JavaScript class
const AddTodo = t.struct({
  text: t.String
}, 'AddTodo'); // <= give the type a name for better error messages

// a patch is a function state -> state
AddTodo.prototype.patch = function (state) {
  return t.update(state, { $push: [{
    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    text: this.text,
    completed: false
  }] });
};

// no constants in the action definitions...
const EditTodo = t.struct({
  id: t.Number,
  text: t.String
}, 'EditTodo');

// ...constants are defined here as export names
export default createUnion({
  ADD_TODO: AddTodo,
  EDIT_TODO: EditTodo
});
```

## 3.

```js
import { createStore } from 'redux';
import State from './State';
import Action from './actions';
import { createReducer } from 'redux-tcomb';

const initialState = State([]);
const reducer = createReducer(initialState, Action);
const store = createStore(reducer);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
});

store.getState(); // => { todos: [ { id: 0, text: 'Build my first Redux app', completed: false } ] }
```

# API

## createUnion(actions: {key: [string]: type}, [name: string])

## createReducer(initialState: State, Action: type)