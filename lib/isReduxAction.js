var t = require('tcomb');

function isReduxAction(action) {
  return !t.Nil.is(action.type) && action.type.indexOf('@@') === 0;
}

module.exports = isReduxAction;
