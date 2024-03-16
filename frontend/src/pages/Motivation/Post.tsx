import React, { useRef, useEffect } from 'react';

// Images
import Blue1 from './Blue1.png';
import Blue2 from './Blue2.png';
import Blue3 from './Blue3.png';
import Blue4 from './Blue4.png';
import Blue5 from './Blue5.png';

interface ImageWithTextOverlayProps {
    variant: number | undefined;
}


const Post: React.FC<ImageWithTextOverlayProps> = ({ variant }) => {

    const getImageUrl = (variant: number | undefined) => {
        switch (variant) {
            case 1:
                return Blue1;
            case 2:
                return Blue2;
            case 3:
                return Blue3;
            case 4:
                return Blue4;
            case 5:
                return Blue5;
            default:
                return Blue1;
        }
    };


    return (
        <img src={getImageUrl(variant)} alt="Overlay" style={{
            display: 'block',
            maxWidth: '100%'
        }} />
    );
};

export default Post;
