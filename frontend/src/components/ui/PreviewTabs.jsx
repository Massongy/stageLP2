import React, { useState, useEffect, use } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import EditButton from './EditButton.jsx';
import FicheClient from './FicheClient.jsx';
import '../../assets/style.css';
import '../../assets/previewtabs.css';

export default function PreviewTabs({ openedRowRef, quoteId }) {
  
  
  const [activeTab, setActiveTab] = useState(0);

  

  if (!openedRowRef) {
    return (
      <Box className="preview" >
        
        <FontAwesomeIcon icon={faEye} className="icone-preview" />
        
        <Typography className="text-preview">Onglet de prévisualisation<br></br>
        Sélectionnez une demande pour voir les informations</Typography>
        
      </Box>
    );
  }

  const handleTabChange = (e, v) => setActiveTab(v);

  return (
    <Box className = "preview-selected">
        <EditButton openedRowRef={openedRowRef}  quoteId={quoteId} />
         
       
        <FicheClient reference={openedRowRef} className="fiche-info"/>
    </Box>
  );
}