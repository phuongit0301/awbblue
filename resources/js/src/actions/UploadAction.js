import {
    SAVE_REQUESTING,
    LIST_AWB_REQUESTING,
    SNACKBAR_SUCCESS,
    SNACKBAR_CLEAR,
    SHOW_MODAL,
    HIDE_MODAL,
    SUBMIT_SUCCESS
  } from '../private/constants';
  
export const handleSaveAwb = (data) => {
    return { 
        type: SAVE_REQUESTING, 
        payload: data
    };
}

export const getAwb = (params=null) => {
    let pagination = {page: 0, rowsPerPage: 5};
    pagination = params ? { ...pagination, ...params } : pagination;
    
    return {
        type: LIST_AWB_REQUESTING,
        pagination
    }
}

export const previewImage = (path) => {
    return {
        type: PREVIEW_IMAGE,
        path
    }
}

export const showSuccessSnackbar = message => {
    return { type: SNACKBAR_SUCCESS, payload: { message } };
};

export const clearSnackbar = () => {
    return { type: SNACKBAR_CLEAR };
};


export const setShowModal = () => {
    return { type: SHOW_MODAL };
}

export const setHideModal = () => {
    return { type: HIDE_MODAL };
}

export const setSubmitSuccess = () => {
    return { type: SUBMIT_SUCCESS };
}