import React, { useRef, useEffect } from 'react';
import { Typography, styled } from '@mui/material';

// Images
import Blue1 from './Blue1.png';
import Blue2 from './Blue2.png';
import Blue3 from './Blue3.png';
import Blue4 from './Blue4.png';
import Blue5 from './Blue5.png';

interface ImageWithTextOverlayProps {
  variant: number;
  text: string;
}

const MessageText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '32%',
  left: '15%',
  maxWidth: '65%',
  margin: '10px',
  color: theme.palette.text.secondary,
  background: '#f3f4f6',
  borderRadius: 10,
  padding: '5px',
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));


const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ variant, text }) => {

  const getImageUrl = (variant: number) => {
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
    <div style={{
      position: 'relative',
      display: 'inline-block',
    }}>
      <img src={getImageUrl(variant)} alt="Overlay" style={{
        display: 'block',
        maxWidth: '100%'
      }} />
      <MessageText> {text} </MessageText>
    </div>
  );
};

export default ImageWithTextOverlay;
