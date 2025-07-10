
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';
import '../../assets/Theme.css';
import '../../assets/Commentaire.css';

export default function Commentaire({commentaire}) {


return (
<Box className="">
          <Box className="titre3">
            Commentaire :
          </Box>
          <Box className="texte2 champ">
            <Typography className=""> {commentaire}
          </Typography>
          </Box>
        </Box>
        )
}