import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDeleteDialog({ 
  open, 
  onClose, 
  onConfirm, 
  userData 
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          textAlign: 'center',
          borderRadius: '12px',
          padding: '16px'
        }
      }}
    >
      <DialogTitle >
        Confirmer la suppression
      </DialogTitle>

      <DialogContent>
        <Typography>
          Êtes-vous sûr de vouloir supprimer l'utilisateur {userData?.email} ?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          sx={{
            
            color: '#D4C7B5',              // couleur texte du bouton Annuler
        boxShadow: 'none',             // supprime ombre statique
        '&:hover': {
          boxShadow: 'none',           // supprime ombre au hover
          backgroundColor: 'transparent',
          opacity: '0.85', // ou conserver fond par défaut pour pas de coloration
        }
          }}
          onClick={onClose}
        >
          Annuler
        </Button>

        <Button
          variant="contained"
          sx={{backgroundColor: '#D4C7B5',    // fond couleur pour le bouton Oui
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#D4C7B5',   // reste la même couleur au hover
          boxShadow: 'none',
          opacity: '0.85',            // pas d'ombre au hover
        }
          }}
          onClick={onConfirm}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
}