import React, { useRef, useEffect } from 'react';
import { Typography, styled } from '@mui/material';


interface ImageWithTextOverlayProps {
  imageUrl: string;
  text: string;
}

const MessageText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '35%',
  left: '15%',
  maxWidth: '65%',
  margin: 10,
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({ imageUrl, text }) => {

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
    }}>
      <img src={imageUrl} alt="Overlay" style={{
        display: 'block',
        maxWidth: '100%'
      }} />
        <MessageText> {text} </MessageText>
    </div>
  );
};

export default ImageWithTextOverlay;
