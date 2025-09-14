import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure


export const useGetLockedQuotes = () => {
    const [lockedQuotes, setLockedQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLockedQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/quotes/quote-lock/`);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setLockedQuotes(data);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des devis verrouillés:', err);
        } finally {
            setLoading(false);
        }
    };

  
        useEffect(() => {
    fetchLockedQuotes();
}, []);

    const refetch = () => {
        fetchLockedQuotes();
    };

   
    return {
        lockedQuotes,
        loading,
        error,
        refetch
    };
};

