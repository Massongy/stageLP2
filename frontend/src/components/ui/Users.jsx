import React from 'react';
import { Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

export default function Users({ 
  datausers = [], 
  handleEdit, 
  handleDelete,
  isCreating,
  creationData,
  onCreationChange,
  onSaveNewUser,
  onCancelCreation
}) {
  if (!Array.isArray(datausers)) {
    console.error("datausers n'est pas un tableau :", datausers);
    return null;
  }
  
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
            
            {/* Colonne 3: Rôle */}
            <Box className="container-infos">
              <Box className="container-infos-1">Rôle :</Box>
              <Box className="container-infos-2">{user.groups}</Box>
            </Box>
            
            {/* Colonne 4: Icônes */}
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
          </Box>
        ))}

        {/* Ligne de création */}
        {isCreating && (
          <Box className="info-admin" sx={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr auto',
            gap: '16px',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
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
                  className="form-control-sm"
                  style={{ width: '100%', marginBottom: '4px' }}
                />
                <input 
                  name="first_name" 
                  value={creationData.first_name} 
                  onChange={onCreationChange}
                  placeholder="Prénom"
                  className="form-control-sm"
                  style={{ width: '100%' }}
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
                  className="form-control-sm"
                  style={{ width: '100%' }}
                />
              </Box>
            </Box>
            
            {/* Colonne 3: Rôle */}
            <Box className="container-infos">
              <Box className="container-infos-1">Rôle :</Box>
              <Box className="container-infos-2">
                <select 
                  name="groups" 
                  value={creationData.groups[0] || ''} 
                  onChange={onCreationChange}
                  className="form-control-sm"
                  style={{ width: '100%' }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="1">Gestionnaire Acceor</option>
                  <option value="2">Gestionnaire Options</option>
                  <option value="3">Utilisateur Acceor</option>
                  <option value="4">Utilisateur Options</option>
                </select>
              </Box>
            </Box>
            
            {/* Colonne 4: Actions */}
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="contained" 
                color="success" 
                size="small"
                onClick={onSaveNewUser}
                sx={{ minWidth: '40px' }}
              >
                <FontAwesomeIcon icon={faCircleCheck} />
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                onClick={onCancelCreation}
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
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Rôle :</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {user.groups}
              </div>
            </div>
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
          </div>
        ))}
      </div>
    </div>
  );
}