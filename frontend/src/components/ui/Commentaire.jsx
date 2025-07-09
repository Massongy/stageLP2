
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';
import '../../assets/Theme.css';
import '../../assets/Commentaire.css';

export default function Commentaire({value, onChange}) {


return (
<Box className="">
          <Box className="titre3">
            Commentaire :
          </Box>
        
            <TextField className="texte2 champ" multiline value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Écrivez votre commentaire ici..." >
          </TextField>
          
        </Box>
        )
}