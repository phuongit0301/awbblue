import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import CloseIcon from "@material-ui/icons/Close";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Input } from "@material-ui/core";

import Camera, { IMAGE_TYPES, FACING_MODES } from 'react-html5-camera-photo';

import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { handleSaveAwb, setHideModal } from '../actions/UploadAction';
import 'react-html5-camera-photo/build/css/index.css';
import './ModalUpload.scss';

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: "absolute",
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: "25ch",
	},
	input: {
		display: "none",
	},
	waitingArea: {
		marginRight: "20px"
	}
}));

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);

const ModalUpoad = ({ showModal }) => {
	const classes = useStyles();
	const fileObj = [];
    const fileArray = [];
    const fileUploadArray = [];

	const [images, setImages] = useState([]);
	const [filesUpload, setFilesUpload] = useState([]);
	const [disabledButton, setDisabledButton] = useState(true);
	const [facingMode, setFacingMode] = useState(FACING_MODES.ENVIRONMENT);
	const [isValidateAwb, setValidateAwb] = useState(true);
	const [isValidateImagesNumber, setValidateImagesNumber] = useState(true);
	const [formUpload, setFormUpload] = useState({
		agent: 'Agent',
		awb: '',
		weight: '', 
		total_piece: ''
	});

	const dataAwb = useSelector(state => state.dataAwb);

	const { agent, awb, weight, total_piece } = formUpload;

	const validateForm = () => {
		setDisabledButton(true);
		if(agent !== '' && awb !== '' && isValidateAwb && weight !== '' && total_piece !== '' && images.length > 0 && isValidateImagesNumber) {
			setDisabledButton(false);
		}
	}

	useEffect(() => {
		validateForm();	
	}, [formUpload, images]);

	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();

	const handleClose = (e) => {
		e.preventDefault();
		dispatch(setHideModal());
	};

	const handleUploadClick = (event) => {
		fileObj.push(event.target.files);
		fileUploadArray.push(event.target.files[0]);

		for(let i = 0; i < fileObj[0].length; i++) {
			fileArray.push(URL.createObjectURL(fileObj[0][i]))
		}
		const arrImages = [...images, ...fileArray];
		setImages(arrImages);
		setFilesUpload([...filesUpload, ...fileUploadArray]);

		setValidateImagesNumber(false);
		if(arrImages.length > 0 && arrImages.length <= Number(process.env.IMAGES_NUMBER_UPLOAD)) {
			setValidateImagesNumber(true);
		}
	};

	const handleTakePhoto = (dataUri) => {
		// Do stuff with the photo...
		// Split the base64 string in data and contentType
		var block = dataUri.split(";");
		// Get the content type
		var contentType = block[0].split(":")[1];// In this case "image/gif"
		// get the real base64 content of the file
		var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."
		// Convert to blob
		var blob = b64toBlob(realData, contentType);
		
		fileArray.push(dataUri);
		fileUploadArray.push(blob);

		const arrImages = [...images, ...fileArray];
		setImages(arrImages);
		setFilesUpload([...filesUpload, ...fileUploadArray]);

		setValidateImagesNumber(false);
		if(arrImages.length > 0 && arrImages.length <= Number(process.env.IMAGES_NUMBER_UPLOAD)) {
			setValidateImagesNumber(true);
		}
	}

	const removeImage = (index) => {
		images.splice(index, 1);
		setImages([...images]);

		filesUpload.splice(index, 1);
		setFilesUpload([...filesUpload]);
	}

	const b64toBlob = (b64Data, contentType, sliceSize) => {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

	  var blob = new Blob(byteArrays, {type: contentType});
	  return blob;
	}

	const handleSave = (event) => {
		event.preventDefault();

		const formData = new FormData();
		
		for (let key in formUpload) {
			formData.append(key, formUpload[key]);
		}
		filesUpload.forEach(item => {
			formData.append('image[]', item);
		});

		dispatch(handleSaveAwb(formData));
	}

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormUpload(inputs => ({ ...inputs, [name]: value }));
		
		if(name === 'awb') {
			const isValid = validateAwbNumber(value);
			setValidateAwb(isValid);
		}
    }

	const validateAwbNumber = (num) => {
		const validateAwb = /^[0-9]{3}\-[0-9]{8}$/g;
		return !!num.match(validateAwb);
	} 

	const handleSwitchCamera = (e) => {
		e.preventDefault();
		const changeMode = (facingMode === FACING_MODES.ENVIRONMENT) ? FACING_MODES.USER : FACING_MODES.ENVIRONMENT;
		setFacingMode(changeMode);
	}
	
	return (
		<div>
			<Dialog
				fullWidth={true}
				disableBackdropClick={true}
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={showModal}
				maxWidth={"md"}
			>
				<DialogTitle id="customized-dialog-title" onClose={handleClose}>
					Upload AWB
				</DialogTitle>
				<DialogContent dividers>
					<form
						className={classes.container}
						noValidate
						autoComplete="off"
						encType="multipart/form-data"
					>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<TextField label="Required" id="userInput" label="Người Nhập" name="agent" value={agent} onChange={handleChange} />
						</FormControl>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<TextField label="Required" id="awb" label="Awb" name="awb" value={awb} onChange={handleChange} helperText="Format xxx-xxxxxxxx" error={!isValidateAwb} />
						</FormControl>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<TextField label="Required" id="weight" label="Số Cân" name="weight" value={weight} onChange={handleChange} />
						</FormControl>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<TextField label="Required" id="total_piece" label="Số Kiện" name="total_piece" value={total_piece} onChange={handleChange} />
						</FormControl>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<Camera
								imageType = {IMAGE_TYPES.JPG}
								idealFacingMode = {facingMode}
								onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
								isImageMirror={false}
							/>
							<button className="btn-renew" onClick={handleSwitchCamera}>
								<IconButton color="primary" component="span">
									<AutorenewIcon />
								</IconButton>
							</button>
						</FormControl>
						<FormControl
							fullWidth
							className={classes.margin}
							variant="outlined"
						>
							<input
								accept="image/*"
								className={classes.input}
								id="icon-button-photo"
								type="file"
								onChange={handleUploadClick}
								multiple
							/>
							<label htmlFor="icon-button-photo">
								<IconButton color="primary" component="span">
									<AddPhotoAlternateIcon />
								</IconButton>
							</label>
							<div className="image-list-area">
								{(images.length > 0) && images.map((url, index) => (
									<div className="image-area" key={`image-${index}`}>
										<IconButton
											aria-label="close"
											className={classes.closeButton}
											onClick={() => removeImage(index)}
										>
											<CloseIcon />
										</IconButton>
			                        	<img src={url} alt="image" />
									</div>
			                    ))}
							</div>
						</FormControl>
					</form>
				</DialogContent>
				<DialogActions>
					<Button disabled={disabledButton || dataAwb.isSubmit} autoFocus onClick={handleSave} color="primary">
						{
							dataAwb.isSubmit && <CircularProgress size={20} classes={{ root: classes.waitingArea }} />
						}
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ModalUpoad;