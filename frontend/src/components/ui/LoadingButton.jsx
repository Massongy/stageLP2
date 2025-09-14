import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const LoadingButton = ({ isLoading, onClick, children, ...props }) => {
  return (
    <Button
      {...props}
      onClick={onClick}
      disabled={isLoading || props.disabled}
      variant="contained"
      
    >
      {isLoading ? (
        <>
          <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} />
          <span style={{ visibility: 'hidden' }}>{children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
