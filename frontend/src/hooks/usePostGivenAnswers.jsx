import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const usePostGivenAnswers = () => {
    const [answers, setAnswers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const givenAnswers = async (answersData) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/api/questionnaire/given-answers/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
               
                body: JSON.stringify(answersData)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setAnswers(data);
            return data; 
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de l\'envoie des réponses:', err);
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
