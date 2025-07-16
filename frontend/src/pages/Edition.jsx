import React, { useState, useEffect } from 'react';
import {
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import InfoDemande from '../components/ui/InfoDemande.jsx';
import Commentaire from '../components/ui/Commentaire.jsx';
import QuestionsScoring from '../components/ui/QuestionsScoring.jsx';
import '../assets/edition.css';
import '../assets/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuotesQuotes } from '../hooks/useQuotesQuotes';
import { useEditQuote } from '../hooks/useEditQuote.jsx';
import { useQuestionnaireQuestions } from '../hooks/useQuestionnaireQuestions.jsx';
import { useQuestionnaireReponses } from '../hooks/useQuestionnaireReponses.jsx';
import { usePostGivenAnswers } from '../hooks/usePostGivenAnswers';


export default function Edition() {

  // Fonction pour formater les données info demande selon l'API
function formatDataInfoForApi(blocInfoData) {
  return {
    order_id: blocInfoData.order_id,                    
    reference: blocInfoData.reference,
    firstname: blocInfoData.Prénom,
    lastname: blocInfoData.Nom,
    phone: blocInfoData["Numéro de téléphone"],
    customer_email: blocInfoData.Email,
    weeknumber: parseInt(blocInfoData["Semaine N°"]),
    call_count: parseInt(blocInfoData["Nombre d'appels"]),
    date_first_call: blocInfoData["Date du 1er appel"],
    date_last_call: blocInfoData["Date du dernier appel"],
    idEtablissement: blocInfoData.idEtablissement,      
    reference_id_SI: parseInt(blocInfoData.Référence),
    status: parseInt(blocInfoData.status)               
  };

}

//Fonction pour formater les données questionnaire selon l'API
function formatDataQuestionnaireForApi(questionnaireData, quoteId/*à remplacer par l'ID du questionnaire lié au devis*/) {
  // Transformer l'objet questionnaireData en un tableau d'objets au format attendu par l'API
  return Object.entries(questionnaireData).map(([questionId, answerData]) => ({
    answer: answerData.reponse,  // La réponse sélectionnée
    questionnaire: quoteId       // L'ID du devis/quote
  })).filter(item => item.answer !== undefined); // Ne garder que les réponses définies
}


  // Récupération des données quotes avec le hook useQuotesQuotes
  const { quotes: tableData, loading: quotesLoading, error: quotesError } = useQuotesQuotes();
  const { reference } = useParams();
  const selectedQuote = tableData?.find(quote => 
    quote.reference_id_SI === reference || 
    quote.reference_id_SI?.toString() === reference
  );

  // récupération des données questions du questionnaire avec le hook useQuestionnaireQuestions
  const { questions: questionnaireQuestions, loading: questionsLoading, error: questionsError } = useQuestionnaireQuestions();

  // récupération des données réponses du questionnaire avec le hook usedQuestionnaireRéponses
  const { reponses: questionnaireResponses, loading: responsesLoading, error: responsesError } = useQuestionnaireReponses();

  // Utilisation du hook useEditQuote
  const { editQuote, loading: editLoading, error: editError } = useEditQuote();

  // Utilisation du hook usePostGivenAnswers

  const { givenAnswers, loading: answersLoading, error: answersError } = usePostGivenAnswers();

  const [commentaire, setCommentaire] = useState("");
  const navigate = useNavigate();
  const [blocInfoData, setBlocInfoData] = useState(null);
  const [questionnaireData, setQuestionnaireData] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCommentaireChange = (newValue) => {
    setCommentaire(newValue);
  };

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
    setMessage(null);
    
    if (!selectedQuote) {
      setMessage('Devis non trouvé');
      setMessageType('error');
      return;
    }

    try {

   
      const dataInfoToSend  = formatDataInfoForApi(blocInfoData);
       const questionnaireDataToSend = formatDataQuestionnaireForApi(questionnaireData, selectedQuote.id);
      
      
       console.log('donnée questionnaire non formatées à envoyer' , questionnaireData);
      
      console.log('donnée questionnaiers formatées à envoyer' , questionnaireDataToSend);
  

    

      // Utilisation du hook editquote 
      await editQuote(selectedQuote.id, dataInfoToSend);
       await givenAnswers(questionnaireDataToSend);
      
      setMessage('Données enregistrées avec succès !');
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(`Erreur lors de l'enregistrement: ${error.message}`);
      setMessageType('error');
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

  // Affichage des erreurs de chargement des quotes
  useEffect(() => {
    if (quotesError) {
      setMessage(`Erreur lors du chargement du devis: ${quotesError}`);
      setMessageType('error');
    }
  }, [quotesError]);

  const isLoading = quotesLoading || editLoading || answersLoading || questionsLoading || responsesLoading;

  return (
    <>
      <Container fluid style={{ paddingLeft: '10%', paddingRight: '10%' }} className="container-edition">
        {/* Première ligne : Bouton Fermer à gauche, Titre centré */}
        <Row className="ligne-1-edition mb-3">
          <Col xs={3} className="d-flex justify-content-start align-items-center">
            <Button
              variant="contained"
              className="bouton-editer bouton-fermer-edition"
              disabled={isLoading}
              onClick={handleCloseClick}
            >
              Fermer
            </Button>
          </Col>
          <Col xs={6} className="d-flex justify-content-center align-items-center">
            <div className="titre1 titre-edition">{`Demande ${reference}`}</div>
          </Col>
          <Col xs={3}></Col>
        </Row>

        {/* Ligne Information de la demande */}
        <Row className="mb-3">
          <Col xs={12} className="d-flex justify-content-center">
            <div className="titre2 sous-titre-edition-1">Information de la demande</div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} className="d-flex">
            <InfoDemande 
              data={selectedQuote ? [selectedQuote] : []} 
              onDataChange={handleInfoDatachange} 
            />
          </Col>
        </Row>

        {/* Ligne Questions de scoring */}
        <Row className="mb-3">
          <Col xs={12} className="d-flex justify-content-center">
            <div className="titre2 sous-titre-edition-2">Questions de scoring</div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12} className="d-flex">
            <div className="d-flex flex-wrap">
              <QuestionsScoring onDataChange={handleQuestionDatachange} questionsData={questionnaireQuestions} reponsesData={questionnaireResponses} />
            </div>
          </Col>
        </Row>

        {/* Ligne Commentaire */}
        <Row className="mb-4">
          <Col xs={12} className="d-flex">
            <Commentaire 
              value={commentaire}
              onChange={handleCommentaireChange} 
            />
          </Col>
        </Row>

        {/* Message d'alerte */}
        {message && (
          <Row className="mb-3">
            <Col xs={12}>
              <Alert
                severity={messageType === 'success' ? 'success' : 'error'}
                onClose={() => setMessage(null)}
                className="custom-alert"
              >
                {message}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Ligne Bouton Enregistrer */}
        <Row className="mb-3">
          <Col xs={12} className="d-flex justify-content-center bouton-enregistrer">
            <Button 
              variant="contained"
              className="bouton-editer bouton-enregistrer-edition"
              onClick={handleEnregistrer}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={confirmOpen} onClose={handleCancelClose} className="boite-dialogue">
        <div className="dialog-content">
          <DialogTitle className="dialog-title">
            Vous êtes sur le point de fermer la demande N° {reference}, sans avoir enregistré vos modifications, souhaitez-vous confirmer cette action ?
          </DialogTitle>
          <DialogActions className="dialog-actions">
            <Button 
              className="bouton-editer bouton-confirmer" 
              onClick={handleConfirmClose} 
              variant="contained"
            >
              Confirmer
            </Button>
            <Button className="bouton-editer bouton-annuler" onClick={handleCancelClose}>
              Annuler
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}