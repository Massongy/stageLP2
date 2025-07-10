import React from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import '../../assets/Theme.css';
import '../../assets/QuestionsReponses.css';

// Configuration de dayjs en français
dayjs.locale('fr');

export default function QuestionsReponses({
  question,
  reponses,
  questionId,
  isDateInput = false,
  selectedReponse,
  selectedDate,
  onReponseChange,
  onDateChange,
}) 

{
  const showDatePicker = isDateInput || question === "Si oui, à quelle date ?";

  const handleReponseChange = (reponse) => {
    if (onReponseChange) {
      onReponseChange(reponse);
    }
  };

  const handleDateChange = (newDate) => {
    // newDate est un objet dayjs ou null
    if (onDateChange) {
      onDateChange(newDate ? newDate.format('DD/MM/YYYY') : null);
    }
    console.log('Date sélectionnée formatée:', newDate ? newDate.format('DD/MM/YYYY') : null);
  };

  return (
    <Box className="info-demande">
      <Box className="container-demande">
        <Box className="titre3 container-demande-1">{question}</Box>
        <Box className="container-demande-2">
          {showDatePicker ? (
            <Box className="reponse-option calendrier">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <DatePicker
                  value={selectedDate}  // Ici, selectedDate est un objet dayjs ou null
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      error: false,
                      placeholder: 'JJ/MM/AAAA',
                    },
                  }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Box>
          ) : (
            reponses &&
            reponses.map((reponse, index) => (
              <Box key={index} className="texte2 reponse-option">
                <label>
                  <input
                    type="radio"
                    name={`reponse-${questionId}`}
                    value={reponse}
                    checked={selectedReponse === reponse}
                    onChange={() => handleReponseChange(reponse)}
                    style={{ display: 'none' }}
                  />
                  <span>{reponse}</span>
                </label>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
