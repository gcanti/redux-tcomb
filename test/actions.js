var t = require('../.').t;

//
// actions
//

var ADD_TODO = t.struct({
  text: t.String
}, 'ADD_TODO');

var EDIT_TODO = t.struct({
  id: t.Number,
  text: t.String
}, 'EDIT_TODO');

//
// patch functions
//

ADD_TODO.prototype.patch = function (state) {
  return t.update(state, {
    todos: { $push: [{id: 1 , text: this.text, completed: false}]  }
  });
};

EDIT_TODO.prototype.patch = function () {
  return {};
};

module.exports = {
  ADD_TODO: ADD_TODO,
  EDIT_TODO: EDIT_TODO
};