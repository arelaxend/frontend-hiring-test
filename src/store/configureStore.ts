/* eslint-disable import/prefer-default-export */
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { reducers } from 'src/store';

import { enableES5 } from 'immer';
enableES5();

export function configureStore() {
  const middlewares = [thunkMiddleware];

  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  );

  return store;
}
