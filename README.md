Immutable and type-checked state and actions for Redux (built on [tcomb](https://github.com/gcanti/tcomb) library)

# Why?

In my experience type checking dramatically speeds up development and provides a nice DX.

## Primary goals

- actions are naked (*), immutables and type checked
- state is naked (*), immutable and type checked

(*) work like regular objects and arrays

## Secondary goals

- get rid of constants
- get rid of `switch`

# Is this slow?

Nope. `Object.freeze` calls and the asserts are executed only in development and stripped out in production (using `process.env.NODE_ENV = 'production'` tests).

# Workflow

1. define the state structure
2. define the actions (and optionally their effect on state)
3. wire them up and grab the automatically generated reducer (opt-in, **you can use a "standard" reducer**, see later)

# Complete examples

- [examples/todomvc](examples/todomvc) (automatically generated reducer)
- [examples/async](examples/async) (type checking with a standard redux reducer)

# Code example

## 1. Type-checked state

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

Type-checked state means...

```js
import State from './State';

// try to mess up with the state
new State(1); // => will throw "Invalid value 1 supplied to State (expected an array of Todo)"
const state = new State([]): // => ok, state is immutable
```

# 2. Type-checked actions

```js
// actions.js

import { t } from 'redux-tcomb';

// defines an object like { text: 'Use redux-tcomb' }
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

Type-checked actions means...

```js
const action = ADD_TODO({}); // => throws "Invalid value undefined supplied to ADD_TODO/text: String"
const action = ADD_TODO({ text: 'Use redux-tcomb' }); // => ok, action is immutable
```

Time to wire them up...

# 3. The reducer

You have 2 options:

- get type safety with a "standard" reducer
- automatically generate the reducer

## Standard reducer

```js
import State from './State';
import * as actions from './actions';
import { createUnion, getCheckedReducer } from 'redux-tcomb';
import standardReducer from './your-standard-reducer';

const Action = createUnion(actions);

// getCheckedReducer returns a type safe version of your reducer
export default getCheckedReducer(standardReducer, State, Action);
```

## The automatically generated reducer

First you need to define a **patch function** for each action:

```js

// a patch is a function (state) => state
// that represents the effect of the action on the state

ADD_TODO.prototype.patch = function (state) {

  // tcomb immutable helpers
  return t.update(state, { $push: [{
    id: getNextId(), // somehow retrieve the next todo id...
    text: this.text,
    completed: false
  }] });

};
```

Then you get the automatically generated reducer form the `createReducer` API:

```js
import { createStore } from 'redux';
import State from './State';
import * as actions from './actions';
import { createUnion, createReducer } from 'redux-tcomb';

const initialState = State([]); // the initial state
const Action = createUnion(actions); // a type representing the union of all the actions

// here we are, no need to implement the reducer
const reducer = createReducer(initialState, Action, State);

const store = createStore(reducer);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use redux-tcomb'
});

store.getState(); // => { todos: [ { id: 0, text: 'Use redux-tcomb', completed: false } ] }
```

# License

The MIT License (MIT)
