// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/ui/datatable.jsx';
import PreviewTabs from '../components/ui/preview.jsx';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


export default function Dashboard() {

  
  const [selectedReference, setSelectedReference] = useState(null);
  const [openedRowId, setOpenedRowId] = useState(null); // état pour l'état du bouton
  const [filterModel, setFilterModel] = React.useState({ items: [] }); // gérer état filtre


  
  const handlePreview = (id) => {
    setSelectedReference(id);
    setOpenedRowId(prev => (prev === id ? null : id));
  };

  return (
    <>
   
    <Box sx={{ display: 'flex', width: 1920, height: 950}}>
      <Box sx={{ width: 1178, height: 950 }}>

      {// passe la fonction handle preview en paramètre de la propriété onPreviewd
      }
        <DataTable onPreview={handlePreview} openedRowId={openedRowId}   
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          disableRowSelectionOnClick
          
      />
      </Box>
      <Box sx={{  width: 740, height: 950 }}>
        <PreviewTabs openedRowId={openedRowId}  />
      </Box>
    </Box>
    </>
  );
}