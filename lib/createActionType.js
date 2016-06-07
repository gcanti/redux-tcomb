var t = require('tcomb');

function createActionType(actions) {
  var dispatcher = {};
  var types = [];
  var actionCreators = {};
  Object.keys(actions).forEach(function (type) {
    types.push(dispatcher[type] = t.interface.extend([actions[type], { type: t.enums.of(type) }], type));
    actionCreators[type] = function (x) {
      return t.mixin({ type: type }, x);
    };
  });
  var Action = t.union(types, 'Action');
  Action.dispatch = function (x) {
    return dispatcher[x.type];
  };
  t.mixin(Action, actionCreators);
  return Action;
}

module.exports = createActionType;