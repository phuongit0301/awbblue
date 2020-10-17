import {
    SAVE_REQUESTING,
    SAVE_SUCCESS,
    SAVE_FAILURE,
    LIST_AWB_REQUESTING,
    LIST_AWB_SUCCESS,
    LIST_AWB_FAILURE,
    SHOW_MODAL,
    HIDE_MODAL,
    SUBMIT_SUCCESS
} from "../private/constants";

const initialState = {
    message: "",
    data: null,
    loading: false,
    rowsPerPage: 5,
    page: 0,
    totalPages: 1,
    showModal: false,
    isSubmit: false
};

const awbReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_REQUESTING:
            return { 
                ...state,
                ...action.payload, 
                isSubmit: true 
        };
        case SAVE_SUCCESS: {
            return {
                ...state,
                ...action.payload, // update signin array with reponse data
                success: true
            };
        }
        case SAVE_FAILURE:
            return {
                ...state,
                ...action.payload, // update signin array with reponse data
                success: false,
                isSubmit: false, 
                showModal: false
            };
        case SUBMIT_SUCCESS:
            return {
                ...state,
                isSubmit: false, // set loading to false
            }
        case LIST_AWB_REQUESTING:
            return {
                ...state,
                ...action.pagination,
                loading: true
            }
        case LIST_AWB_SUCCESS:
            return { ...state, ...action.payload, loading: false, success: true }
        case LIST_AWB_FAILURE:
                return { ...state, ...action.payload, loading: false, success: false, isSubmit: false, showModal: false }
        case SHOW_MODAL:
            return { ...state, showModal: true }
        case HIDE_MODAL:
            return { ...state, isSubmit: false, showModal: false }
        case "persist/PERSIST":
            return { ...state, page: initialState.page, loading: true, isSubmit: false, showModal: false }
        default:
            return state;
    }
};

export default awbReducer;
