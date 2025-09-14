import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const usePostGivenAnswers = () => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const givenAnswers = async (formattedAnswers) => {
        try {
            setLoading(true);
            setError(null);
 

            const response = await authFetch('/questionnaire/given-answers/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedAnswers)
            });


            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setAnswers(data);
            return data;
            
        } catch (err) {
        
            setError(err.message);
            console.error('Erreur API:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { 
        setAnswers([]);
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