import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const useLockQuote = () => {
    const [isLocked, setIsLocked] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    const quoteLock = async (id) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/quotes/quote-lock/`, {
                method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quote_id: id })
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setIsLocked(true);
            return data; 
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors du verrouillage:', err);
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { 
        setIsLocked(false);
        setError(null);
    };

    return {
        quoteLock,
        loading,
        error,
        isLocked, 
        reset
    };
};
