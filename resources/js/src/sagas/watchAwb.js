import { call, put, takeEvery, select, delay } from 'redux-saga/effects';
import axios from 'axios';

import { 
    SAVE_REQUESTING, 
    SAVE_SUCCESS,
    SAVE_FAILURE,
    LIST_AWB_REQUESTING,
    LIST_AWB_SUCCESS,
    LIST_AWB_FAILURE
} from '../private/constants';

import { AWB_URL, IMAGE_URL } from '../private/api';

import { showSuccessSnackbar, setHideModal, getAwb, setSubmitSuccess } from '../actions/UploadAction';

async function fetchData(url, body) {
    try {
        return await axios.post(url, body);
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}

async function fetchListData(url, pagination) {
    try {
        return await axios.get(url, {
            params: {...pagination}
        });
    } catch (error) {
        return { 
            success: false,
            message: error,
        };
    }
}

export function* awbFlow({ payload }) {
    if(!payload) {
        yield put({ type: SAVE_FAILURE, payload: { messages: "data not formatted as expected" }, success: false });
        return false;
    }
    try {
        const resp = yield call(fetchData, AWB_URL, payload);

        if(resp && resp.status == 200) {
            //set data authenticate to local storage
            yield put({ type: SAVE_SUCCESS, payload: { ...resp.data } });
            yield delay(1500);
            yield put(showSuccessSnackbar(resp.data.message));

            if(resp.data.success) {
                yield delay(3000);
                yield put(setHideModal());
                yield put(getAwb());
            }
            yield delay(500);
            yield put(setSubmitSuccess());
        } else {
            yield put({ type: SAVE_FAILURE, payload: { ...resp.data } });
            yield delay(1500);
            yield put(showSuccessSnackbar(resp.data.message));
        }
    } catch(error) {
        yield put({ type: SAVE_FAILURE, payload: error, success: false });
    }
}

export function* awbListFlow({pagination}) {
    try {
        const resp = yield call(fetchListData, AWB_URL, pagination);

        if(resp && resp.status == 200) {
            //set data authenticate to local storage
            yield put({ type: LIST_AWB_SUCCESS, payload: { ...resp.data } });
        } else {
            yield put({ type: LIST_AWB_FAILURE, payload: { ...resp.data } });
        }
    } catch(error) {
        yield put({ type: LIST_AWB_FAILURE, payload: error, success: false });
    }
}

export function* watchAwb() {
  yield takeEvery(SAVE_REQUESTING, awbFlow);
  yield takeEvery(LIST_AWB_REQUESTING, awbListFlow);
}