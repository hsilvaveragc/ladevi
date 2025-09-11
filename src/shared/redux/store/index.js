import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from '../rootReducer';
import rootSaga from '../rootSaga';

import { history } from './history';

// Determinar si estamos en entornos de debug
const isDebugEnvironment =
  import.meta.env.MODE === 'development' ||
  import.meta.env.MODE === 'staging' ||
  import.meta.env.MODE === 'test' ||
  import.meta.env.DEV;

// Solo importar redux-logger en entornos de debug
let logger = null;
if (isDebugEnvironment) {
  logger = (await import('redux-logger')).default;
}

// Configurar store
const configureStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  // Configurar middlewares base
  const middlewares = [routerMiddleware(history), sagaMiddleware];

  // Agregar logger solo en entornos de debug
  if (isDebugEnvironment && logger) {
    middlewares.push(logger);
  }

  // Configurar enhancers según el entorno
  let enhancer;

  if (isDebugEnvironment) {
    // Desarrollo/Staging/Test: incluir Redux DevTools si está disponible
    const composeEnhancers =
      (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;

    enhancer = composeEnhancers(applyMiddleware(...middlewares));
  } else {
    // Producción: solo middlewares básicos
    enhancer = applyMiddleware(...middlewares);
  }

  // Crear store
  const store = createStore(createRootReducer(history), initialState, enhancer);

  // Iniciar sagas
  sagaMiddleware.run(rootSaga);

  // Hot reload en entornos de debug (Vite HMR)
  if (isDebugEnvironment && import.meta.hot) {
    import.meta.hot.accept('../rootReducer', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  return store;
};

// Crear y exportar el store configurado
const store = configureStore();

export default store;
