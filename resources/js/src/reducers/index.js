import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer } from 'redux-persist';

import awbReducer from './AwbReducer';
import snackbarReducer from './SnackbarReducer';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
};

const rootReducer = combineReducers({
  dataAwb: awbReducer,
  dataNotification: snackbarReducer
});

export default persistReducer(rootPersistConfig, rootReducer);
