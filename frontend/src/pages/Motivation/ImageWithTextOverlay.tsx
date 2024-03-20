import React, { useRef, useEffect } from 'react';
import { Typography, styled, Box } from '@mui/material';
import Post from './Post';

interface ImageWithTextOverlayProps {
  variant: number | undefined;
  text: string | undefined;
}

const MessageText = styled(Typography)(({ theme }) => ({
  maxWidth: '65%',
  color: theme.palette.text.secondary,
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
        <Box sx={{
          backgroundImage:'radial-gradient(circle at center, rgba(141, 190, 225, 0.8) 0%, rgba(141, 190, 225, 0.2) 90%)',
          width: '60%',
          height: '60%',
          display: 'flex',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <MessageText> {text} </MessageText>

        </Box>
      </Box>
    </div>
  );
};

export default ImageWithTextOverlay;
