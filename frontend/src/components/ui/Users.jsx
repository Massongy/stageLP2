
import React from 'react';
import { Box } from '@mui/material';


export default function Users({ datausers = [] }) {
  if (!Array.isArray(datausers)) {
    console.error("`datausers` n’est pas un tableau :", datausers);
    return null;
  }
  return (
    <div>
      {datausers.map((user, i) => (
        <Box key={i} className="info-admin">
          <Box className="container-infos">
            <Box className="container-infos-1">Nom :</Box>
            <Box className="container-infos-2">{user.last_name}</Box>
          </Box>
          <Box className="container-infos">
            <Box className="container-infos-1">Prénom :</Box>
            <Box className="container-infos-2">{user.first_name}</Box>
          </Box>
          <Box className="container-infos">
            <Box className="container-infos-1">Email :</Box>
            <Box className="container-infos-2">{user.email}</Box>
          </Box>
        </Box>
      ))}
    </div>
  );
}
