import React, { useState, useEffect,useCallback } from 'react';
import {
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Typography,
  DialogActions,
  Grid,
  Box
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
import { useGetQuestionnaireId } from '../hooks/useGetQuestionnaireId.jsx'; 
import { useUnlockQuote } from '../hooks/useUnlockQuote';
import dayjs from 'dayjs';


export default function Edition() {

  // Fonction pour formater les données info demande selon l'API
function formatDataInfoForApi(blocInfoData, commentaire) {
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
    status: parseInt(blocInfoData.status),
    comment: commentaire || ""               
  };

}

// Fonction pour formater les données questionnaire selon l'API

function formatDataQuestionnaireForApi(questionnaireData, selectedQuote) {
  const questionnaireId = Number(selectedQuote?.questionnaire?.id) || 0;
  
  return Object.entries(questionnaireData)
    .filter(([_, data]) => {
      // Garder les questions avec une réponse OU une date
      return (
        (data.reponse !== undefined && data.reponse !== null && data.reponse !== '') ||
        (data.date !== null && data.date !== undefined)
      );
    })
    .map(([questionId, data]) => {
      let answer;
      let dateAnswer = null;
      
      // Si il y a une date, c'est une question de type date
      if (data.date) {
        answer = Number(data.reponse); // L'ID de la réponse pour cette question date
        
        // Gérer différents formats de date
        try {
          let isoDate;
          
          // Format dd/mm/yyyy
          if (data.date.includes('/')) {
            const [day, month, year] = data.date.split('/');
            isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
          // Format yyyy-mm-dd (déjà ISO)
          else if (data.date.includes('-') && data.date.length === 10) {
            isoDate = data.date;
          }
          // Autres formats possibles...
          else {
            throw new Error('Format de date non reconnu');
          }
          
          // Vérifier que la date est valide
          if (!isNaN(new Date(isoDate).getTime())) {
            dateAnswer = isoDate;
          } else {
            console.warn(`Date invalide: ${data.date}`);
          }
        } catch (e) {
          console.error(`Erreur de traitement de date: ${data.date}`, e);
        }
      } else {
        // Question normale (pas de date)
        answer = Number(data.reponse);
      }
      
      return {
        answer,
        questionnaire: questionnaireId,
        date_answer: dateAnswer
      };
    });
}

// Fonction pour formater les données initiales du questionnaire pour initiliaser questionnaireData

  function transformerQuestionnaire(questionnaire, dateQuestionId, reponseDateId) {
    const resultat = {};
    
    // Ajouter l'entrée pour la date
    resultat[dateQuestionId] = {
      date: questionnaire.date_prevue,
      reponse: reponseDateId
    };
    
    // Ajouter les entrées pour chaque given_answer
    questionnaire.given_answers.forEach(givenAnswer => {
      const questionId = givenAnswer.question.id;
      const answerId = givenAnswer.answer.id;
      
      resultat[questionId] = {
        date: null,
        reponse: answerId
      };
    });
    
    return resultat;
  }
  // Récupération des données quotes avec le hook useQuotesQuotes
  const { quotes: tableData, loading: quotesLoading, error: quotesError } = useQuotesQuotes();
  const { reference } = useParams();
  const {status} =useParams();
  const STATUS_MAPPING = {
    4: 'En cours',
    6: 'Sans intérêt',
    7: 'A traiter'
  };

  const getStatusValueOptions = () => {
    // Récupérer tous les statuts uniques présents dans les données
    const uniqueStatusesInData = [...new Set(filteredData.map(item => item.status).filter(status => status != null))];
    
    // Créer les options seulement pour les statuts qui existent dans les données
    return uniqueStatusesInData.map(status => ({
      value: Number(status),
      label: STATUS_MAPPING[status] || `Statut ${status}`
    }));
  };

  const selectedQuote = tableData?.find(quote => 
    quote.reference_id_SI === reference || 
    quote.reference_id_SI?.toString() === reference
  );

  // récupération des données questions du questionnaire avec le hook useQuestionnaireQuestions
  const { questions: questionnaireQuestions, loading: questionsLoading, error: questionsError } = useQuestionnaireQuestions();

  //récupération de données infos de la question date du questionnaire
  const dateInputQuestion = questionnaireQuestions?.find(q => q.is_date_input === true);
  const dateQuestionId = dateInputQuestion ? dateInputQuestion.id : null;    
  // récupération des données réponses du questionnaire avec le hook usedQuestionnaireRéponses
  const { reponses: questionnaireResponses, loading: responsesLoading, error: responsesError } = useQuestionnaireReponses();

   // recupération des données de la réponse date du questionnaire
 
  const ReponseQuestionDateData = questionnaireResponses.find(r => r.question === dateQuestionId);
 const reponseDateId= ReponseQuestionDateData ? ReponseQuestionDateData.id : null;
 


  // Utilisation du hook useEditQuote
  const { editQuote, loading: editLoading, error: editError } = useEditQuote();

  //récupération du questionnaire ID avec le hook useGetQuestionnaireId
  const { questionnaire, loading: questionnaireLoading, error: questionnaireError } = useGetQuestionnaireId(selectedQuote?.id);
 


  // Utilisation du hook usePostGivenAnswers

  const { givenAnswers, loading: answersLoading, error: answersError } = usePostGivenAnswers();

  // Hook pour déverrouiller le devis
  const { unlockQuote, loading: unlockLoading, error: unlockError, isUnlocked, reset: resetUnlock } = useUnlockQuote();

  const navigate = useNavigate();
  const [blocInfoData, setBlocInfoData] = useState(null);

  const [questionnaireData, setQuestionnaireData] = useState({});
 
  // Initialisation des données questionnaireData avec les données du questionnaire récupéré (le cas échéant)
  useEffect(() => {
  if (questionnaire && questionnaire.given_answers) {
    const initialQuestionnaireData = transformerQuestionnaire(questionnaire, dateQuestionId, reponseDateId);
    setQuestionnaireData(initialQuestionnaireData);
    
  }
}, [questionnaire, dateQuestionId, reponseDateId]);
              console.log('Valeurs initiales de questionnaireData:', questionnaireData);

  const [commentaire, setCommentaire] = useState("");
 useEffect(() => {
  if (selectedQuote && selectedQuote.comment) {
    setCommentaire(selectedQuote.comment);
  }
}, [selectedQuote]);


  const [reponsesData, setReponsesData] = useState(questionnaireResponses || []); 
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Nouvel état pour la boîte de dialogue d'enregistrement
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const [confirmSansInteretOpen, setConfirmSansInteretOpen] = useState(false);

  const handleCommentaireChange = (newValue) => {
    setCommentaire(newValue);
  };

  const handleInfoDatachange = setBlocInfoData;
  const handleQuestionDataChange = useCallback((newData) => {
  setQuestionnaireData(prev => {
    // Vérifie si les données ont vraiment changé
    const shouldUpdate = Object.keys(newData).some(
      key => prev[key] !== newData[key]
    );
    return shouldUpdate ? { ...prev, ...newData } : prev;
  });
}, []);
  

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

  const handleSaveData = async (shouldSend = false, statusToSet = null) => {
  setMessage(null);
  
  if (!selectedQuote) {
    setMessage('Devis non trouvé');
    setMessageType('error');
    return;
  }

  try {
    const dataInfoToSend = formatDataInfoForApi(blocInfoData, commentaire);
    const questionnaireDataToSend = formatDataQuestionnaireForApi(questionnaireData, selectedQuote);     
   
    // 1. Mise à jour du devis avec le statut si fourni
    const updateData = statusToSet ? { ...dataInfoToSend, status: statusToSet } : dataInfoToSend;
    await editQuote(selectedQuote.id, updateData);

    const response = await givenAnswers(questionnaireDataToSend);
    
    // ✅ Vérification plus robuste de la réponse
    if (response !== undefined) {
      if (shouldSend) {
        setMessage('Données enregistrées et demande envoyée avec succès !');
      } else {
        setMessage('Données enregistrées avec succès !');
      }
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    } else {
      if (shouldSend) {
        setMessage('Données enregistrées et demande envoyée avec succès !');
      } else {
        setMessage('Données enregistrées avec succès !');
      }
      setMessageType('success');
      setTimeout(() => navigate('/'), 2000);
    }
    
  } catch (error) {
    console.error('Erreur complète:', error);
    setMessage(`Erreur lors de l'enregistrement: ${error.message}`);
    setMessageType('error');
  }
};

  // Fonction appelée lors du clic sur le bouton Enregistrer
  const handleEnregistrer = () => {
    if (validateData()) {
      setSaveDialogOpen(true);
    }
  };

  // Fonctions pour gérer les choix de la boîte de dialogue d'enregistrement
  const handleSaveAndSend = async () => {
  setSaveDialogOpen(false);
  handleSaveData(true, 5);
  await unlockQuote(selectedQuote.id); // shouldSend = true, status = 5 (envoyé)
};

  const handleSaveAndReturnLater =async () => {
  setSaveDialogOpen(false);
  handleSaveData(false, 4); 
  await unlockQuote(selectedQuote.id);// shouldSend = false, status = 4 (en attente)
};

  const handleCancelSave = () => {
    setSaveDialogOpen(false);
  };

  const handleCloseClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = async () => {
    setConfirmOpen(false);
    navigate('/');
    await unlockQuote(selectedQuote.id);
  };

  const handleCancelClose = () => {
    setConfirmOpen(false);
  };


const handleConfirmSansInteret = async () => {
  setConfirmSansInteretOpen(false); // Ferme la popup
  
  if (!selectedQuote) {
    setMessage('Devis non trouvé');
    setMessageType('error');
    return;
  }

  try {
    const updatedData = { status: 6 };
    await editQuote(selectedQuote.id, updatedData);
    await unlockQuote(selectedQuote.id);

    setMessage('Demande marquée comme sans intérêt');
    setMessageType('success');
    setTimeout(() => navigate('/'), 2000);
    
  } catch (error) {
    console.error('Erreur:', error);
    setMessage(`Erreur lors de la mise à jour: ${error.message}`);
    setMessageType('error');
  }
};


  // Affichage des erreurs de chargement des quotes
  useEffect(() => {
    if (quotesError) {
      setMessage(`Erreur lors du chargement du devis: ${quotesError}`);
      setMessageType('error');
    }
  }, [quotesError]);

  const isLoading = quotesLoading || editLoading || answersLoading || questionsLoading || responsesLoading;
// pour vérifier les données avant envoi
  const [questionnaireDataToSend, setQuestionnaireDataToSend] = useState(null);
  useEffect(() => {
  if (questionnaireData && selectedQuote) {
    const data = formatDataQuestionnaireForApi(questionnaireData, selectedQuote);
    setQuestionnaireDataToSend(data);
  }
}, [questionnaireData, selectedQuote]);

// Fonction pour formater les dates personnalisées pour l'affichage
const formatCustomDate = (dateString) => {
  try {
    // Si la date est déjà au format ISO (YYYY-MM-DD)
    if (dayjs(dateString).isValid()) {
      return dayjs(dateString).format('DD/MM/YYYY');
    }
    
    // Si la date contient 'T' (format ISO avec time)
    if (dateString.includes('T')) {
      return dayjs(dateString.split('T')[0]).format('DD/MM/YYYY');
    }
    
    // Pour les autres formats, essayez de parser manuellement
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
      // Essayez différents ordres jour/mois/année
      const formatsToTry = [
        'YYYY-MM-DD',
        'DD-MM-YYYY', 
        'MM-DD-YYYY'
      ];
      
      for (const format of formatsToTry) {
        const date = dayjs(dateString, format);
        if (date.isValid()) {
          return date.format('DD/MM/YYYY');
        }
      }
    }
    
    // Si tout échoue, retourne la date originale
    return dateString;
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return dateString;
  }
};
console.log("statut", status);

  // Affichage du composant
  return (
    <>
      <Container fluid style={{ paddingLeft: '10%', paddingRight: '10%' }} className="container-edition">
        {/* Première ligne : Bouton Fermer à gauche, Titre centré */}
        <Row className="ligne-1-edition mb-3">
          <Col xs={3} className="d-flex justify-content-start align-items-center">
            <Button
              variant="contained"
              className="bouton bouton-fermer-edition"
              disabled={isLoading}
              onClick={handleCloseClick}
            >
              Fermer
            </Button>
            {Number(status) !== 6 && (<Button
              variant="contained"
              className="bouton bouton-fermer-edition"
              disabled={isLoading}
              onClick={() => setConfirmSansInteretOpen(true)} // Ouvre la popup au lieu d'envoyer directement
              style={{ marginLeft: '10px' }}
            >
              sans intérêt
            </Button>)}

          </Col>
          <Col xs={6} className="d-flex flex-column justify-content-center align-items-center">
            <div className="titre1 titre-edition">{`Demande ${reference}`}</div>
            
            <div className="titre2 titre-edition">{` ${STATUS_MAPPING[status] || `Statut ${status}`}`}</div>
            
          </Col>
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
              <QuestionsScoring onDataChange={handleQuestionDataChange} questionsData={questionnaireQuestions} reponsesData={questionnaireResponses} questionnaireData={questionnaireData}/>
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
    severity={messageType} // 'success' ou 'error'
    sx={{
      backgroundColor: messageType === 'success' ? '#f6ffed' : '#fff2f0',
      border: messageType === 'success' ? '1px solid #b7eb8f' : '1px solid #ffccc7',
      color: messageType === 'success' ? '#52c41a' : '#ff4d4f'
    }}
    onClose={() => setMessage(null)}
  >
    {message}
  </Alert>
            </Col>
          </Row>
        )}

        {/* Ligne Bouton Enregistrer */}
        <Row className="mb-3">
          <Col xs={12} className="d-flex justify-content-center ">
            <Button 
              variant="contained"
              className="bouton bouton-enregistrer bouton-editer "
              onClick={handleEnregistrer}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Boîte de dialogue de confirmation de fermeture */}
      {/* Première boîte de dialogue */}
<Dialog open={confirmOpen} onClose={handleCancelClose} className="boite-dialogue">
  <DialogTitle className="dialog-title">
    Vous êtes sur le point de fermer la demande N° {reference}...
  </DialogTitle>
  <DialogActions className="dialog-actions">
    <Button className="bouton-confirmer" onClick={handleConfirmClose} variant="contained">
      Confirmer
    </Button>
    <Button className="bouton-annuler" onClick={handleCancelClose}>
      Annuler
    </Button>
  </DialogActions>
</Dialog>

{/* Deuxième boîte de dialogue */}
<Dialog open={confirmSansInteretOpen} onClose={() => setConfirmSansInteretOpen(false)} className="boite-dialogue">
  <DialogTitle className="dialog-title">
    Êtes-vous sûr de vouloir marquer cette demande comme "sans intérêt" ?
  </DialogTitle>
  <DialogActions className="dialog-actions">
    <Button className="bouton-confirmer" onClick={handleConfirmSansInteret} variant="contained">
      Confirmer
    </Button>
    <Button className="bouton-annuler" onClick={() => setConfirmSansInteretOpen(false)}>
      Annuler
    </Button>
    
  </DialogActions>
</Dialog>

{/* Troisième boîte de dialogue */}
<Dialog open={saveDialogOpen} onClose={handleCancelSave} className="boite-dialogue">
  <DialogTitle className="dialog-title">
    Que souhaitez-vous faire ?
  </DialogTitle>
  <DialogActions className="dialog-actions">
    <Button className="bouton-confirmer" onClick={handleSaveAndSend} variant="contained" disabled={isLoading}>
      Enregistrer et clôturer
    </Button>
    <Button className="bouton-confirmer" onClick={handleSaveAndReturnLater} variant="contained" disabled={isLoading}>
      Enregistrer et revenir plus tard
    </Button>
    <Button className="bouton-annuler" onClick={handleCancelSave} disabled={isLoading}>
      Annuler
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}