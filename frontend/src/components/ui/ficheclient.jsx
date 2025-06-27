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
          <Box className="fiche-info-title-content" >
            <Typography className="fiche-info-title-content-text">Référence : {reference}
            </Typography>
            <Typography className="fiche-info-title-content-text"> Scoring :
            </Typography>
          </Box>
        }
        
      />

      
      <CardContent className="fiche-info-content">
        {/* Premier sous-bloc */}
        <Box className="fiche-info-bloc-1">

          <Box className="fiche-info-bloc-1-row">
            <Box>
              <Typography className="fiche-info-blocs-text"><strong>Nom et prénom :</strong> Thomas </Typography>
            </Box> 
            <Box sx={{ textAlign: 'right' }}>
              <Typography className="fiche-info-blocs-text"><strong>Numéro :</strong></Typography>
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">
            <Box >
              <Typography className="fiche-info-blocs-text"><strong>Date du 1er appel :</strong> </Typography>
            </Box> 

            <Box sx={{ textAlign: 'right' }}>
              <Typography className="fiche-info-blocs-text"><strong> Nombre d'appels :
              </strong></Typography>  
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">

            <Box>
              <Typography className="fiche-info-blocs-text"><strong>Date du dernier appel :</strong> </Typography>
            </Box>
            <Box>  
              <Typography className="fiche-info-blocs-text"><strong>Semaine N°: </strong> </Typography>
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
          

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Avez-vous déjà fait appel à Options ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography >Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Votre évènement est-il à titre particulier ou professionnel ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Particulier</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">La date de votre évènement est-elle fixée ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Si oui, quelle date ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>14/07/2025</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Le lieu de votre évènement est-il réservé ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography>Non</Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Pouvez-vous donner une fourchette de votre budget ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite">
                <Typography className="fiche-info-blocs-text"><strong>Non</strong><br /></Typography>  
              </Box>
            </Box>

            <Box className="questionnaire-box">
              <Box className="questionnaire-box-gauche">
                <Typography className="fiche-info-blocs-text">Souhaitez-vous qu'un conseiller clientèle vous rappelle ?  </Typography>
              </Box>
              <Box className="questionnaire-box-droite ">
                <Typography className="fiche-info-blocs-text">Oui</Typography>  
              </Box>
            </Box>
          
        </Box>
    
        <Box className="fiche-info-bloc-4-commentaire">
          <Box className="fiche-info-blocs-text">
            Commentaire :
          </Box>
          <Box className="retour-commentaire"> 
            <Typography className="retour-commentaire-text">Le client souhaite que la récupération se fasse le dimanche 20 juillet...
          </Typography>
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
