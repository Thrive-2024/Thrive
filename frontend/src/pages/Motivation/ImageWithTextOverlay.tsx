import React, { useRef, useEffect } from 'react';
import { Typography, styled } from '@mui/material';
import Post from './Post';

interface ImageWithTextOverlayProps {
  variant: number | undefined; 
  text: string | undefined;
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

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
    }}>
      <Post variant={variant} />
      <MessageText> {text} </MessageText>
    </div>
  );
};

export default ImageWithTextOverlay;
