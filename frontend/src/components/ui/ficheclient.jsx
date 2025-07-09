import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Commentaire from './Commentaire.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useQuotesQuotes} from '../../hooks/useQuotesQuotes';
import {authFetch} from '../../services/auth.js'


export default function FicheClient({reference}) {


//récupération des données avec le hook useQuotesQuotes
  const { quotes:tableData, loading, error } = useQuotesQuotes();
 
  const selectedQuote = tableData?.find(quote => 
      quote.reference_id_SI === reference || 
      quote.reference_id_SI?.toString() === reference
    );
    console.log(selectedQuote)
;



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
              <Typography className="fiche-info-blocs-text"><strong>Nom et prénom :</strong> {selectedQuote?.lastname ?? 'Inconnu'} {selectedQuote?.firstname ?? 'Inconnu'}</Typography>
            </Box> 
            <Box sx={{ textAlign: 'right' }}>
              <Typography className="fiche-info-blocs-text"><strong>Numéro :</strong> {selectedQuote?.phone ?? 'Inconnu'}</Typography>
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">
            <Box >
              <Typography className="fiche-info-blocs-text"><strong>Date du 1er appel :</strong> {selectedQuote?.date_first_call ?? 'Inconnu'} </Typography>
            </Box> 

            <Box sx={{ textAlign: 'right' }}>
              <Typography className="fiche-info-blocs-text"><strong> Nombre d'appels :
              </strong> {selectedQuote?.call_count ?? 'Inconnu'}</Typography>  
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">

            <Box>
              <Typography className="fiche-info-blocs-text"><strong>Date du dernier appel :</strong> {selectedQuote?.date_last_call ?? 'Inconnu'} </Typography>
            </Box>
            <Box>  
              <Typography className="fiche-info-blocs-text"><strong>Semaine N°: </strong> {selectedQuote?.weeknumber ?? 'Inconnu'}</Typography>
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
    <Box>
        <Commentaire commentaire="Le clien souhaite que la récupération se fasse..."/>
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
