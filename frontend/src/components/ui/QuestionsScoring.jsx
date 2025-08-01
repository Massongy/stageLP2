import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BlocQuestionsReponses from './BlocQuestionsReponses';
import dayjs from 'dayjs';

export default function QuestionsScoring({ onDataChange, questionsData, reponsesData, questionnaireData }) {
  // Pour chaque question, récupérer ses réponses et dire si c'est une date (id === 4 ici)
  const questionsReponsesData = questionsData.map(question => {
    const reponses = reponsesData.filter(reponse => reponse.question === question.id);
    return {
      ...question,
      reponses,
      isDateInput: question.id === 4, // adapte selon ton critère pour les dates
    };
  });

  const [answers, setAnswers] = useState({});

  // Initialiser answers avec questionnaireData si disponible
  useEffect(() => {
    if (questionnaireData && Object.keys(questionnaireData).length > 0) {
      setAnswers(questionnaireData);
    }
  }, [questionnaireData]);

  // Trouver l'id de la "réponse date" associée à une question date (ex: dans reponsesData)
  const getDateReponseId = (questionId) => {
    console.log('contenu de reponsesData', reponsesData);
    const dateReponse = reponsesData.find(r =>
      r.question === questionId &&
      (r.value === 'Date Input Value')
    );

    console.log('🔍 DEBUG getDateReponseId:', dateReponse);
    return dateReponse ? dateReponse.id : null;
  };

  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  // Gérer changement des réponses ou date
  const handleAnswerChange = (questionId, { reponse, date }) => {
    console.log('🔍 DEBUG handleAnswerChange:');
    console.log('- questionId:', questionId);
    console.log('- reponse reçue:', reponse);
    console.log('- date reçue:', date);
    
    setAnswers(prev => {
      const oldEntry = prev[questionId] || {};
      let newReponse = oldEntry.reponse;
      let newDate = oldEntry.date;

      if (date !== undefined) {
        // Si on modifie la date, forcer reponse à l'id associée à la date
        const dateReponseId = getDateReponseId(questionId);
        console.log('- dateReponseId trouvé:', dateReponseId);
        newReponse = dateReponseId;
        newDate = date;
      } else if (reponse !== undefined) {
        // Si on modifie la réponse classique, mettre la réponse et annuler la date
        newReponse = reponse;
        newDate = null;
      }

      const newEntry = {
        reponse: newReponse,
        date: newDate
      };
      
      console.log('- Nouvelle entrée pour questionId', questionId, ':', newEntry);

      return {
        ...prev,
        [questionId]: newEntry
      };
    });
  };

  // Fonction pour obtenir la date sélectionnée formatée pour le DatePicker
  const getSelectedDate = (questionId) => {
    const dateValue = answers[questionId]?.date;
    if (!dateValue) return null;
    
    // Si c'est une chaîne DD/MM/YYYY, la convertir en objet dayjs
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      return dayjs(dateValue, 'DD/MM/YYYY');
    }
    
    // Si c'est une chaîne YYYY-MM-DD, la convertir en objet dayjs
    if (typeof dateValue === 'string' && dateValue.includes('-')) {
      return dayjs(dateValue);
    }
    
    // Si c'est déjà un objet dayjs, le retourner tel quel
    if (dayjs.isDayjs(dateValue)) {
      return dateValue;
    }
    
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '90px' }}>
      {questionsReponsesData.map(item => (
        <BlocQuestionsReponses
          key={item.id}
          question={item.label}
          reponses={item.reponses}
          questionId={item.id}
          isDateInput={item.isDateInput}
          selectedDate={getSelectedDate(item.id)}
          selectedReponse={answers[item.id]?.reponse || ''}
          onReponseChange={(reponse) => handleAnswerChange(item.id, { reponse })}
          onDateChange={(date) => {
            // ✅ CORRECTION : Gérer date + réponse en un seul appel
            if (date) {
              const dateReponseId = getDateReponseId(item.id);
              handleAnswerChange(item.id, { reponse: dateReponseId, date });
            } else {
              handleAnswerChange(item.id, { date });
            }
          }}
        />
      ))}
    </Box>
  );
}