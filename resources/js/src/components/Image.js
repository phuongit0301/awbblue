import React from 'react';

const Image = ({url, style, onClick}) => {
    return (
        <img src={url} onClick={() => onClick(url)} alt="images" style={style} />
    )
}
export default Image;