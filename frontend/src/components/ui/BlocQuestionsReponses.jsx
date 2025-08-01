import React from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import '../../assets/style.css';
import '../../assets/blocquestionsreponses.css';

// Configuration de dayjs en français
dayjs.locale('fr');

export default function BlocQuestionsReponses({
  question,
  reponses,
  questionId,
  isDateInput = false,
  selectedReponse,
  selectedDate,
  onReponseChange,
  onDateChange,
}) {
  const showDatePicker = isDateInput || question === "Quelle est la date de l'évènement ?";

  const handleReponseChange = (reponse) => {
    if (onReponseChange) {
      onReponseChange(reponse);
    }
  };

  const handleDateChange = (newDate) => {
  const formattedDate = newDate ? newDate.format('DD/MM/YYYY') : null;
  
  console.log('🔍 DEBUG handleDateChange:');
  console.log('- newDate:', newDate);
  console.log('- formattedDate:', formattedDate);

  if (onDateChange) {
    onDateChange(formattedDate);
  }
};
  // Vérification que reponses est un tableau avant d'utiliser .map()
  const validReponses = Array.isArray(reponses) ? reponses : [];

  return (
    <Box className="bloc-titre-champ">
      <Box className="titre3">{question}</Box>
      <Box className="champ champ-scoring">
        {showDatePicker ? (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <DatePicker
                className="date-scoring"
                value={selectedDate} // Ici, selectedDate est un objet dayjs ou null
                onChange={handleDateChange}
                inputFormat="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    placeholder: 'JJ/MM/AAAA',
                  },
                }}
                minDate={dayjs()}
              />
            </LocalizationProvider>
          </Box>
        ) : (
          validReponses.map((reponse, index) => (
            <Box key={index} className={`texte2 bouton-reponse ${selectedReponse === reponse.id ? 'selected' : ''}`}>
              <label>
                <input
                  type="radio"
                  name={`reponse-${questionId}`}
                  value={reponse.value}
                  checked={selectedReponse === reponse.id}
                  onChange={() => handleReponseChange(reponse.id)}
                  style={{ display: 'none' }}
                />
                <span>{reponse.value}</span>
              </label>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
