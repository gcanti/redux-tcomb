import { t } from '../../.';

//
// actions
//

export const ADD_TODO = t.struct({
  text: t.String
}, 'ADD_TODO');

export const DELETE_TODO = t.struct({
  id: t.Number
}, 'DELETE_TODO');

export const EDIT_TODO = t.struct({
  id: t.Number,
  text: t.String
}, 'EDIT_TODO');

export const COMPLETE_TODO = t.struct({
  id: t.Number
}, 'COMPLETE_TODO');

export const COMPLETE_ALL = t.struct({
}, 'COMPLETE_ALL');

export const CLEAR_COMPLETED = t.struct({
}, 'CLEAR_COMPLETED');

//
// patch functions
//

ADD_TODO.prototype.patch = function (state) {
  return t.update(state, { $push: [{
    id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
    text: this.text,
    completed: false
  }] });
};

DELETE_TODO.prototype.patch = function (state) {
  return state.filter(todo =>
    todo.id !== this.id
  );
};

EDIT_TODO.prototype.patch = function (state) {
  return state.map(todo =>
    todo.id === this.id ?
      t.update(todo, { text: { $set: this.text } }) :
      todo
  );
};

COMPLETE_TODO.prototype.patch = function (state) {
  return state.map(todo =>
    todo.id === this.id ?
      t.update(todo, { completed: { $set: !todo.completed } }) :
      todo
  );
};

COMPLETE_ALL.prototype.patch = function (state) {
  const areAllMarked = state.every(todo => todo.completed);
  return state.map(todo => t.update(todo, { completed: { $set: !areAllMarked } }));
};

CLEAR_COMPLETED.prototype.patch = function (state) {
  return state.filter(todo => todo.completed === false);
};
