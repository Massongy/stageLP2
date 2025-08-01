import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default function ConfirmTransferIcon({ row, onConfirm }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="icone-datatable" style={{ cursor: 'pointer' }} />
      </IconButton>
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  PaperProps={{
    sx: {
      textAlign: 'center', // centre le contenu global
    }
  }}
>
  <DialogTitle>Confirmer le transfert</DialogTitle>

  <DialogContent>
    <Typography>
      Souhaitez-vous confirmer le transfert pour la référence&nbsp;{row.reference_id_SI}&nbsp;?
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
      onClick={() => setOpen(false)}
    >
      Annuler
    </Button>

    <Button
      variant="contained"
      sx={{
        backgroundColor: '#D4C7B5',    // fond couleur pour le bouton Oui
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: '#D4C7B5',   // reste la même couleur au hover
          boxShadow: 'none',
          opacity: '0.85',            // pas d'ombre au hover
        }
      }}
      onClick={() => {
        setOpen(false);
        onConfirm(row.id);
      }}
    >
      Oui
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
}
