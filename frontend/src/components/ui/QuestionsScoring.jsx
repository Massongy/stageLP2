import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BlocQuestionsReponses from './BlocQuestionsReponses';
import dayjs from 'dayjs';

export default function QuestionsScoring({ onDataChange, questionsData, reponsesData }) {
  // Pour chaque question, récupérer ses réponses et dire si c’est une date (id === 4 ici)
  const questionsReponsesData = questionsData.map(question => {
    const reponses = reponsesData.filter(reponse => reponse.question === question.id);
    return {
      ...question,
      reponses,
      isDateInput: question.id === 4, // adapte selon ton critère pour les dates
    };
  });

  const [answers, setAnswers] = useState({});

  // Trouver l'id de la "réponse date" associée à une question date (ex: dans reponsesData)
  const getDateReponseId = (questionId) => {
    const dateReponse = reponsesData.find(r => r.question === questionId && r.value.toLowerCase().includes('date'));
    
    
    return dateReponse ? dateReponse.id : null;
  };

  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  // Gérer changement des réponses ou date
  const handleAnswerChange = (questionId, { reponse, date }) => {
    setAnswers(prev => {
      const oldEntry = prev[questionId] || {};
      let newReponse = oldEntry.reponse;
      let newDate = oldEntry.date;

      if (date !== undefined) {
        // Si on modifie la date, forcer reponse à l'id associée à la date
        const dateReponseId = getDateReponseId(questionId);
        newReponse = dateReponseId;
        newDate = date;
      } else if (reponse !== undefined) {
        // Si on modifie la réponse classique, mettre la réponse et annuler la date
        newReponse = reponse;
        newDate = null;
      }

      return {
        ...prev,
        [questionId]: {
          reponse: newReponse,
          date: newDate
        }
      };
    });
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
          selectedDate={answers[item.id]?.date ? dayjs(answers[item.id].date, 'DD/MM/YYYY') : null}
          selectedReponse={answers[item.id]?.reponse || ''}
          onReponseChange={(reponse) => handleAnswerChange(item.id, { reponse })}
          onDateChange={(date) => handleAnswerChange(item.id, { date })}
        />
      ))}
    </Box>
  );
}
