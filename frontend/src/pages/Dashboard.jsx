// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/ui/datatable.jsx';
import PreviewTabs from '../components/ui/preview.jsx';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function Dashboard() {

  /* déclaration d'un hook : selectedReference est une constante, dont la valeur sera
  modifiée en utilisant la fonction setSelectedReference, en passant la nouvelle valeur
  en paramatre ('selectedReference(valeur)'), et initialisé à null
  */
  const [selectedReference, setSelectedReference] = useState(null);
  const [openedRowId, setOpenedRowId] = useState(null); // état pour l'état du bouton

  /*
  handlePreview est une constant qui transporte une fonction : paramètre est id, et retourne
  cet id en paramètre de la fonction setSelectedReference ce qui a pour effet
  de modifier la valeur de selectedReference en lui assignant l'id passé en paramètre.
  */
  const handlePreview = (id) => {
    setSelectedReference(id);
    setOpenedRowId(prev => (prev === id ? null : id));
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 1175 }}>

      {// passe la fonction handle preview en paramètre de la propriété onPreviewd
      }
        <DataTable onPreview={handlePreview} openedRowId={openedRowId} className="datatable"  slots={{ toolbar: GridToolbar }}
  initialState={{
    filter: {
      filterModel: {
        items: [{
          columnField: 'Potentiel',
          operatorValue: 'contains',
          value: 'Chaud',
        }],
      },
    },
  }}/>
      </Box>
      <Box sx={{ flex: 1 }}>
        <PreviewTabs openedRowId={openedRowId}  />
      </Box>
    </Box>
  );
}