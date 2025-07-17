import React from 'react';
import { Box, Button } from '@mui/material';

export default function Users({ datausers = [], handleEdit, handleDelete }) {
  if (!Array.isArray(datausers)) {
    console.error("datausers n'est pas un tableau :", datausers);
    return null;
  }
  
  return (
    <div className="container-gestion-compte">
      {/* Version desktop (grands écrans) - inchangée */}
      <div className="d-none d-lg-block">
        {datausers.map((user, i) => (
          <Box key={i} className="info-admin">
            <Box className="container-infos">
              <Box className="container-infos-1">Nom :</Box>
              <Box className="container-infos-2">{user.last_name}</Box>
            </Box>
            <Box className="container-infos">
              <Box className="container-infos-1">Prénom :</Box>
              <Box className="container-infos-2">{user.first_name}</Box>
            </Box>
            <Box className="container-infos">
              <Box className="container-infos-1">Email :</Box>
              <Box className="container-infos-2">{user.email}</Box>
            </Box>
            <Box className="container-infos">
              <Box className="container-infos-1">Groupe :</Box>
              <Box className="container-infos-2">{user.groups}</Box>
            </Box>
            <Box className="container-infos">
              <Box className="container-infos-1">Mot de passe</Box>
              <Box className="container-infos-2">Changer le mot de passe</Box>
            </Box>
            <Button onClick={() => handleEdit(user)}>✏️</Button>{' '}
            <Button onClick={() => handleDelete(user.id)}>🗑️</Button>
          </Box>
        ))}
      </div>
      
      {/* Version mobile (petits écrans) - avec styles harmonisés */}
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
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Groupe :</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                {user.groups}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-4 container-infos-1" style={{ color: '#656565', fontWeight: '500' }}>Mot de passe</div>
              <div className="col-8 container-infos-2" style={{ 
                backgroundColor: '#F5F2EE', 
                padding: '8px',
                color: '#656565'
              }}>
                Changer le mot de passe
              </div>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <Button 
                className="me-2" 
                style={{ 
                  color: '#656565',
                  borderColor: '#D4C7B5',
                  minWidth: '40px'
                }}
                variant="outlined" 
                size="small"
                onClick={() => handleEdit(user)}
              >
                ✏️
              </Button>
              <Button 
                style={{ 
                  color: '#656565',
                  borderColor: '#D4C7B5',
                  minWidth: '40px'
                }}
                variant="outlined" 
                size="small"
                onClick={() => handleDelete(user.id)}
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}