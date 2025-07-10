import React, { useState } from 'react';
import { Button, Box, Alert, CircularProgress } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import InfoDemande from '../components/ui/InfoDemande.jsx';
import Commentaire from '../components/ui/Commentaire.jsx';
import QuestionsScoring from '../components/ui/QuestionsScoring.jsx';
import '../assets/edition.css';
import '../assets/Theme.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Edition() {
  const {reference} = useParams();
  console.log(reference);
  const navigate = useNavigate();

  // Données statiques pour InfoDemande en attendant le fetch quotes/quotes/{}
  
const userData = [
    
 { cle:  "id", valeurs: ['0']},
 { cle:  "order_id", valeurs: ['string']},
  { cle: "reference", valeurs: ['string']},
  { cle: "firstname", valeurs: ['string']},
 { cle:  "lastname", valeurs: ['string']},
 { cle:  "phone", valeurs: ['string']},
 { cle:  "customer_email", valeurs: ['user@example.com']},
 { cle:  "weeknumber", valeurs:  [reference]},
 { cle:  "call_count", valeurs:  [reference]},
 { cle:  "date_first_call", valeurs: ['2025-07-04T13:02:59.789Z']},
 { cle:  "date_last_call", valeurs: ['2025-07-04T13:02:59.789Z']},
 { cle:  "created_at", valeurs: ['2025-07-04T13:02:59.789Z']},
{ cle:   "updated_at", valeurs: ['2025-07-04T13:02:59.789Z']},
 { cle:  "idEtablissement", valeurs: ['strin']},
 { cle:  "reference_id_SI", valeurs: [reference]},
 { cle: "status", valeurs: ['0']}

  ];
  

  // États existants
  const [blocInfoData, setBlocInfoData] = useState(null);
  const [questionnaireData, setQuestionnaireData] = useState({});
  
  // Nouveaux états pour la gestion de l'envoi
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'

  const handleInfoDatachange = (updatedData) => {
    setBlocInfoData(updatedData);
  };

  const handleQuestionDatachange = (updatedData) => {
    setQuestionnaireData(updatedData);
  };

  // Fonction pour envoyer les données à l'API
  const handleSaveData = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Préparer les données à envoyer
      const dataToSend = {
        reference: reference,
        informations: blocInfoData,
        questionnaire: questionnaireData,
        timestamp: new Date().toISOString(),
      };

      console.log('Envoi des données:', dataToSend);

      // Appel à votre API
      const response = await fetch('/api/clients/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez vos headers d'authentification si nécessaire
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('Réponse de l\'API:', result);

      // Succès
      setMessage('Données enregistrées avec succès !');
      setMessageType('success');

      // Optionnel : rediriger après un délai
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setMessage(`Erreur lors de l'enregistrement: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation des données avant envoi
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

  // Gestionnaire du bouton Enregistrer
  const handleEnregistrer = () => {
    if (validateData()) {
      handleSaveData();
    }
  };

  return (
    <>
      <Box className="container-edition">
        <Box className="ligne-1-edition">
          <>
            <Button
              component={Link}
              to={`/`}
              variant="contained"
              className="bouton-editer bouton-fermer-edition"
              disabled={isLoading}
            >
              Fermer
            </Button>
            <Box className="titre1 titre-edition">{`Demande ${reference}`}</Box>
          </>
        </Box>

        {/* Affichage des messages */}
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
        <Box>
          <InfoDemande data={userData} onDataChange={handleInfoDatachange} />
        </Box>

        <Box className="titre2 sous-titre-edition-2">Questions de scoring</Box>
        <Box className="container-question-scoring-edition">
          <QuestionsScoring onDataChange={handleQuestionDatachange} />
        </Box>

        <Box>
          <Commentaire commentaire="Le client veut que..." />
        </Box>

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
    </>
  );
}