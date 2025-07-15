
import React from 'react';
import { Box, Button } from '@mui/material';


export default function Users({ datausers = [], handleEdit, handleDelete }) {

   
  if (!Array.isArray(datausers)) {
    console.error("`datausers` n’est pas un tableau :", datausers);
    return null;
  }
  return (
    /* en attente pour filtrer les utilisateurs actif d'un champ de retour actif= true or false */
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
          <Box className="container-infos">
            <Box className="container-infos-1">Groupe :</Box>
            <Box className="container-infos-2">{user.groups}</Box>
          </Box>
          <Box className="container-infos">
            <Box className="container-infos-1">Mot de passe</Box>
            <Box className="container-infos-2">Changer le mot de passe</Box>
          </Box>
          <Button onClick={() => handleEdit(user)}>✏️</Button>{' '}
                  <Button onClick={() => handleDelete(user.id)}>🗑️</Button>
        </Box>
      ))}
    </div>
  );
}
