import React, { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "react-datepicker/dist/react-datepicker.css";
import '../../assets/infodemande.css';
import '../../assets/style.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

export default function InfoDemande({ data, onDataChange }) {
  // Key mapping (renames keys for display)
  const keyMap = {
    call_count: "Nombre d'appels",
    date_first_call: "Date du 1er appel",
    date_last_call: "Date du dernier appel",
    weeknumber: "Semaine N°",
    reference_id_SI: "Référence",
    customer_email: "Email",
    lastname: "Nom",
    firstname: "Prénom",
    phone: "Numéro de téléphone"
  };

  // 2. Transform data SAFELY
  const mappedData = React.useMemo(() => {
    const source = Array.isArray(data) ? data : [data || {}];
    return source.map(item => {
      const renamedItem = {};
      Object.keys(item).forEach(key => {
        renamedItem[keyMap[key] || key] = item[key];
      });
      return renamedItem;
    });
  }, [data]);

  // 3. Initialize/update fields when mappedData changes
  const [localFields, setLocalFields] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    if (!isEditing && mappedData.length > 0) {
      setLocalFields(mappedData[0]);
    }
  }, [mappedData, isEditing]);

  const allowedFields = [
    "Référence", "Prénom", "Nom", "Numéro de téléphone", 
    "Email", "Semaine N°", "Nombre d'appels",
    "Date du 1er appel", "Date du dernier appel"
  ];

  const editableFields = [
    "Prénom", "Nom", "Numéro de téléphone", 
    "Email", "Semaine N°", "Nombre d'appels",
    "Date du 1er appel", "Date du dernier appel"
  ];

  const handleFieldChange = (key, value) => {
    setIsEditing(true);
    const updatedFields = { ...localFields, [key]: value };
    setLocalFields(updatedFields);
    onDataChange?.(updatedFields);
  };

  const handleDateChange = (key, dateValue) => {
    handleFieldChange(key, dateValue ? dateValue + 'T00:00:00' : '');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const handleCallsChange = (operation) => {
    const current = parseInt(localFields["Nombre d'appels"], 10) || 0;
    const newCount = operation === 'increase' ? current + 1 : Math.max(0, current - 1);
    handleFieldChange("Nombre d'appels", newCount);
  };

  const isEditable = (key) => editableFields.includes(key);

  return (
    <Box className="container-fluid">
      <div className="row">
        {Object.entries(localFields)
          .filter(([key]) => allowedFields.includes(key))
          .map(([key, value]) => (
            <div key={key} className="col-md-4 mb-3">
              <Box className="bloc-titre-champ">
                <Box className="titre3">
                  {key}:
                </Box>
                
                <Box className="champ">
                     {key === 'Date du 1er appel' || key === 'Date du dernier appel' ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                      <DatePicker className="date-infodemande"
                        value={value ? dayjs(value) : null}
                        onChange={(newValue) => handleDateChange(key, newValue ? newValue.format('YYYY-MM-DD') : '')}
                        format="DD/MM/YYYY"
                        disabled={!isEditable(key)}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: { 
                              backgroundColor: isEditable(key) ? 'white' : '#f5f5f5',
                              '& .MuiInputBase-input': {
                                color: isEditable(key) ? '#333' : '#666'
                              }
                            },
                            placeholder: 'JJ/MM/AAAA',
                          },
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                      </LocalizationProvider>
                        ) : key === "Nombre d'appels" ? (
                      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                      
                      <IconButton
                        onClick={() => handleCallsChange('decrease')}
                        disabled={!isEditable(key) || !value || value <= 0}
                        sx={{
                          color: '#656565', // couleur normale
                          '& .MuiSvgIcon-root': { color: '#656565' },
                          
                          '&.Mui-disabled .MuiSvgIcon-root': { color: '#bbb' }
                        
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        value={value || 0}
                        onChange={(e) => handleFieldChange(key, parseInt(e.target.value) || 0)}
                        type="number"
                        inputProps={{ min: 0 }}
                        disabled={!isEditable(key)}
                        variant="outlined"
                        sx={{
                          mx: 1,
                          flex: '1 1 auto',
                          '& fieldset': { border: 'none' },
                          '& .MuiInputBase-root': {
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                            padding: 0,
                            color: '#656565',             // couleur du nombre
                          },
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#656565', // assure la couleur si désactivé
                          }
                        }}
                      />

                      <IconButton
                        onClick={() => handleCallsChange('increase')}
                        disabled={!isEditable(key)}
                        sx={{
                          color: '#656565', // couleur normale
                          '& .MuiSvgIcon-root': { color: '#656565' },
                          
                          '&.Mui-disabled .MuiSvgIcon-root': { color: '#bbb' }
                        }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
               

                    ) : (
                      <TextField className="champ"
                        value={value || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        fullWidth
                        disabled={!isEditable(key)}
                      
                        
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