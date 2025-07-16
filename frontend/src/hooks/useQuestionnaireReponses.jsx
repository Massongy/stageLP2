import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure


export const useQuestionnaireReponses = () => {
    const [reponses, setReponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReponses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/api/questionnaire/reponses/');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setReponses(data);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des reponses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReponses();
    }, []);

    const refetch = () => {
        fetchReponses();
    };

   
    return {
        reponses,
        loading,
        error,
        refetch
    };
};

