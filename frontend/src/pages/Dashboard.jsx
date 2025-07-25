// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DataTable from '../components/ui/DataTable.jsx';
import PreviewTabs from '../components/ui/PreviewTabs.jsx';
import { useQuotesQuotes } from '../hooks/useQuotesQuotes';
import  {useSearch } from '../hooks/useSearch.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SearchModal from '../components/ui/SearchModal.jsx';

export default function Dashboard() {
  const [selectedReference, setSelectedReference] = useState(null);
  const [openedRowRef, setOpenedRowRef] = useState(null);
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  

  // Récupération des données avec le hook useQuotesQuotes
  const { quotes: tableData, loading, error } = useQuotesQuotes();

  // Hook de recherche
  const {
    searchModalOpen,
    openSearchModal,
    closeSearchModal,
    performSearch
  } = useSearch(tableData, setFilterModel, setOpenedRowRef);

  const quoteId = tableData?.find(quote => 
    quote.reference_id_SI === openedRowRef || 
    quote.reference_id_SI?.toString() === openedRowRef
  )?.id || null;
  
  const handlePreview = (row) => {
    const reference = row.reference_id_SI;
    setSelectedReference(reference);
    setOpenedRowRef(prev => (prev === reference ? null : reference));
  };

  // Exposer la fonction openSearchModal globalement pour le header
  useEffect(() => {
    window.openSearchModal = openSearchModal;
    return () => {
      delete window.openSearchModal;
    };
  }, [openSearchModal]);

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
                data={tableData}
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

      {/* Modal de recherche */}
      <SearchModal
        open={searchModalOpen}
        onClose={closeSearchModal}
        onSearch={performSearch}
        tableData={tableData}
      />
    </Box>
  );
}