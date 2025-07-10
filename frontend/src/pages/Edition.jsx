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
import '../assets/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col,  } from 'react-bootstrap';
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
    <Container fluid style={{ paddingLeft: '10%', paddingRight: '10%' }} className="container-edition">
      
      {/* Première ligne : Bouton Fermer à gauche, Titre centré */}
      <Row className="ligne-1-edition mb-3">
        <Col xs={3} className="d-flex justify-content-start align-items-center">
          <Button
            as={Link}
            to="#"
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
        <Col xs={3}></Col> {/* Colonne vide pour équilibrer */}
      </Row>

      

      {/* Ligne Information de la demande - Titre centré */}
      <Row className="mb-3">
        <Col xs={12} className="d-flex justify-content-center">
          <div className="titre2 sous-titre-edition-1">Information de la demande</div>
        </Col>
      </Row>

      {/* Ligne InfoDemande -  */}
      <Row className="mb-4">
        <Col xs={12} className="d-flex">
          <InfoDemande 
            data={selectedQuote ? [selectedQuote] : []} 
            onDataChange={handleInfoDatachange} 
          />
        </Col>
      </Row>

      {/* Ligne Questions de scoring - Titre centré */}
      <Row className="mb-3">
        <Col xs={12} className="d-flex justify-content-center">
          <div className="titre2 sous-titre-edition-2">Questions de scoring</div>
        </Col>
      </Row>

      {/* Ligne QuestionsScoring - Display flex avec wrap */}
      <Row className="mb-4">
        <Col xs={12} className="d-flex">
          <div className="d-flex flex-wrap">
            <QuestionsScoring onDataChange={handleQuestionDatachange} />
          </div>
        </Col>
      </Row>

      {/* Ligne Commentaire - Centré */}
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
              variant={messageType === 'success' ? 'success' : 'danger'}
              onClose={() => setMessage(null)}
              dismissible
              className="custom-alert"
            >
              {message}
            </Alert>
          </Col>
        </Row>
      )}
      {/* Ligne Bouton Enregistrer - Centré */}
      <Row className="mb-3">
        <Col xs={12} className="d-flex justify-content-center bouton-enregistrer ">
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
          className="bouton-editer  bouton-confirmer" 
          onClick={handleConfirmClose} 
          color="primary" 
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
