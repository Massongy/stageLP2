import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import '../../assets/infodemande.css';



export default function InfoDemande({ question, reponses }) {
  return (
    <Box className="info-demande">
      <Box className="container-demande">
        <Box className="container-demande-1">{question} </Box>
        <Box className="container-demande-2">
          {reponses.map((reponse, index) => (
            <Box key={index} className="reponse-option">
              {reponse}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}



