var t = require('tcomb');

function isValidAction(action) {
  return !t.Nil.is(action.type) && action.type.indexOf('@@') !== 0;
}

module.exports = isValidAction;
