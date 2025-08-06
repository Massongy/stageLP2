import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Typography, Box, Link } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Commentaire from './Commentaire.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/commentaire.css'
import {useQuotesQuotes} from '../../hooks/useQuotesQuotes.jsx';
import { useGetQuestionnaireId } from '../../hooks/useGetQuestionnaireId.jsx';
import {useQuestionnaireQuestions} from '../../hooks/useQuestionnaireQuestions.jsx';
import dayjs from 'dayjs'; // ajoute ça en haut si ce n’est pas déjà importé
import 'dayjs/locale/fr';

export default function FicheClient({reference}) {


//récupération des données avec le hook useQuotesQuotes
  const { quotes:tableData, loading, error } = useQuotesQuotes();
   const selectedQuote = tableData?.find(quote => 
      quote.reference === reference || 
      quote.reference?.toString() === reference
    );
   const selectedQuoteId = selectedQuote?.id || null;
  const { questionnaire, loading: loadingQuestionnaire, error: errorQuestionnaire } = useGetQuestionnaireId(selectedQuoteId);

 
 const { questions: questionnaireQuestions, loading: loadingQuestionnaireQuestions, error: errorQuestionnaireQuestions } = useQuestionnaireQuestions();
 const dateInputQuestion = questionnaireQuestions?.find(q => q.is_date_input === true);




  return (
    <Card className="fiche-info" >
      <CardHeader className="fiche-info-title"
        title={
          <Box className="fiche-info-title-content" >
            <Typography className="fiche-info-title-content-text">Référence : {reference}
            </Typography>
            
          </Box>
        }
        
      />

      
      <CardContent className="fiche-info-content">
        {/* Premier sous-bloc */}
        <Box className="fiche-info-bloc-1">

          <Box className="fiche-info-bloc-1-row">
            <Box>
              <Typography className="titre3">Nom et prénom :</Typography>
              <Typography className="texte2">{selectedQuote?.lastname ?? 'Inconnu'} {selectedQuote?.firstname ?? 'Inconnu'}
              </Typography> 
            
            </Box> 
            <Box sx={{ textAlign: 'right' }}>
              <Typography className="titre3">Numéro :</Typography> 
               <Typography className="texte2">{selectedQuote?.phone ?? 'Inconnu'}</Typography>
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">
            <Box >
              <Typography className="titre3">Date du 1er appel :</Typography>
              <Typography className="texte2">{selectedQuote?.date_first_call ? dayjs(selectedQuote.date_first_call).format('DD/MM/YYYY')
              : 'Inconnu'} </Typography>
            </Box> 

            <Box sx={{ textAlign: 'right' }}>
              <Typography className="titre3">Nombre d'appels :</Typography>  
               <Typography className="texte2">{selectedQuote?.call_count ?? 'Inconnu'}</Typography>
            </Box>
          </Box>

          <Box className="fiche-info-bloc-1-row">

            <Box>
              <Typography className="titre3">Date du dernier appel :</Typography>
              <Typography className="texte2">  {selectedQuote?.date_last_call ? dayjs(selectedQuote.date_last_call).format('DD/MM/YYYY')
                : 'Inconnu'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>  
              <Typography className="titre3">Semaine N°:</Typography>
              <Typography className="texte2"> {selectedQuote?.weeknumber ?? 'Inconnu'}</Typography>
            </Box>
          </Box>
          
          

        </Box>
    
        {/* Deuxième sous-bloc */}
        <Box className="fiche-info-bloc-2">
          
        </Box>
        
        
      <Box className="fiche-info-bloc-3">
          {/* Affichage des réponses aux questions */}
          {questionnaire?.given_answers?.map((item) => (
            item.answer.value && (
              <Box key={item.question.id} className="questionnaire-box">
                <Box className="questionnaire-box-gauche">
                  <Typography className="fiche-info-blocs-text titre3">{item.question.label}</Typography>
                </Box>
                <Box className="questionnaire-box-droite">
                  <Typography className="fiche-info-blocs-text questionnaire-box-droite">{item.answer.value}</Typography>
                </Box>
              </Box>
            )
          ))}

        {/* Affichage de la date prévue si elle existe */}
        {questionnaire?.date_prevue && (
          <Box className="questionnaire-box">
            <Box className="questionnaire-box-gauche">
              <Typography className="titre3">{dateInputQuestion?.label}</Typography>
            </Box>
            <Box className="questionnaire-box-droite">
              <Typography className="texte2 questionnaire-box-droite">
                {dayjs(questionnaire.date_prevue).format('DD/MM/YYYY')}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>


        <Box>
            <Commentaire className="champ" value={selectedQuote?.comment || " "} 
                    onChange={() => {}} editable = {false}/>
        </Box>
        </CardContent>
        
      </Card>
  );
}


