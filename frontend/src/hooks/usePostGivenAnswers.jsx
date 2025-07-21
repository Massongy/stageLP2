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
 // Debug 6: Dans le hook avant fetch
        console.log('Début appel API - Payload reçu:', formattedAnswers);

            const response = await authFetch('/api/questionnaire/given-answers/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedAnswers)
            });
// Debug 7: Réponse brute
        console.log('Réponse brute API:', {
            status: response.status,
            ok: response.ok,
            headers: [...response.headers.entries()]
        });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setAnswers(data);
            return data;
            
        } catch (err) {
          // Debug 8: Erreur dans le hook
        console.error('Erreur dans givenAnswers:', {
            error: err,
            payload: formattedAnswers
        });
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