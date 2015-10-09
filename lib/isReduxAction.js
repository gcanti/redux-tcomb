var t = require('tcomb');

function isReduxAction(action) {
  return !t.Nil.is(action.type) && ( action.type.indexOf('@@redux/') === 0 || action.type === '@@INIT');
}

module.exports = isReduxAction;
