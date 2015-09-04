Immutable and type checked state / actions for redux

# Why?

## Primary goals

- actions are naked (*), immutables and type checked
- state is naked (*), immutable and type checked
- actions are defined as [tcomb](https://github.com/gcanti/tcomb) structs, this means that constructors can be used as **action creators**

(*) works like regular objects and arrays

## Secondary goals

- get rid of constants
- get rid of action creators
- get rid of `switch`

# Is this slow?

Nope. `Object.freeze` calls and the asserts are executed only in development and stripped out in production (using `process.env.NODE_ENV = 'production'` tests).

# Workflow

1. define the state structure
2. define the actions and their effect on state (patch functions)
3. wire them up and grab the automatically generated reducer

# Complete examples

- [examples/todomvc](examples/todomvc)

# Code example

## 1. Type checked state

```js
// State.js

import { t } from 'redux-tcomb';

const Todo = t.struct({
  id: t.Number,         // a required number
  text: t.String,       // a required string
  completed: t.Boolean  // a required boolean
}, 'Todo'); // <= give the type a name for better error messages

export default t.list(Todo, 'State'); // the state is a list of `Todo`s
```

Type checked state means...

```js
import State from './State';

// try to mess up with the state
new State(1); // => will throw "[tcomb] Invalid value 1 supplied to State (expected an array of Todo)"
const state = new State([]): // => ok, state is immutable
```

# 2. Type checked actions

```js
// actions.js

import { t } from 'redux-tcomb';

// defines an object like { text: 'Build my first Redux app' }
export const ADD_TODO = t.struct({
  text: t.String
}, 'ADD_TODO');

// defines an object like { id: 1, text: 'Text is changed' }
export const EDIT_TODO = t.struct({
  id: t.Number,
  text: t.String
}, 'EDIT_TODO');

// no constants in the action definitions
// constants are defined as export names
```

Type checked actions means...

```js
const action = ADD_TODO({}); // => throws "[tcomb] Invalid value undefined supplied to ADD_TODO/text: String"
const action = ADD_TODO({ text: 'Build my first Redux app' }); // => ok, action is immutable
```

## 2.1 Define the **patch function** for each action

```js
// a patch is a function state -> state
ADD_TODO.prototype.patch = function (state) {

  // tcomb immutable helpers
  return t.update(state, { $push: [{
    id: getNextId(), // somehow retrieve the next todo id...
    text: this.text,
    completed: false
  }] });

};
```

Time to wire them up...

## 3. Automatically generated reducer

```js
import { createStore } from 'redux';
import State from './State';
import * as actions from './actions';
import { createUnion, createReducer } from 'redux-tcomb';

const initialState = State([]); // the initial state
const Action = createUnion(actions); // a type representing the union of all the actions
const reducer = createReducer(initialState, Action, State); // no need to implement the reducer
const store = createStore(reducer);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
});

store.getState(); // => { todos: [ { id: 0, text: 'Build my first Redux app', completed: false } ] }
```
