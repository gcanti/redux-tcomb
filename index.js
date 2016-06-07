/*! @preserve
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Giulio Canti
 *
 */

module.exports = {
  t: require('tcomb'),
  createCheckedMiddleware: require('./lib/createCheckedMiddleware'),
  createCheckedReducer: require('./lib/createCheckedReducer'),
  createActionType: require('./lib/createActionType')
};
