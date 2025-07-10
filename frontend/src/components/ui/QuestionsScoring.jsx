import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BlocQuestionsReponses from './BlocQuestionsReponses';
import dayjs from 'dayjs';

export default function QuestionsScoring({ onDataChange }) {
  const [questionsData] = useState([
    { question: "Avez-vous déjà fait appel à option ? ", reponses: ['Oui', 'Non'], isDateInput: false },
    { question: "Votre évènement est-il à ttire particulier ou professionnel ?", reponses: ['Particulier', 'Professionnel'], isDateInput: false },
    { question: "La date de votre évènement est-elle fixée ?", reponses: ['Oui', 'Non'], isDateInput: false },
    { question: "Si oui, à quelle date ?", reponses: [], isDateInput: true },
    { question: "Le lieu de votre événement est-il réservé ?", reponses: ['Oui', 'Non', 'Pas sûr'], isDateInput: false },
    { question: "Pouvez vous me donner une fourchette de votre budget ?", reponses: ['Non', '0-499 E', '500-1000 E', 'Plus de 1000 E'], isDateInput: false },
    { question: "Souhaitez-vous qu'un conseiller clientèle vous rappelle ?", reponses: ['Oui', 'Non'], isDateInput: false }
  ]);

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
      {questionsData.map((item, index) => (
        <BlocQuestionsReponses
          key={index}
          question={item.question}
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
