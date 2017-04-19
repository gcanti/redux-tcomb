var t = require('tcomb');

function createActionType(actions) {
  var dispatcher = {};
  var types = [];
  var actionCreators = {};
  var actionTypes = Object.keys(actions);
  if (actionTypes.length === 0) {
    throw new Error('createActionType requires at least one action defined.');
  }
  actionTypes.forEach(function (type) {
    types.push(dispatcher[type] = t.interface.extend([actions[type], { type: t.enums.of(type) }], type));
    actionCreators[type] = function (x) {
      return t.mixin({ type: type }, x);
    };
  });
  var Action = types.length === 1 ? types[0] : t.union(types, 'Action');
  Action.dispatch = function (x) {
    return dispatcher[x.type];
  };
  Action.creators = actionCreators;
  t.mixin(Action, actionCreators);
  return Action;
}

module.exports = createActionType;
