import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { useChangePassword } from '../../hooks/useChangePassword'; // Ajustez le chemin selon votre structure

export default function Users({ 
  datausers = [], 
  handleEdit, 
  handleDelete,
  isCreating,
  creationData,
  onCreationChange,
  onSaveNewUser,
  onCancelCreation,
  isCurrentProfile = false,
  currentUserGroup //  prop pour le groupe de l'utilisateur courant
}) {
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { loading, error, success, changePassword, reset } = useChangePassword();

  if (!Array.isArray(datausers)) {
   
    return null;
  }

  const getAvailableRoles = () => {
  // Mapping basé sur les IDs réels de la bdd
  const groupMapping = {
    'Gestionnaire Acceor': '2',    // ID réel: 2
    'Gestionnaire Options': '1',   // ID réel: 1
    'Utilisateur Acceor': '4',     // ID réel: 4
    'Utilisateur Options': '3'     // ID réel: 3
  };

  const groupValue = groupMapping[currentUserGroup];

  switch(groupValue) {
    case '2': // Gestionnaire Acceor (ID=2)
      return [
        { value: '2', label: 'Gestionnaire Acceor' },
        { value: '4', label: 'Utilisateur Acceor' }
      ];
    case '1': // Gestionnaire Options (ID=1)
      return [
        { value: '1', label: 'Gestionnaire Options' },
        { value: '3', label: 'Utilisateur Options' }
      ];
    default:
      return [];
  }
};
 

  const availableRoles = getAvailableRoles();

  const handlePasswordClick = (user) => {
    setCurrentUser(user);
    setPasswordModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      await changePassword(passwordData);
      // Succès - fermer la modal
      setPasswordModal(false);
      setCurrentUser(null);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert("Mot de passe modifié avec succès !");
    } catch (error) {
      // Gestion spécifique pour les erreurs d'authentification
      if (error.message.includes('Session expirée') || error.message.includes('accès non autorisé')) {
        if (window.confirm('Votre session a expiré. Souhaitez-vous vous reconnecter ?')) {
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }
      }
      console.error('Erreur lors du changement de mot de passe:', error);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordModal(false);
    setCurrentUser(null);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    reset(); // Reset du hook
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="container-gestion-compte">
      {/* Version desktop - 4 colonnes */}
      <div className="d-none d-lg-block">
        {/* Liste des utilisateurs existants */}
        {datausers.map((user, i) => (
          <Box key={i} className="info-admin" sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr auto',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Colonne 1: Nom & Prénom */}
            <Box className="container-infos">
              <Box className="container-infos-1">Nom et Prénom :</Box>
              <Box className="container-infos-2">
                {user.last_name} {user.first_name}
              </Box>
            </Box>
            
            {/* Colonne 2: Email */}
            <Box className="container-infos">
              <Box className="container-infos-1">Email :</Box>
              <Box className="container-infos-2">{user.email}</Box>
            </Box>
            
            {/* Colonne 3: Rôle ou Mot de passe */}
            <Box className="container-infos">
              <Box className="container-infos-1">
                {isCurrentProfile ? "Mot de passe :" : "Rôle :"}
              </Box>
              <Box className="container-infos-2">
                {isCurrentProfile ? (
                  <Button className="container-infos-2" sx={{
                      all: 'unset',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      
                    }}
                    
                    onClick={() => handlePasswordClick(user)}
                  >
                    
                    Modifier
                  </Button>
                ) : (
                  user.groups
                )}
              </Box>
            </Box>
            
            {/* Colonne 4: Icônes */}
            {!isCurrentProfile && (
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                paddingRight: '16px'
              }}>
                <Button onClick={() => handleEdit(user)} sx={{ minWidth: '40px' }}>
                  <FontAwesomeIcon icon={faCircleCheck} className="icon"/>
                </Button>
                <Button onClick={() => handleDelete(user.id)} sx={{ minWidth: '40px' }}>
                  <FontAwesomeIcon icon={faTrash} className="icon"/>
                </Button>
              </Box>
            )}
          </Box>
        ))}

        {/* Ligne de création */}
       {isCreating && (
          <Box className="info-admin" sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr auto',
            gap: '16px',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '8px'
          }}>
            {/* Colonne 1: Nom & Prénom */}
            
           
            
            <Box className="container-infos">
              <Box className="container-infos-1">Nom et Prénom :</Box>
              <Box className="container-infos-2">
                <input 
                  name="last_name" 
                  value={creationData.last_name} 
                  onChange={onCreationChange}
                  placeholder="Nom"
                  className="form-control-sm border-0"
                  style={{ width: '100%' }}
                  disabled={isCurrentProfile}
                />
                <input 
                  name="first_name" 
                  value={creationData.first_name} 
                  onChange={onCreationChange}
                  placeholder="Prénom"
                  className="form-control-sm border-0"
                  style={{ width: '100%' }}
                  disabled={isCurrentProfile}
                />
              </Box>
            </Box>
            
            {/* Colonne 2: Email */}
            <Box className="container-infos">
              <Box className="container-infos-1">Email :</Box>
              <Box className="container-infos-2">
                <input 
                  name="email" 
                  value={creationData.email} 
                  onChange={onCreationChange}
                  placeholder="Email"
                  className="form-control-sm border-0"
                  style={{ width: '100%' }}
                  disabled={isCurrentProfile}
                />
              </Box>
            </Box>
            
            {/* Colonne 3: Rôle */}
            {/* Colonne 3: Rôle - CORRIGÉ */}
    <Box className="container-infos">
      <Box className="container-infos-1">Rôle :</Box>
      <Box className="container-infos-2 " sx={{ 
  position: 'relative',
  zIndex: 1300, // Z-index très élevé
  '& select': {
    backgroundColor: '#fff', // Fond blanc obligatoire
    '& option': {
      backgroundColor: '#fff !important', // Important pour forcer le style
      color: '#000 !important',
      display: 'block !important'
    }
  }
}}>
  <select
    name="groups"
    value={creationData.groups?.[0] || ''}
    onChange={(e) => {
      
      onCreationChange({
        target: {
          name: 'groups',
          value: e.target.value ? [e.target.value] : []
        }
      });
    }}
    className="border-0"
    style={{
      width: '100%',
      padding: '4px',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      appearance: 'menulist',
      WebkitAppearance: 'menulist',
      MozAppearance: 'menulist'
    }}
  >
    <option value="">Sélectionner...</option>
    {availableRoles.length > 0 ? (
      availableRoles.map(role => (
        <option 
          key={role.value} 
          value={role.value}
          style={{
            backgroundColor: '#fff',
            color: '#000',
            padding: '8px'
          }}
        >
          {role.label}
        </option>
      ))
    ) : (
      <option value="" disabled>Aucun rôle disponible</option>
    )}
  </select>
</Box>
    </Box>
    
    {/* Colonne 4: Actions  */}
    <Box sx={{ 
      display: 'flex', 
      gap: '8px',
      '& button': {
        pointerEvents: 'auto' // Force les événements de clic
      }
    }}>

      
      <Button 
        variant="contained" 
        color="success" 
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onSaveNewUser();
        }}
        className="bouton-créer-utilisateur"
       sx={{
        minWidth: '20px',
    '&:focus, &:active': {
      backgroundColor: '#90A5C8 !important',
      boxShadow: 'none !important',
      outline: 'none !important',
    },
  }}
        disabled={!creationData.groups?.[0]}
      >
         <span className="custom-add-utilisateur-icon">+</span>
      </Button>
      <Button 
        variant="outlined" 
        color="error" 
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onCancelCreation();
        }}
        sx={{ minWidth: '40px' }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </Box>
  </Box>
)}
      </div>

      {/* Version mobile - inchangée */}
      <div className="d-block d-lg-none">
        {datausers.map((user, i) => (
          <div key={i} className="info-admin-mobile mb-4 p-3" style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="row mb-2">
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Nom :</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {user.last_name}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Prénom :</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {user.first_name}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Email :</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {user.email}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>
                {isCurrentProfile ? "Mot de passe :" : "Rôle :"}
              </div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {isCurrentProfile ? (
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handlePasswordClick(user)}
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '12px',
                      padding: '4px 8px'
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} style={{ marginRight: '4px' }} />
                    Modifier
                  </Button>
                ) : (
                  user.groups
                )}
              </div>
            </div>
            {!isCurrentProfile && (
              <div className="d-flex justify-content-end mt-2">
                <Button 
                  className="me-2" 
                  style={{ 
                    color: '#656565',
                    border: 'none',
                    minWidth: '40px'
                  }}
                  variant="outlined" 
                  size="small"
                  onClick={() => handleEdit(user)}
                >
                  <FontAwesomeIcon icon={faCircleCheck} className="icon-small-screen"/>
                </Button>
                <Button 
                  style={{ 
                    color: '#656565',
                    minWidth: '40px',
                    border: 'none',
                  }}
                  variant="outlined" 
                  size="small"
                  onClick={() => handleDelete(user.id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="icon-small-screen"/>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal pour changer le mot de passe */}
      <Modal
        open={passwordModal}
        onClose={handlePasswordCancel}
        aria-labelledby="password-modal-title"
        aria-describedby="password-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="password-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Modifier votre mot de passe
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Mot de passe modifié avec succès !
            </Alert>
          )}
          
          <TextField
            fullWidth
            type="password"
            placeholder="Mot de passe actuel"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2,
            backgroundColor: '#F5F2EE',
            '& .MuiFilledInput-root': {
              backgroundColor: '#F5F2EE',
              }, }}
            
          />
          
          <TextField
            fullWidth
            type="password"
            placeholder="Nouveau mot de passe"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2,
            backgroundColor: '#F5F2EE',
            '& .MuiFilledInput-root': {
              backgroundColor: '#F5F2EE',
              }, }}
          />
          
          <TextField
            fullWidth
            type="password"
            placeholder="Confirmer votre nouveau mot de passe"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 3,
            backgroundColor: '#F5F2EE',
            '& .MuiFilledInput-root': {
              backgroundColor: '#F5F2EE',
              }, }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handlePasswordCancel}
            >
              Annuler
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePasswordSubmit}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || loading}
            >
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}