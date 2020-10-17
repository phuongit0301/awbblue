// Wherever you build your reducers
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import persistReducer from '../reducers';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}

const enhancers = [applyMiddleware(...middleware)];

export const store = createStore(persistReducer, undefined, compose(...enhancers));
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);