import React, { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';
import { TablePagination } from '@material-ui/core';

import './Home.scss';
import ModalUpload from "./ModalUpload";
import ModalImage from "./ModalImage";
import { getAwb, setShowModal } from '../actions/UploadAction';
import Image from './Image';

const Home = props => {
	const dispatch = useDispatch();
	const dataAwb = useSelector(state => state.dataAwb);
	const { showModal } = useSelector(state => state.dataAwb);
	const [stateImage, setImageState] = useState({
		url: null,
		showImageModal: false
	})

	const previewImage = (url) => {
		setImageState({ url, showImageModal: true });
	}

	const handleClose = () => {
		setImageState({ url: null, showImageModal: false });
	}

    const [state, setState] = useState({
        columns: [
            { title: "Người Nhập", field: "agent" },
            { title: "Awb", field: "awb" },
            { title: "Số Cân", field: "weight", type: "numeric" },
            { title: "Số Kiện", field: "total_piece", type: "numeric" },
            { 
				title: "Hình Ảnh", 
				field: "image_link",
				render: rowData => {
					if(rowData.image_link) {
						const images = JSON.parse(rowData.image_link);
						return images.map((item, index) => <Image key={`image-${index}`} url={`${item.image}`} onClick={previewImage} style={{ height: 50 }} />)
					}
				},
			},
        ]
	});
	
	const handlePagination = (obj) => {
		dispatch(getAwb(obj));
	}

    return (
		dataAwb.loading ?
			<div className="loadingContainer">
				<CircularProgress />
			</div>
		:
        <React.Fragment>
            <MaterialTable
                title="List AWB"
                columns={state.columns}
				data={dataAwb.data ? dataAwb.data : []}
                actions={[
                    {
                        icon: "add",
                        tooltip: "Add Awb",
                        isFreeAction: true,
                        onClick: event => dispatch(setShowModal())
                    }
				]}
				components={{
					Pagination: props => (
						<TablePagination
							{...props}
							page={Number(dataAwb.page)}
							count={Number(dataAwb.total)}
							rowsPerPage={Number(dataAwb.rowsPerPage)}  
							rowsPerPageOptions={[5, 10, 20, 50, 100]}
							onChangePage={(event, page) => handlePagination({page}) }
							onChangeRowsPerPage={event => handlePagination({rowsPerPage: event.target.value}) }
						/>
					)
				}}
				options={{
					pageSize: Number(dataAwb.rowsPerPage)
				}}
            />

            { showModal && <ModalUpload showModal={showModal} /> }
            { stateImage.showImageModal && <ModalImage open={stateImage.showImageModal} url={stateImage.url} handleClose={handleClose}  /> }
        </React.Fragment>
    );
};

export default Home;
