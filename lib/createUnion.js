var t = require('tcomb');

var Type = t.irreducible('Type', t.isType);
var ActionDictionary = t.dict(t.String, Type);
var ActionStruct = t.subtype(t.Object, function (x) {
  return t.String.is(x.type);
});
var Name = t.maybe(t.String);

function values(actions) {
  return Object.keys(actions).map(function (type) {
    return actions[type];
  });
}

function createUnion(actions, name) {

  if (process.env.NODE_ENV !== 'production') {
    t.assert(ActionDictionary.is(actions), function () { return 'Invalid argument action ' + t.stringify(actions) + ' supplied to createUnion(actions, name) function (expected a dictionary String -> Type)'; });
    t.assert(Name.is(name), function () { return 'Invalid argument name ' + t.stringify(name) + ' supplied to createUnion(actions, name) function (expected a string)'; });
  }

  name = name || 'Action';

  var Action = t.union(values(actions), name);

  Action.dispatch = function (action) {
    if (process.env.NODE_ENV !== 'production') {
      t.assert(ActionStruct.is(action), function () { return 'Invalid action ' + t.stringify(action) + ' (expected an object with a type property)'; });
    }
    return actions[action.type] || t.fail('Unknown action type ' + action.type + ' for union ' + name);
  };

  return Action;
}

module.exports = createUnion;