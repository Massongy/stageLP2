// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  const [filterModel, setFilterModel] = useState({ items: [] });



  // Récupération des données avec le hook useQuotesQuotes
  const { quotes: tableData, loading, error } = useQuotesQuotes();

  // Callbacks stables pour useSearch
 const setFilterModelCallback = useCallback((newFilterModel) => {
  console.log('[Dashboard] setFilterModel appelé avec:', newFilterModel);
  setFilterModel(newFilterModel); // Ne créez pas de nouvel objet ici
}, []);

// Ajoutez ce useEffect pour debug :
useEffect(() => {
  console.log('FILTER MODEL UPDATED:', filterModel);
}, [filterModel]);
  const setOpenedRowRefCallback = useCallback((ref) => {
    console.log('[Dashboard] setOpenedRowRef appelé avec:', ref);
    setOpenedRowRef(ref);
  }, []);

  // Hook de recherche avec callbacks stables
  const {
    searchModalOpen,
    openSearchModal,
    closeSearchModal,
    performSearch
  } = useSearch(tableData, setFilterModelCallback, setOpenedRowRefCallback);

  const quoteId = tableData?.find(quote => 
  quote.reference_id_SI === openedRowRef || 
  quote.reference_id_SI?.toString() === openedRowRef
)?.id || null;
  
  const handlePreview = (row) => {
    const reference = row.reference_id_SI; // Utiliser reference_id_SI
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

  console.log('[Dashboard] filterModel:', filterModel);
console.log('[Dashboard] tableData:', tableData);
  const filteredData = tableData?.filter((row) => {
  if (!filterModel?.items?.length) return true;
  
  console.log('[Dashboard] current row:', row);
  console.log('[Dashboard] applying filterModel:', filterModel);

  return filterModel.items.every((filter) => {
    // Récupérer la valeur du champ à filtrer
    let rowValue;
    if (filter.field === 'reference_id_SI') { // Revenir à reference_id_SI
      rowValue = row.reference_id_SI?.toString();
    } else {
      rowValue = row[filter.field]?.toString().toLowerCase();
    }
    
    const filterValue = filter.value?.toString();

    if (filter.operator === 'equals') {
      console.log(`[Comparing] rowValue (${filter.field}):`, rowValue, '===', filterValue);
      
      // Pour reference_id_SI, comparaison stricte
      if (filter.field === 'reference_id_SI') { // Revenir à reference_id_SI
        return rowValue === filterValue;
      }
      
      // Pour les autres champs, comparaison en lowercase
      return rowValue === filterValue.toLowerCase();
    }

    return true;
  });
}) || [];
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
                data={filteredData}
                onPreview={handlePreview}
                openedRowRef={openedRowRef}
                filterModel={filterModel}
                onFilterModelChange={setFilterModelCallback}
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