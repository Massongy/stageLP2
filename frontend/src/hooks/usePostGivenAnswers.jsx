import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const usePostGivenAnswers = () => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const givenAnswers = async (answersData) => {
  try {
    setLoading(true);
    setError(null);

    const allAnswers = []; // Tableau pour stocker toutes les réponses

    for (const answer of answersData) {
      const response = await authFetch('/api/questionnaire/given-answers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      allAnswers.push(data); // Ajoute la réponse au tableau

      // Vous pouvez également mettre à jour l'état après chaque ajout si nécessaire
      setAnswers(prevAnswers => [...prevAnswers, data]);
    }

    // Retourne toutes les réponses traitées
    return allAnswers;
  } catch (err) {
    setError(err.message);
    console.error('Erreur lors de l\'envoi des réponses:', err);
    throw err;
  } finally {
    setLoading(false);
  }
};


    const reset = () => { 
        setAnswers(null);
        setError(null);
    };

    return {
        answers,
        loading,
        error,
        givenAnswers, 
        reset
    };
};
