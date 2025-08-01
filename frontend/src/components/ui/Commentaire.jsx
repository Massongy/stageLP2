
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';
import '../../assets/style.css';
import '../../assets/commentaire.css';

export default function Commentaire({value, onChange, editable = true}) {
  return (
    <Box className="bloc-titre-champ champ-commentaire">
        <Typography className="titre3">
          Commentaire :
        </Typography>
      
        {editable ? (
          <TextField  
            className="texte2 champ champ-commentaire" 
            multiline 
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Écrivez votre commentaire ici..."
          

          />
        ) : (
          <TextField className="texte2 champ champ-commentaire"
             value={value || ""}>
         </TextField>
        )}
    </Box>
  )
}