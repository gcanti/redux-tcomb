import State from './State';
import * as actions from './actions';
import { createUnion, createReducer } from '../../.';

const Action = createUnion(actions);

export default function (initialState) {
  return createReducer(State(initialState), Action, State);
}
