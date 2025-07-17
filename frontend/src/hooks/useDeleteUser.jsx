import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const useDeleteUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteUser = async (userId) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/api/users/delete/${userId}/`, {
                method: 'DELETE',
                           });
             const responseText = await response.text();
            console.log('Réponse du serveur:', responseText);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            
            setUser(null);
            return response.status === 204; // Retourne true si la suppression a réussi
            
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la suppression de l\'utilisateur:', err);
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
        deleteUser, 
        reset
    };
};
