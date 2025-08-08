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
  
  const keyMap = {
    call_count: "Nombre d'appels",
    date_first_call: "Date du 1er appel",
    date_last_call: "Date du dernier appel",
    weeknumber: "Semaine N°",
    reference: "Référence",
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

  const [emailError, setEmailError] = useState('');
const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};
  const handleFieldChange = (key, value) => {
  setIsEditing(true);
  const updatedFields = { ...localFields, [key]: value };
  setLocalFields(updatedFields);
  onDataChange?.(updatedFields);

  if (key === 'Email') {
    if (!validateEmail(value)) {
      setEmailError('Format d’email invalide');
    } else {
      setEmailError('');
    }
  }
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

  // Fonction pour valider et formater les inputs spéciaux
  const handleSpecialInputChange = (key, value) => {
    let processedValue = value;

    if (key === "Numéro de téléphone") {
      // Ne garder que les chiffres pour le numéro de téléphone
      processedValue = value.replace(/\D/g, '');
    } else if (key === "Semaine N°") {
      // Ne garder que les chiffres pour le numéro de semaine
      processedValue = value.replace(/\D/g, '');
      // Optionnel: limiter entre 1 et 53 (nombre max de semaines dans une année)
      const weekNum = parseInt(processedValue);
      if (weekNum > 53) {
        processedValue = '53';
      }
    }

    handleFieldChange(key, processedValue);
  };

  // Fonction pour déterminer le type d'input
  const getInputType = (key) => {
    if (key === "Email") return "email";
    if (key === "Numéro de téléphone" || key === "Semaine N°") return "tel";
    return "text";
  };

  // Fonction pour déterminer le pattern de validation
  const getInputPattern = (key) => {
    if (key === "Numéro de téléphone" || key === "Semaine N°") return "[0-9]*";
    return undefined;
  };

  const isEditable = (key) => editableFields.includes(key);
  

  return (
    <Box className="row">
      
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
                            fullWidth: true,
                            placeholder: 'JJ/MM/AAAA',
                             sx: { height: '40px' }
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
                        
                              color: '#656565',
                              '& .MuiSvgIcon-root': {
                                fontSize: '12px', 
                                ml: '10px',// icône plus petite que "small"
                              },
                              '&.Mui-disabled .MuiSvgIcon-root': {
                                color: '#bbb',
                              },
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
                        
                              color: '#656565',
                              '& .MuiSvgIcon-root': {
                                fontSize: '12px',
                                 mr: '10px', // icône plus petite que "small"
                              },
                              '&.Mui-disabled .MuiSvgIcon-root': {
                                color: '#bbb',
                              },
                            }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
               

                    ) : (
                      <TextField
                          className="champ"
                          value={value || ''}
                          onChange={(e) => {
                            if (key === "Numéro de téléphone" || key === "Semaine N°") {
                              handleSpecialInputChange(key, e.target.value);
                            } else {
                              handleFieldChange(key, e.target.value);
                            }
                          }}
                          type={getInputType(key)}
                          inputProps={{
                            pattern: getInputPattern(key),
                            inputMode:
                              key === "Numéro de téléphone" || key === "Semaine N°"
                                ? "numeric"
                                : undefined,
                          }}
                          fullWidth
                          disabled={!isEditable(key)}
                          placeholder={
                            key === "Email"
                              ? "exemple@email.com"
                              : key === "Numéro de téléphone"
                              ? "0123456789"
                              : key === "Semaine N°"
                              ? "1-53"
                              : undefined
                          }
                          // Ajout de la validation email uniquement pour le champ Email
                          error={key === "Email" && Boolean(emailError)}
                          helperText={key === "Email" ? emailError : undefined}
                          sx={{
                            '& p.MuiFormHelperText-root': {
                              position: 'absolute',
                              top: '-41px', // Ajuste cette valeur selon tes besoins
                              left: '40px',
                              color: 'red',
                              backgroundColor: 'rgba(255, 0, 0, 0.1)', // Fond rouge clair
                              padding: '4px 4px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                            }
                          }}
                      />

                    )}
                </Box>
              </Box>
            </div>
          ))}
      
    </Box>
  );
}