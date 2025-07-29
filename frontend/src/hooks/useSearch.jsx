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
  
  const newFilterModel = {
    items: [{
      field: 'reference_id_SI', // Doit correspondre exactement au field des colonnes
      operator: 'equals',
      value: reference.toString() // Conversion explicite en string
    }]
  };
  
  
  // Appel synchrone pour s'assurer que le state est mis à jour
  setFilterModel(newFilterModel);
  
  // Attendez le prochain tick du cycle d'événements pour ouvrir la row
  setTimeout(() => {
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