// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/ui/DataTable.jsx';
import PreviewTabs from '../components/ui/PreviewTabs.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export default function Dashboard() {

  
  const [selectedReference, setSelectedReference] = useState(null);
  const [openedRowRef, setOpenedRowRef] = useState(null); // état pour l'état du bouton
  const [filterModel, setFilterModel] = React.useState({ items: [] }); // gérer état filtre
  const [tableData, setTableData] = useState([]); // Nouvel état pour les données

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulation de la réponse API (à remplacer par la vraie API)
        const res = [
          {
            "id": 1,
            "order_id": "string",
            "reference": "string1",
            "firstname": "string",
            "lastname": "string",
            "phone": "string",
            "customer_email": "user@example.com",
            "weeknumber": 2147483647,
            "call_count": 2147483647,
            "date_first_call": "2025-07-03T15:07:18.733Z",
            "date_last_call": "2025-07-03T15:07:18.733Z",
            "created_at": "2025-07-03T15:07:18.733Z",
            "updated_at": "2025-07-03T15:07:18.733Z",
            "idEtablissement": "strin",
            "reference_id_SI": 2147483647,
            "status": 0
          },
          {
            "id": 2,
            "order_id": "string",
            "reference": "string2",
            "firstname": "string",
            "lastname": "string",
            "phone": "string",
            "customer_email": "user@example.com",
            "weeknumber": 2147483647,
            "call_count": 2147483647,
            "date_first_call": "2025-07-03T15:07:18.733Z",
            "date_last_call": "2025-07-03T15:07:18.733Z",
            "created_at": "2025-07-03T15:07:18.733Z",
            "updated_at": "2025-07-03T15:07:18.733Z",
            "idEtablissement": "strin",
            "reference_id_SI": 2147483648,
            "status": 0
          },
          {
            "id": 3,
            "order_id": "string",
            "reference": "string2",
            "firstname": "string",
            "lastname": "string",
            "phone": "string",
            "customer_email": "user@example.com",
            "weeknumber": 2147483647,
            "call_count": 2147483647,
            "date_first_call": "2025-07-03T15:07:18.733Z",
            "date_last_call": "2025-07-03T15:07:18.733Z",
            "created_at": "2025-07-03T15:07:18.733Z",
            "updated_at": "2025-07-03T15:07:18.733Z",
            "idEtablissement": "strin",
            "reference_id_SI": 2147483649,
            "status": 0
          }
        ];

        console.log('Données reçues:', res);
        setTableData(res);

      } catch (error) {
        console.error('Erreur de chargement des données :', error);
      }
    }

    fetchData();
  }, []);

  
  const handlePreview = (row) => {
    const reference = row.reference_id_SI;
    setSelectedReference(reference);
    setOpenedRowRef(prev => (prev === reference ? null : reference));
  };

  return (
    <>
   
    <Box sx={{display: 'flex', width: '100%' }}>
      <Box sx={{width: '65%' }}>

      {// passe la fonction handle preview en paramètre de la propriété onPreviewd
      }
        <DataTable 
        data={tableData}
        onPreview={handlePreview}
        openedRowRef={openedRowRef}   
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        disableRowSelectionOnClick
          
      />
      </Box>
      <Box sx={{width: '35%' }}>
        <PreviewTabs openedRowRef={openedRowRef}  />
      </Box>
    </Box>
    </>
  );
}