import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import "react-datepicker/dist/react-datepicker.css";
import RemoveIcon from '@mui/icons-material/Remove';
import '../../assets/InfoDemande.css'
import '../../assets/Theme.css'

export default function InfoDemande({ data, onDataChange }) {
  // Définition des champs éditables et non-éditables
  const editableFields = [
    
    'Statut',
    'Semaine N°',
    'Date du 1er appel',
    'Date du dernier appel',
    'Nombre d\'appels'
  ];
  
  const nonEditableFields = [
    'Référence',
    'Email',
    'Nom',
    'Prénom',
    'Numéro de téléphone'
  ];

  // Initialisation des champs
  const [fields, setFields] = useState(
    data.reduce((acc, item) => {
      acc[item.cle] = item.cle === 'Nombre d\'appels' 
        ? (parseInt(item.valeurs[0], 10) || 0) 
        : item.valeurs;
      return acc;
    }, {})
  );

  // État pour les données de l'API (version test)
  

  // Fonction pour sauvegarder les données éditables
  const saveEditableData = async (updatedFields) => {
    try {
      // Filtrer seulement les champs éditables
      const editableData = {};
      editableFields.forEach(field => {
        if (updatedFields[field] !== undefined) {
          editableData[field] = updatedFields[field];
        }
      });

      // TODO: Remplacer par votre véritable appel API pour sauvegarder
      // const response = await fetch('YOUR_SAVE_API_URL', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editableData)
      // });
      
      console.log('Données éditables à sauvegarder:', editableData);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Changement des dates - mise à jour directe dans fields
  const handleFirstCallDateChange = (newValue) => {
    setFields(prevFields => {
      const updated = { 
        ...prevFields, 
        'Date du 1er appel': newValue ? [newValue.toISOString().split('T')[0]] : [''] 
      };
      onDataChange && onDataChange(updated);
      saveEditableData(updated);
      return updated;
    });
  };

  const handleLastCallDateChange = (newValue) => {
    setFields(prevFields => {
      const updated = { 
        ...prevFields, 
        'Date du dernier appel': newValue ? [newValue.toISOString().split('T')[0]] : [''] 
      };
      onDataChange && onDataChange(updated);
      saveEditableData(updated);
      return updated;
    });
  };

  // Mettre à jour d'autres champs (seulement si éditable)
  const handleFieldChange = (event, cle) => {
    // Vérifier si le champ est éditable
    if (!editableFields.includes(cle)) {
      return; // Ne pas permettre la modification des champs non-éditables
    }

    const newValues = event.target.value;
    setFields(prevFields => {
      const updated = { ...prevFields, [cle]: newValues };
      onDataChange && onDataChange(updated);
      saveEditableData(updated);
      return updated;
    });
  };

  // Augmenter ou diminuer le nombre d'appels
  const handleCallsChange = (operation) => {
    const currentCalls = parseInt(fields['Nombre d\'appels'], 10) || 0;
    let newCalls = currentCalls;
    if (operation === 'increase') {
      newCalls = currentCalls + 1;
    } else if (operation === 'decrease' && currentCalls > 0) {
      newCalls = currentCalls - 1;
    }

    setFields(prev => {
      const updated = { ...prev, "Nombre d'appels": newCalls };
      onDataChange && onDataChange(updated);
      saveEditableData(updated);
      return updated;
    });
  };

  // Fonction utilitaire pour obtenir la valeur de date
  const getDateValue = (cle) => {
    const dateValue = fields[cle];
    if (!dateValue || !dateValue[0]) return '';
    
    // Si c'est déjà au format YYYY-MM-DD, le retourner tel quel
    if (dateValue[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue[0];
    }
    
    // Sinon, essayer de convertir depuis le format DD/MM/YYYY
    try {
      const parts = dateValue[0].split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de date:', error);
    }
    
    return '';
  };

  // Fonction pour vérifier si un champ est éditable
  const isFieldEditable = (cle) => {
    return editableFields.includes(cle);
  };

  // Styles pour les champs de date
  const dateFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      height: '40px',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 12px',
      fontSize: '14px',
    },
    '& input[type="date"]': {
      padding: '8px 12px',
      fontSize: '14px',
    },
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      cursor: 'pointer',
    },
  };

  // Styles pour les champs non-éditables
  const nonEditableFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '8px',
      height: '40px',
      '& fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 12px',
      fontSize: '14px',
      color: '#666',
    },
  };

  return (
    <Box className="container-fluid">
      <div className="row">
        {data.map((item, index) => (
          <div key={index} className="col-md-4 mb-3">
            <Box className="blocinfo">
              <Box className="titre3">{item.cle}:</Box>
              <Box className="champ ">
                {/* Si c'est une date */}
                {item.cle === 'Date du 1er appel' ? (
                  <TextField
                    type="date"
                    value={getDateValue('Date du 1er appel')}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleFirstCallDateChange(date);
                    }}
                    sx={dateFieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : item.cle === 'Date du dernier appel' ? (
                  <TextField
                    type="date"
                    value={getDateValue('Date du dernier appel')}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      handleLastCallDateChange(date);
                    }}
                    sx={dateFieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                ) : item.cle === 'Statut' ? (
                  <FormControl fullWidth className="blocinfo-demande-texte">
                    <InputLabel id="status-select-label">Statut</InputLabel>
                    <Select 
                      className="select"
                      labelId="status-select-label"
                      value={fields[item.cle] || ''}
                      onChange={(event) => handleFieldChange(event, item.cle)}
                      label="Statut"
                      disabled={!isFieldEditable(item.cle)}
                    >
                      <MenuItem value="en cours">En cours</MenuItem>
                      <MenuItem value="répondu">Répondu</MenuItem>
                    </Select>
                  </FormControl>
                ) : item.cle === 'Nombre d\'appels' ? (
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => handleCallsChange('decrease')} aria-label="réduire">
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={fields['Nombre d\'appels'] || 0}
                      onChange={(event) => handleFieldChange(event, 'Nombre d\'appels')}
                      type="number"
                      inputProps={{ min: 0 }}
                      fullWidth
                      style={{
                        marginLeft: 8,
                        marginRight: 8,
                        minWidth: 80,
                      }}
                      disabled={!isFieldEditable(item.cle)}
                    />
                    <IconButton onClick={() => handleCallsChange('increase')} aria-label="augmenter">
                      <AddIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <TextField 
                    className="blocinfo-demande-texte texte2"
                    value={fields[item.cle] || ''}
                    onChange={(event) => handleFieldChange(event, item.cle)}
                    fullWidth
                    multiline={isFieldEditable(item.cle)}
                    rows={isFieldEditable(item.cle) ? 2 : 1}
                    disabled={!isFieldEditable(item.cle)}
                    sx={!isFieldEditable(item.cle) ? nonEditableFieldStyles : {}}
                  />
                )}
              </Box>
            </Box>
          </div>
        ))}
      </div>
    </Box>
  );
}