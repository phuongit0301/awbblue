import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {clearSnackbar} from '../actions/UploadAction';

const SuccessSnackbar = () => {
    
    const dispatch = useDispatch();
    const { showNotification } = useSelector(state => state.dataNotification);
    const dataNotification = useSelector(state => state.dataNotification);

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClose = () => {
        dispatch(clearSnackbar())
    }

    return (
        <Snackbar open={!!showNotification} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
                { dataNotification.message ? dataNotification.message : '' }
            </Alert>
        </Snackbar>
    )
}

export default SuccessSnackbar;