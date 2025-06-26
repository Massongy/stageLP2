import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import  '../../assets/preview.css'

import FicheClient from './ficheclient.jsx'; 

export default function PreviewTabs({ openedRowId }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!openedRowId) {
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
        <Button component={Link}
          to={`/edition/${openedRowId}`}
          variant="contained"
          className="bouton-editer"
          > éditer</Button>
        {/*ici il faut récupérer les infos du client et les passer dans les props de FicheClient */}
        <FicheClient reference={openedRowId} className="fiche-info"/>
    </Box>
  );
}