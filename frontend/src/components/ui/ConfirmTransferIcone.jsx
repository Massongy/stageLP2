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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmer le transfert</DialogTitle>
        <DialogContent>
          <Typography>
            Souhaitez-vous confirmer le transfert pour la référence&nbsp;{row.reference_id_SI} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
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
