import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure

export const useQuestionnaireQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/api/questionnaire/questions/');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Trier par le champ order
            const sortedQuestions = data.sort((a, b) => {
                // Gestion des cas où order pourrait être undefined/null
                const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
                const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
                return orderA - orderB;
            });
            
            setQuestions(sortedQuestions);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des questions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const refetch = () => {
        fetchQuestions();
    };
    
    return {
        questions,
        loading,
        error,
        refetch
    };
};