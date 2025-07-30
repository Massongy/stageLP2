import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import LoadingButton from './LoadingButton';
import '../../assets/style.css'
import '../../assets/searchmodal.css'

const SearchModal = ({ open, onClose, onSearch, tableData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // Recherche par nom ou référence
    const results = tableData?.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      // Recherche par référence - utiliser reference_id_SI pour la recherche
      const refMatch = item.reference_id_SI?.toString().toLowerCase().includes(searchLower);
      // Recherche par nom (adaptez selon vos champs)
      const nameMatch = item.lastname?.toLowerCase().includes(searchLower) || 
                       item.client?.toLowerCase().includes(searchLower);
      
      return refMatch || nameMatch;
    }) || [];

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleSelectResult = (item) => {
    
    // Passer la valeur de reference_id_SI (number) à la fonction de recherche
    onSearch(item.reference_id_SI);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog className="dialog-searchmodal"
      open={open} 
      onClose={handleClose}
     
    >
      <DialogTitle >
        
        <IconButton className="custom-close-button"
          aria-label="close"
          onClick={handleClose}
          
        >
          <CloseIcon className="custom-close-icon"  />
        </IconButton>
      </DialogTitle>

      <DialogContent className="dialog-content">
        <Box className="dialog-content-box1-search-modal">
          <TextField className="dialog-content-textfield"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Rechercher une demande par nom, numéro de référence..."
          />   
             
        </Box>

        {hasSearched && (
          <Box>
            {searchResults.length > 0 ? (
              <>
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                  {searchResults.length} résultat(s) trouvé(s) :
                </Typography>
                <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {searchResults.map((item, index) => (
                    <Box
                      key={item.id || index}
                      sx={{
                        p: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                      onClick={() => handleSelectResult(item)}
                    >
                      <Typography variant="body1" fontWeight="medium">
                        Référence: {item.reference_id_SI}
                      </Typography>
                      {(item.nom || item.name || item.client || item.lastname) && (
                        <Typography variant="body2" color="text.secondary">
                          {item.nom || item.name || item.client || item.lastname}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Aucun résultat trouvé pour "{searchTerm}"
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center' }}>
        
        <LoadingButton className="titre2 bouton-rechercher"
          onClick={handleSearch} 
          variant="contained" 
          disabled={!searchTerm.trim()}
          
        >
          Rechercher
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SearchModal;