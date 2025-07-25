// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/ui/DataTable.jsx';
import PreviewTabs from '../components/ui/PreviewTabs.jsx';
import {useQuotesQuotes} from '../hooks/useQuotesQuotes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Dashboard() {
  const [selectedReference, setSelectedReference] = useState(null);
  const [openedRowRef, setOpenedRowRef] = useState(null); // état pour l'état du bouton
  const [filterModel, setFilterModel] = React.useState({ items: [] }); // gérer état filtre

  //récupération des données avec le hook useQuotesQuotes

  const { quotes:tableData, loading, error } = useQuotesQuotes();
 
const quoteId = tableData?.find(quote => 
    quote.reference_id_SI === openedRowRef || 
    quote.reference_id_SI?.toString() === openedRowRef
  )?.id || null;
  
  
  const handlePreview = (row) => {
    const reference = row.reference_id_SI;
    setSelectedReference(reference);
    setOpenedRowRef(prev => (prev === reference ? null : reference));
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <div className="container-fluid">
        <div className="row">
          {/* Tableau - Prend toute la largeur sur mobile, 8 colonnes sur desktop */}
          <div className="col-12 col-lg-8 mb-3 mb-lg-0">
            <Box sx={{ 
              width: '100%',
              '& .MuiDataGrid-root': {
                borderRadius: 1,
                border: 'none',
              }
            }}>
              <DataTable
                //passe les données concernant les quotes
                data={tableData}
                // passe la fonction handle preview en paramètre de la propriété onPreview
                onPreview={handlePreview}
                openedRowRef={openedRowRef}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                disableRowSelectionOnClick
              />
            </Box>
          </div>
          
          {/* Preview - Passe en dessous sur mobile, 4 colonnes sur desktop */}
          <div className="col-12 col-lg-4">
            <Box sx={{ 
              width: '100%',
              height: '100%',
              '& .MuiTabs-root': {
                borderRadius: 1,
              }
            }}>
              <PreviewTabs openedRowRef={openedRowRef} quoteId={quoteId} />
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}