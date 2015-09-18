/*! @preserve
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Giulio Canti
 *
 */

module.exports = {
  t: require('tcomb'),
  createUnion: require('./lib/createUnion'),
  createReducer: require('./lib/createReducer'),
  getCheckedReducer: require('./lib/getCheckedReducer')
};
