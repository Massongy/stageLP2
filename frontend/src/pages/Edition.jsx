// src/pages/Dashboard.jsx
import { useParams } from 'react-router-dom';
import React from 'react';
import { Box } from '@mui/material';

export default function Edition() {

 const { clientId } = useParams();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
            {`l'id de client à éditer est : ${clientId}`}    </Box>
  );
}