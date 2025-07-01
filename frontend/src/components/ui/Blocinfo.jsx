import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function BlocInfo({ data }) {
  // Initialisation des champs
  const [fields, setFields] = useState(
    data.reduce((acc, item) => {
      acc[item.cle] = item.cle === 'Nombre d\'appels' 
        ? (parseInt(item.valeurs[0], 10) || 0) 
        : item.valeurs;
      return acc;
    }, {})
  );
  
  const [firstCallDate, setFirstCallDate] = useState(
    new Date(data.find(item => item.cle === 'Date du 1er appel')?.valeurs[0]) || null
  );
  
  const [lastCallDate, setLastCallDate] = useState(
    new Date(data.find(item => item.cle === 'Date du dernier appel')?.valeurs[0]) || null
  );

  // Changement des dates
  const handleFirstCallDateChange = (newValue) => {
    setFirstCallDate(newValue);
  };

  const handleLastCallDateChange = (newValue) => {
    setLastCallDate(newValue);
  };

  // Mettre à jour d'autres champs
  const handleFieldChange = (event, cle) => {
    const newValues = event.target.value;
    setFields(prevFields => ({
      ...prevFields,
      [cle]: newValues
    }));
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

    // Log la valeur avant et après la modification
    console.log(`Nombre d'appels avant: ${currentCalls}, après: ${newCalls}`);

    setFields(prevFields => ({
      ...prevFields,
      'Nombre d\'appels': newCalls
    }));
  };

  return (
    <Box className="info-admin">
      {data.map((item, index) => (
        <Box key={index} className="container-infos">
          <Box className="container-infos-1">{item.cle}:</Box>
          <Box className="container-infos-2">
            {/* Si c'est une date */}
            {item.cle === 'Date du 1er appel' ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date du 1er appel"
                  inputFormat="dd/MM/yyyy"
                  value={firstCallDate}
                  onChange={handleFirstCallDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : item.cle === 'Date du dernier appel' ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date du dernier appel"
                  inputFormat="dd/MM/yyyy"
                  value={lastCallDate}
                  onChange={handleLastCallDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : item.cle === 'Statut' ? (
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Statut</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={fields[item.cle] || ''}
                  onChange={(event) => handleFieldChange(event, item.cle)}
                  label="Statut"
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
                {/* Affichage dynamique de la valeur des appels */}
                <TextField
                  value={fields['Nombre d\'appels'] || 0}  // Affiche la valeur mise à jour
                  onChange={(event) => handleFieldChange(event, 'Nombre d\'appels')}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  style={{
                    marginLeft: 8,
                    marginRight: 8,
                    minWidth: 80,  // Ajout de la largeur minimale
                  }}
                  disabled // Désactive la saisie manuelle
                />
                <IconButton onClick={() => handleCallsChange('increase')} aria-label="augmenter">
                  <AddIcon />
                </IconButton>
              </Box>
            ) : (
              <TextField
                value={fields[item.cle] || ''}
                onChange={(event) => handleFieldChange(event, item.cle)}
                fullWidth
                multiline
                rows={2}
              />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
