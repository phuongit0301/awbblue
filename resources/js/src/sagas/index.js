import { all, fork } from 'redux-saga/effects';

import { watchAwb } from './watchAwb';

export default function* rootSaga() {
  yield all([
    fork(watchAwb),
  ]);
}