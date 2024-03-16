import React, { useRef, useEffect } from 'react';
import { Typography, styled, Box } from '@mui/material';
import Post from './Post';

interface ImageWithTextOverlayProps {
  variant: number | undefined;
  text: string | undefined;
}

const MessageText = styled(Typography)(({ theme }) => ({
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
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}>
        <MessageText> {text} </MessageText>
      </Box>
    </div>
  );
};

export default ImageWithTextOverlay;
