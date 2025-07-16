import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const useEditQuote = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editQuote = async (quoteId, updatedData) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/api/quotes/quotes/${quoteId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            setQuoteData(data); // Mise à jour des données après succès
            return data; // Retourne les données pour une utilisation immédiate

        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la modification du devis', err);
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { 
        setQuoteData(null);
        setError(null);
    };

    return {
        quoteData,  // Cohérence avec les noms
        loading,
        error,
        editQuote,  // Nom corrigé (au lieu de createUser)
        reset
    };
};