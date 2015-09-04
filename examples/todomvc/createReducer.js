import State from './State';
import * as actions from './actions';
import { createUnion, createReducer } from 'redux-tcomb';

export default function (initialState) {
  const Action = createUnion(actions);
  return createReducer(State(initialState), Action, State);
}
