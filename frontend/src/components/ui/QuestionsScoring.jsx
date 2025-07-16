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
    isDateInput: question.id === 4
  };
});


const [answers, setAnswers] = useState({});

  // Décale la remontée des données vers le parent hors du setState
  useEffect(() => {
    if (onDataChange) {
      onDataChange(answers);
    }
  }, [answers, onDataChange]);

  const handleAnswerChange = (index, { reponse, date }) => {
    setAnswers(prev => {
      const oldEntry = prev[index] || {};
      return { 
        ...prev, 
        [index]: { 
          reponse: reponse !== undefined ? reponse : oldEntry.reponse,
          date: date !== undefined ? date : oldEntry.date
        } 
      };
    });
  };

  return (
    <Box sx={{  display: 'flex', flexDirection: 'row', flexWrap: 'wrap' , gap: '90px' }}>
      {questionsReponsesData.map((item, index) => (
  <BlocQuestionsReponses
    key={index}
    question={item.label}
    reponses={item.reponses} 
    questionId={index}
    isDateInput={item.isDateInput}
    selectedDate={answers[index]?.date ? dayjs(answers[index].date, 'DD/MM/YYYY') : null}
    selectedReponse={answers[index]?.reponse || ''}
    onReponseChange={(reponse) => handleAnswerChange(index, { reponse })}
    onDateChange={(date) => handleAnswerChange(index, { date })}
  />
))}

    </Box>
  );
}
