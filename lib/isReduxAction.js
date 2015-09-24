var t = require('tcomb');

function isInitAction(action) {
  return action.type.indexOf('@@redux/') === 0;
}

// FIXME remove this when https://github.com/rackt/redux/issues/792 lends
function isCombineReducersRandomAction(action) {
  return action.type.split('.').length > 0 && action.type.toLowerCase() == action.type;
}

function isReduxAction(action) {
  return !t.Nil.is(action.type) && ( isInitAction(action) || isCombineReducersRandomAction(action) );
}

module.exports = isReduxAction;
