import 'babel-core/polyfill';

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import 'todomvc-app-css/index.css';
import createReducer from './createReducer';

const initialState = [{
  text: 'Use redux-tcomb',
  completed: false,
  id: 0
}];
const store = window.store = createStore(createReducer(initialState));

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./createReducer', () => {
    const nextCreateReducer = require('./createReducer');
    store.replaceReducer(nextCreateReducer(store.getState()));
  });
}

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root')
);
