import { useState } from 'react'; 
import { authFetch } from '../services/auth.js';

export const useEditUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editUser = async (userId, updatedData) => { 
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch(`/users/update/${userId}/`, {
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
            setUserData(data); // Mise à jour des données après succès
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
        setUserData(null);
        setError(null);
    };

    return {
        userData,  
        loading,
        error,
        editUser, 
    };
};