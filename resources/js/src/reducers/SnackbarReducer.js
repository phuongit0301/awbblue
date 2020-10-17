import {
    SNACKBAR_SUCCESS,
    SNACKBAR_CLEAR
} from "../private/constants";

const initialState = {
    message: '',
    showNotification: false
};

const snackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SNACKBAR_SUCCESS:
            return { 
                message: action.payload.message,
                showNotification: true, 
                loading: true 
        };
        case SNACKBAR_CLEAR: {
            return {
                message: '', // update signin array with reponse data
                loading: false, // set loading to false
                success: true,
                showNotification: false
            };
        }
        default:
            return state;
    }
};

export default snackbarReducer;
