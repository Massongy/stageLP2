import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure


export const useQuotesQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/api/quotes/quotes');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setQuotes(data);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des quotes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const refetch = () => {
        fetchQuotes();
    };

   
    return {
        quotes,
        loading,
        error,
        refetch
    };
};

