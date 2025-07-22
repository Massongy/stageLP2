import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BlocQuestionsReponses from './BlocQuestionsReponses';
import dayjs from 'dayjs';

export default function QuestionsScoring({ onDataChange, questionsData, reponsesData }) {


  const questionsReponsesData = questionsData.map(question => {
  
  const reponses = reponsesData.filter(reponse => reponse.question === question.id);
    return {
      ...question,
      reponses,
      isDateInput: question.is_date_input
    };
  });

  const [answers, setAnswers] = useState({});

  // Trouver l'id de la "réponse date" associée à la question date 
 const getDateReponseId = (questionId) => {
  const dateReponse = reponsesData.find(r => r.question === questionId);
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

    const newEntry = {
      reponse: newReponse,
      date: newDate
    };
    

    return {
      ...prev,
      [questionId]: newEntry
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
        onDateChange={(date) => {
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
