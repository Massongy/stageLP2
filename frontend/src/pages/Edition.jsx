import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Importation de DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams } from 'react-router-dom';
import BlocInfo from '../components/ui/Blocinfo.jsx';
import Editionquestionsreponses from '../components/ui/editionquestionsreponses.jsx';
export default function Edition() {
const { clientId } = useParams();

  const userData = [
    { cle: 'Référence', valeurs: [clientId] },
    { cle: 'Email', valeurs: ['johndoe@example.com'] },
    { cle: 'Statut', valeurs: ['Actif'] },
    { cle: 'Nom et prénom', valeurs: ['John', 'Smith'] },
    { cle: 'Numéro de téléphone', valeurs: ['******'] },
    { cle: 'Semaine N°', valeurs: ['1'] },
    // Remplacer les dates avec des valeurs null ou les dates actuelles
    { cle: 'Date du 1er appel', valeurs: ['12/12/2024'] },
    { cle: 'Date du dernier appel', valeurs: ['12/12/2024'] },
    { cle: 'Nombre d\'appels', valeurs: ['2'] },
  ];

  return (
    <>
      <Box>
        {`l'id de client à éditer est : ${clientId}`}
      </Box>

      <Box>
        <BlocInfo data={userData} />
      </Box>

      <Box sx={{ width: '1920px', margin: '0 auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Editionquestionsreponses />
      </Box>

      
            
          
        
      
    </>
  );
}
