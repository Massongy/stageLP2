import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure


export const useGetQuestionnaireId = (quote_id) => {
    const [questionnaire, setQuestionnaire] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestionnaire = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/questionnaire/questionnaires/${quote_id}/`);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setQuestionnaire(data);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération du questionnaire:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
         if (quote_id) {
            fetchQuestionnaire();
        }
    }, [quote_id]);
        

    const refetch = () => {
        fetchQuestionnaire();
    };

   
    return {
        questionnaire,
        loading,
        error,
        refetch
    };
};

