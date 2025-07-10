import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../../assets/previewtabs.css'
import FicheClient from './FicheClient.jsx';
import useCurrentUser from '../../hooks/useCurrentUser.jsx';




export default function PreviewTabs({ openedRowRef }) {

  
const getCurrentUserId = useCurrentUser();
console.log(getCurrentUserId?.id);


  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [ws, setWs] = useState(null);

  // Gestion WebSocket pour vérifier le statut d'édition
  useEffect(() => {
    if (!openedRowRef) return;

    // Créer la connexion WebSocket
    const websocket = new WebSocket('ws://localhost:3001/editing-status');
    
    websocket.onopen = () => {
      console.log('WebSocket connecté');
      // Demander le statut initial
      websocket.send(JSON.stringify({ 
        type: 'CHECK_STATUS', 
        reference: openedRowRef 
      }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.reference === openedRowRef) {
          setIsBeingEdited(data.isBeingEdited);
          setEditingUser(data.editingUser);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket fermé');
    };

    setWs(websocket);

    // Nettoyer la connexion quand le composant se démonte ou que la référence change
    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [openedRowRef]);

  // Gérer le clic sur le bouton éditer
  const handleEditClick = () => {
    if (isBeingEdited || !ws) return;
    
    // Notifier le serveur qu'on commence l'édition
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'START_EDITING', 
        reference: openedRowRef,
        userId: getCurrentUserId()
      }));
    }
  };

  if (!openedRowRef) {
    return (
      <Box className="preview">
        <FontAwesomeIcon icon={faEye} className="icone-preview" />
        <Typography className="text-preview">
          Onglet de prévisualisation<br />
          Sélectionnez une demande pour voir les informations
        </Typography>
      </Box>
    );
  }

  const handleTabChange = (e, v) => setActiveTab(v);

  return (
    <Box className="preview-selected">
      <Button 
        component={isBeingEdited ? 'button' : Link}
        to={isBeingEdited ? undefined : `/edition/${openedRowRef}`}
        variant="contained"
        className="bouton-editer"
        disabled={isBeingEdited}
        onClick={isBeingEdited ? undefined : handleEditClick}
        title={
          isBeingEdited 
            ? `En cours d'édition par ${editingUser || 'un autre utilisateur'}` 
            : "Éditer cette fiche"
        }
        style={{
          opacity: isBeingEdited ? 0.6 : 1,
          cursor: isBeingEdited ? 'not-allowed' : 'pointer'
        }}
      >
        {isBeingEdited ? "🔒 En cours d'édition" : "Éditer"}
      </Button>
      {/* Affichage optionnel du statut d'édition */}
      {isBeingEdited && (
        <Typography variant="caption" style={{ color: 'orange', marginTop: '8px' }}>
          Cette fiche est actuellement modifiée par {editingUser || 'un autre utilisateur'}
        </Typography>
      )}
      <FicheClient reference={openedRowRef} className="fiche-info"/>
    </Box>
  );
}