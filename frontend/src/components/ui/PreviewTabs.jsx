import React, { useState, useEffect, use } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import EditButton from './EditButton.jsx';
import FicheClient from './FicheClient.jsx';
import '../../assets/style.css';
import '../../assets/previewtabs.css';

export default function PreviewTabs({ openedRowRef, quoteId, status }) {
  
  
  const [activeTab, setActiveTab] = useState(0);

  

  if (!openedRowRef) {
    return (
      <Box className="preview" >
        
        <FontAwesomeIcon icon={faEye} className="icone-preview" />
        
        <Box className="text-preview">
        
        <Typography className="text-preview-1" >Onglet de prévisualisation</Typography>

        <Typography className="text-preview-2">Sélectionnez une demande pour voir les informations</Typography>
        </Box>
      </Box>
    );
  }

  const handleTabChange = (e, v) => setActiveTab(v);

  return (
    <Box className = "preview-selected">
        <EditButton openedRowRef={openedRowRef}  quoteId={quoteId} status={status} />
         
       
        <FicheClient reference={openedRowRef} className="fiche-info"/>
    </Box>
  );
}