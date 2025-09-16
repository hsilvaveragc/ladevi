import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import logger from 'redux-logger';

import createRootReducer from '../rootReducer';
import rootSaga from '../rootSaga';

import { history } from './history';

export default (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(routerMiddleware(history), sagaMiddleware, logger)
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
