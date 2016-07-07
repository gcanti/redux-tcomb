[![build status](https://img.shields.io/travis/gcanti/redux-tcomb/master.svg?style=flat-square)](https://travis-ci.org/gcanti/redux-tcomb)

Immutable and type-checked state and actions for Redux (built on [tcomb](https://github.com/gcanti/tcomb) library)

# Example

```js
import { createStore, applyMiddleware } from 'redux'
import t from 'tcomb'
import { createCheckedMiddleware, createCheckedReducer, createActionType } from 'redux-tcomb'
import createLogger from 'redux-logger'

// types
const State = t.Integer
const PositiveInteger = t.refinement(t.Integer, n => n >= 0, 'PositiveInteger')
const Action = createActionType({
  INCREMENT: t.interface({ delta: PositiveInteger }),
  DECREMENT: t.interface({ delta: PositiveInteger })
})

// reducer
function reducer(state = 0, action) {
  switch(action.type) {
    case 'INCREMENT' :
      return state + action.delta
    case 'DECREMENT' :
      return state - action.delta
  }
  return state
}

// configure
const store = createStore(
  createCheckedReducer(reducer, State),
  applyMiddleware(
    createCheckedMiddleware(Action),
    createLogger()
  )
)

// ok
store.dispatch({ type: 'INCREMENT', delta: 2 })
store.dispatch(Action.INCREMENT({ delta: 2 }))

// bad payload
store.dispatch({ type: 'INCREMENT', delta: -2 }) // throws [tcomb] Invalid value -2 supplied to Action(INCREMENT)/delta: PositiveInteger

// typo
store.dispatch({ type: 'INCRE', delta: 1 }) // throws [tcomb] Invalid value { "type": "INCRE", "delta": 1 } supplied to Action
```

# API

## `createCheckedMiddleware(Action: Type) -> Function`

## `createCheckedReducer(reducer: Function, State: Type) -> Function`

## `createActionType(actions: {[key: string]: Type}) -> Type`

# License

The MIT License (MIT)
