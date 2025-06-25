import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';

export default function FicheClient({
  reference,
 
}) {
  return (
    <Card className="fiche-info" >
      <CardHeader className="fiche-info-title"
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="subtitle1">Référence : {reference}
            </Typography>
            <Typography variant="subtitle1"> Scoring :
            </Typography>
          </Box>
        }
        
      />

      
      <CardContent className="fiche-info-content">
        {/* Premier sous-bloc */}
        <Box className="fiche-info-bloc-1">

          <Box className="fiche-info-bloc-1-row">
            <Box>
              <Typography><strong>Nom et prénom :</strong> Thomas </Typography>
            </Box> 
            <Box sx={{ textAlign: 'right' }}>
              <Typography><strong>Numéro :</strong></Typography>
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">
            <Box >
              <Typography><strong>Date du 1er appel :</strong> </Typography>
            </Box> 

            <Box sx={{ textAlign: 'right' }}>
              <Typography><strong> Nombre d'appels :
              </strong></Typography>  
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">

            <Box>
              <Typography><strong>Date du dernier appel :</strong> </Typography>
            </Box>
            <Box>  
              <Typography><strong>Semaine N°: </strong> </Typography>
            </Box>
          </Box>
          
          

        </Box>
      


      
          
       
        {/* Deuxième sous-bloc */}
        <Box className="fiche-info-bloc-2">
          <Link className="lien-voir-demande" href="#">
            Voir la demande
          </Link>
        </Box>
        {/* Troisième sous-bloc */}
        <Box className="fiche-info-bloc-3">
          <Box className="questionnaire">

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Avez-vous déjà fait appel à Options ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Votre évènement est-il à titre particulier ou professionnel ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Particulier</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>La date de votre évènement est-elle fixée ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Si oui, quelle date ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>14/07/2025</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Le lieu de votre évènement est-il réservé ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Pouvez-vous donner une fourchette de votre budget ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography><strong>Non</strong><br /></Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography>Souhaitez-vous qu'un conseiller clientèle vous rappelle ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite ">
                <Typography>Oui</Typography>  
              </Box>
            </Box>
            
            
          </Box>
          
        </Box>
      </CardContent>
      <CardActions />
    </Card>
  );
}

// 📌 Ajout des propTypes
FicheClient.propTypes = {
  reference: PropTypes.number.isRequired,
 
};
