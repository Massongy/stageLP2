import { useState } from 'react';
import { authFetch } from '../services/auth.js';

export const useUnlockQuote = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unlockQuote = async (quoteId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(`/quotes/quote-lock/${quoteId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Pour DELETE, un 204 No Content est le statut attendu ([rest API DELETE guidelines]) :contentReference[oaicite:1]{index=1}
      setIsUnlocked(true);
      return response.status === 204;

    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du déverrouillage du devis:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIsUnlocked(false);
    setError(null);
  };

  return {
    isUnlocked,
    loading,
    error,
    unlockQuote,
    reset,
  };
};
