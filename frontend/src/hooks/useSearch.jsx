// src/hooks/useSearch.js
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

  const performSearch = useCallback((reference) => {
    // Si on n'est pas sur le dashboard, naviguer vers le dashboard
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }

    // Appliquer le filtre pour afficher uniquement la ligne concernée
    setTimeout(() => {
      setFilterModel({
        items: [
          {
            field: 'reference_id_SI',
            operator: 'equals',
            value: reference
          }
        ]
      });

      // Ouvrir automatiquement la prévisualisation de la ligne trouvée
      setOpenedRowRef(reference);
    }, 100); // Petit délai pour s'assurer que la navigation est terminée

  }, [navigate, location.pathname, setFilterModel, setOpenedRowRef]);

  return {
    searchModalOpen,
    openSearchModal,
    closeSearchModal,
    performSearch
  };
};