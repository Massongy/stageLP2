import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSearch = (tableData, setFilterModel, setOpenedRowRef) => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openSearchModal = useCallback(() => {
    setSearchModalOpen(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setSearchModalOpen(false);
  }, []);

  const performSearch = (reference) => {
  console.log('[performSearch] AVANT setFilterModel - reference:', reference);
  
  const newFilterModel = {
    items: [{
      field: 'reference_id_SI', // Doit correspondre exactement au field des colonnes
      operator: 'equals',
      value: reference.toString() // Conversion explicite en string
    }]
  };
  
  console.log('[performSearch] newFilterModel à appliquer:', newFilterModel);
  
  // Appel synchrone pour s'assurer que le state est mis à jour
  setFilterModel(newFilterModel);
  
  // Attendez le prochain tick du cycle d'événements pour ouvrir la row
  setTimeout(() => {
    console.log('[performSearch] setOpenedRowRef avec:', reference);
    setOpenedRowRef(reference);
  }, 0);
};

  return {
    searchModalOpen,
    openSearchModal,
    closeSearchModal,
    performSearch
  };
};