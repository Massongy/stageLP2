import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, Alert, FormControl, InputLabel, FilledInput } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
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
    <div className="users">
      <div className="d-none d-lg-block">
        {/* Liste des utilisateurs existants */}
        {datausers.map((user, i) => (
          
        <Box className="utilisateur"
              key={i}       
           >
            {/* Colonne 1: Nom & Prénom */}
            <Box className="container-infos" >
              <Box className="container-infos-1">Nom et Prénom :</Box>
              <Box className="container-infos-2">
                {user.last_name} {user.first_name}
              </Box>
            </Box>
            
            {/* Colonne 2: Email */}
            <Box className="container-infos" >
              <Box className="container-infos-1">Email :</Box>
              <Box className="container-infos-2">{user.email}</Box>
            </Box>
            
            {/* Colonne 3: Rôle ou Mot de passe */}
            <Box className="container-infos" > 
              <Box className="container-infos-1">
                {isCurrentProfile ? "Mot de passe :" : "Rôle :"}
              </Box>
              
              <Box className="container-infos-2">
                  {isCurrentProfile ? (
                    <Button 
                    disableRipple
                    className="container-infos-2" 
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
            <Box className="boite-icones" >
            {!isCurrentProfile  && (
              /* Bloc actif */
              <Box >
                <Button className="bouton-icone"
                  onClick={() => handleEdit(user)} 
                  
                >
                  <FontAwesomeIcon icon={faPen} className="icon"/>
                </Button>
                <Button className="bouton-icone"
                  onClick={() => handleDelete(user.id)} 
                  
                >
                  <FontAwesomeIcon icon={faTrash} className="icon"/>
                </Button>
              </Box>
            )}
           </Box>
            
         </Box>))}

       {isCreating && (
  <Box className="utilisateur">
    {/* Colonne 1: Nom & Prénom */}
    <Box className="container-infos">
      <Box className="container-infos-1">Nom et Prénom :</Box>
      <Box className="container-infos-2">
        <input 
          name="last_name" 
          value={creationData.last_name} 
          onChange={onCreationChange}
          placeholder="Nom"
          className="form-control-sm border-0 input-nom"
          disabled={isCurrentProfile}
        />
        <input 
          name="first_name" 
          value={creationData.first_name} 
          onChange={onCreationChange}
          placeholder="Prénom"
          className="form-control-sm border-0 input-prenom"
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
          className="form-control-sm border-0 input-email"
          disabled={isCurrentProfile}
        />
      </Box>
    </Box>
    
    {/* Colonne 3: Rôle */}
    <Box className="container-infos">
      <Box className="container-infos-1">Rôle :</Box>
      <Box className="container-infos-2 select-role-container">
        <select
          name="groups"
          value={creationData.groups?.[0] || ''}
          onChange={(e) => onCreationChange({
            target: { name: 'groups', value: e.target.value ? [e.target.value] : [] }
          })}
          className="border-0 select-role"
        >
          <option value="">Sélectionner...</option>
          {availableRoles.map(role => (
            <option key={role.value} value={role.value} className="role-option">
              {role.label}
            </option>
          ))}
        </select>
      </Box>
    </Box>
    
    {/* Colonne 4: Actions */}
    <Box className="boite-icones">
      <Button 
        variant="contained" 
        color="success" 
        size="small"
        onClick={(e) => { e.stopPropagation(); onSaveNewUser(); }}
        className="bouton-créer-utilisateur"
        disabled={!creationData.groups?.[0]}
      >
        <FontAwesomeIcon icon={faCircleCheck} className="icon icone-creation" />
      </Button>
      
      <Button 
        variant="outlined" 
        color="error" 
        size="small"
        onClick={(e) => { e.stopPropagation(); onCancelCreation(); }}
        className="bouton-icone bouton-supprimer"
      >
        <FontAwesomeIcon icon={faTrash} className="icon" />
      </Button>
    </Box>
  </Box>
)}

      </div>

      {/* Version mobile */}
      <div className="d-block d-lg-none">
  {datausers.map((user, i) => (
    <div key={i} className="info-admin-mobile mb-4 p-3 mobile-user-card">
      <div className="row mb-2">
        <div className="col-4 container-infos-1 mobile-info-label">Nom :</div>
        <div className="col-8 container-infos-2 mobile-info-value">
          {user.last_name}
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-4 container-infos-1 mobile-info-label">Prénom :</div>
        <div className="col-8 container-infos-2 mobile-info-value">
          {user.first_name}
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-4 container-infos-1 mobile-info-label">Email :</div>
        <div className="col-8 container-infos-2 mobile-info-value">
          {user.email}
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-4 container-infos-1 mobile-info-label">
          {isCurrentProfile ? "Mot de passe :" : "Rôle :"}
        </div>
        <div className="col-8 container-infos-2 mobile-info-value">
          {isCurrentProfile ? (
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => handlePasswordClick(user)}
              className="mobile-edit-btn"
            >
              <FontAwesomeIcon icon={faEdit} className="mobile-btn-icon" />
              Modifier
            </Button>
          ) : (
            user.groups
          )}
        </div>
      </div>
      {!isCurrentProfile && (
        <div className="d-flex justify-content-end mt-2 mobile-actions">
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleEdit(user)}
            className="mobile-action-btn me-2"
          >
            <FontAwesomeIcon icon={faPen} className="mobile-btn-icon" />
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleDelete(user.id)}
            className="mobile-action-btn"
          >
            <FontAwesomeIcon icon={faTrash} className="mobile-btn-icon" />
          </Button>
        </div>
      )}
    </div>

        ))}

        {/* Formulaire de création - version mobile */}
  {isCreating && (
    <div className="info-admin-mobile creation-form-card">
  <div className="row mb-2 form-input-row">
    <div className="col-4 form-label">Nom :</div>
    <div className="col-8">
      <input 
        name="last_name" 
        value={creationData.last_name} 
        onChange={onCreationChange}
        placeholder="Nom"
        className="form-control-sm form-input"
      />
    </div>
  </div>
  
  <div className="row mb-2 form-input-row">
    <div className="col-4 form-label">Prénom :</div>
    <div className="col-8">
      <input 
        name="first_name" 
        value={creationData.first_name} 
        onChange={onCreationChange}
        placeholder="Prénom"
        className="form-control-sm form-input"
      />
    </div>
  </div>
  
  <div className="row mb-2 form-input-row">
    <div className="col-4 form-label">Email :</div>
    <div className="col-8">
      <input 
        name="email" 
        value={creationData.email} 
        onChange={onCreationChange}
        placeholder="Email"
        className="form-control-sm form-input"
      />
    </div>
  </div>
  
  <div className="row mb-2 form-input-row">
    <div className="col-4 form-label">Rôle :</div>
    <div className="col-8">
      <select
        name="groups"
        value={creationData.groups?.[0] || ''}
        onChange={(e) => onCreationChange({
          target: {
            name: 'groups',
            value: e.target.value ? [e.target.value] : []
          }
        })}
        className="form-control-sm form-select"
      >
        <option value="">Sélectionner...</option>
        {availableRoles.map(role => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    </div>
  </div>
  
  <div className="form-actions">
    <Button 
      variant="contained" 
      color="success"
      size="small"
      onClick={onSaveNewUser}
      disabled={!creationData.groups?.[0]}
      className="form-submit-btn"
    >
      <FontAwesomeIcon icon={faCircleCheck} className="form-btn-icon" />
    </Button>
    <Button 
      variant="outlined" 
      color="error"
      size="small"
      onClick={onCancelCreation}
      className="form-cancel-btn"
    >
      <FontAwesomeIcon icon={faTrash} className="form-btn-icon" />
    </Button>
  </div>
</div>
  )}
</div>
     

     {/* Modal pour changer le mot de passe */}
     <Modal
  open={passwordModal}
  onClose={handlePasswordCancel}
  aria-labelledby="password-modal-title"
  aria-describedby="password-modal-description"
>
  <Box className="password-modal-box">
    <Typography id="password-modal-title" className="titre2">
      Modification du mot de passe
    </Typography>
             
    {error && (
      <Alert severity="error" className="password-modal-alert">
        {error}
      </Alert>
    )}
             
    {success && (
      <Alert severity="success" className="password-modal-alert">
        Mot de passe modifié avec succès !
      </Alert>
    )}
             
    <Box component="form" onSubmit={handlePasswordSubmit} className="password-form-container">
      <InputLabel className="titre3">
        Ancien mot de passe :
      </InputLabel>
      <TextField
        fullWidth
        type="password"
        name="currentPassword"
        value={passwordData.currentPassword}
        onChange={handlePasswordInputChange}
        className="password-textfield"
      />

      <InputLabel className="titre3">
        Nouveau mot de passe :
      </InputLabel>
      <TextField
        fullWidth
        type="password"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handlePasswordInputChange}
        className="password-textfield"
      />

      <InputLabel className="titre3">
        Confirmez le nouveau mot de passe :
      </InputLabel>
      <TextField
        fullWidth
        type="password"
        name="confirmPassword"
        value={passwordData.confirmPassword}
        onChange={handlePasswordInputChange}
        className="password-textfield"
      />
    </Box>
             
    <Box className="password-buttons-container">
      <Button
        variant="contained"
        onClick={handlePasswordSubmit}
        disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || loading}
        className="bouton bouton-confirmer password-button"
      >
        {loading ? 'Modification...' : 'Confirmer'}
      </Button>
             
      <Button
        variant="outlined"
        onClick={handlePasswordCancel}
        className="bouton bouton-annuler password-button"
      >
        Annuler
      </Button>
    </Box>
  </Box>
</Modal>
    </div>
  );
}