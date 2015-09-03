var t  = require('tcomb');

function createUnion(actions, name) {
  var Action = t.union(Object.keys(actions).map(function (type) {
    return actions[type];
  }), name || 'Action');

  Action.dispatch = function (action) {
    return actions[action.type];
  };

  return Action;
}

module.exports = createUnion;