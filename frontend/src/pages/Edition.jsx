import React, { useState , useEffect} from 'react';
import {
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import InfoDemande from '../components/ui/InfoDemande.jsx';
import Commentaire from '../components/ui/Commentaire.jsx';
import QuestionsScoring from '../components/ui/QuestionsScoring.jsx';
import '../assets/edition.css';
import '../assets/Theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useQuotesQuotes} from '../hooks/useQuotesQuotes';
import {authFetch} from '../services/auth.js'


export default function Edition() {

//récupération des données avec le hook useQuotesQuotes
  const { quotes:tableData, loading, error } = useQuotesQuotes();
  const { reference } = useParams();
  const selectedQuote = tableData?.find(quote => 
      quote.reference_id_SI === reference || 
      quote.reference_id_SI?.toString() === reference
    );
    
  const [commentaire, setCommentaire] = useState("");
  const handleCommentaireChange = (newValue) => {
    setCommentaire(newValue);
  };

  const navigate = useNavigate();
  const [blocInfoData, setBlocInfoData] = useState(null);
  const [questionnaireData, setQuestionnaireData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleInfoDatachange = setBlocInfoData;
  const handleQuestionDatachange = setQuestionnaireData;

  const validateData = () => {
    if (!blocInfoData || Object.keys(blocInfoData).length === 0) {
      setMessage('Veuillez remplir les informations de la demande.');
      setMessageType('error');
      return false;
    }
    if (!questionnaireData || Object.keys(questionnaireData).length === 0) {
      setMessage('Veuillez répondre aux questions de scoring.');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handleSaveData = async () => {
    setIsLoading(true);
    setMessage(null);
    try {

      /*ici il faut faire attention à bien vérifier le formatage des données en fonction de ce que doit recevoir l'api: notamment 
      il y a trop de chanes renvoyées dans le blocInfoData puisqu'il y a toutes les données du quote
*/
      const dataToSend = {
        reference,
        informations: blocInfoData,
        questionnaire: questionnaireData,
        commentaire: commentaire,
      };

      //vérification que les données sont bien en stock
      console.log('données à envoyer: ', dataToSend);

      const response = await authFetch(`/api/questionnaire/questionnaires/${selectedQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const result = await response.json();
      setMessage('Données enregistrées avec succès !');
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(`Erreur lors de l'enregistrement: ${error.message}`);
      setMessageType('error');
  
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnregistrer = () => {
    if (validateData()) handleSaveData();
  };

  const handleCloseClick = () => {
    setConfirmOpen(true);
  };
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    navigate('/');
  };
  const handleCancelClose = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Box className="container-edition">
        <Box className="ligne-1-edition">
          <Button
            component={Link}
            to="#"
            variant="contained"
            className="bouton-editer bouton-fermer-edition"
            disabled={isLoading}
            onClick={handleCloseClick}
          >
            Fermer
          </Button>
          <Box className="titre1 titre-edition">{`Demande ${reference}`}</Box>
        </Box>

        {message && (
          <Alert
            severity={messageType}
            onClose={() => setMessage(null)}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <Box className="titre2 sous-titre-edition-1">Information de la demande</Box>
        <InfoDemande data={selectedQuote ? [selectedQuote] : []} onDataChange={handleInfoDatachange} />

        <Box className="titre2 sous-titre-edition-2">Questions de scoring</Box>
        <QuestionsScoring onDataChange={handleQuestionDatachange} />

        <Box><Commentaire  value={commentaire} 
          onChange={handleCommentaireChange} /></Box>

        <Button
          variant="contained"
          className="bouton-editer bouton-enregistrer-edition"
          onClick={handleEnregistrer}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </Box>

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={confirmOpen} onClose={handleCancelClose}>
        <DialogTitle>Vous êtes sur le point de fermer la demande N° {reference} sans avoir enregistré vos modifications, souhaitez-vous confirmer cette action  ?</DialogTitle>
        <DialogActions>
          <Button className="bouton-editer bouton-fermer-edition" onClick={handleCancelClose}>Annuler</Button>
          <Button className="bouton-editer bouton-fermer-edition" onClick={handleConfirmClose} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
