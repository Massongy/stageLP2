import { useState, useEffect } from 'react';
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure


export const useMyUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await authFetch('/api/users/my-users/');
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la récupération des utilisateurs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const refetch = () => {
        fetchUsers();
    };

   
    return {
        users,
        loading,
        error,
        refetch
    };
};

