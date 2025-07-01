import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';

export default function InfoCompte ({nom, prenom, email, motdepasse}) {

    return (
<Box className="info-admin">
              <Box className="container-infos">
                <Box className="container-infos-1">Nom et prénom : </Box>
                <Box className="container-infos-2"> {nom} {prenom}</Box>
              </Box>
            
              <Box className="container-infos">
                <Box className="container-infos-1">Email : </Box>
                <Box className="container-infos-2">{email} </Box>
              </Box>

              <Box className="container-infos">
                <Box className="container-infos-1"> Mot de passe </Box>
                <Box className="container-infos-2">{motdepasse} </Box>
              </Box>
            
          </Box>
    );


}


