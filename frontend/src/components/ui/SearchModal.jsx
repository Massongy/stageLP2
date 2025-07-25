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

const SearchModal = ({ open, onClose, onSearch, tableData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    // Recherche par nom ou référence
    const results = tableData?.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      // Recherche par référence (conversion en string pour la comparaison)
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
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '300px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          Rechercher une demande
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Nom ou numéro de référence"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Saisissez un nom ou une référence..."
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
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
                      {(item.nom || item.name || item.client) && (
                        <Typography variant="body2" color="text.secondary">
                          {item.nom || item.name || item.client}
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

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="secondary">
          Annuler
        </Button>
        <Button 
          onClick={handleSearch} 
          variant="contained" 
          disabled={!searchTerm.trim()}
          startIcon={<SearchIcon />}
        >
          Rechercher
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchModal;