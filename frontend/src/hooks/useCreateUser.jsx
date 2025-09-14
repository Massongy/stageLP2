import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const useCreateUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createUser = async (userData) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/users/users/', {
                method: 'POST',
               
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setUser(data);
            return data; 
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la création de l\'utilisateur:', err);
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    const reset = () => { 
        setUser(null);
        setError(null);
    };

    return {
        user,
        loading,
        error,
        createUser, 
        reset
    };
};
