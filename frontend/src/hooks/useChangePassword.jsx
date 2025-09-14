import { useState } from 'react';
import { authFetch } from '../services/auth.js';

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const changePassword = async (passwordData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await authFetch(`/users/change-password/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_password: passwordData.currentPassword,
                    new_password: passwordData.newPassword,
                }),
            });

            // Vérifier le Content-Type de la réponse
            const contentType = response.headers.get('content-type');
            
            if (!response.ok) {
                let errorMessage = `Erreur HTTP: ${response.status}`;
                
                if (contentType && contentType.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.detail || errorMessage;
                    } catch (jsonError) {
                        console.error('Erreur lors du parsing JSON:', jsonError);
                    }
                } else {
                    // Si ce n'est pas du JSON, lire comme texte
                    const errorText = await response.text();
                    if (errorText.includes('<!DOCTYPE')) {
                        errorMessage = 'Session expirée ou accès non autorisé. Veuillez vous reconnecter.';
                        // Optionnel : rediriger vers la page de connexion
                        // window.location.href = '/login';
                    } else {
                        errorMessage = errorText || errorMessage;
                    }
                }
                
                throw new Error(errorMessage);
            }

            // Vérifier si la réponse est bien du JSON
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setSuccess(true);
                return data;
            } else {
                // Si pas de JSON en réponse, considérer comme succès si status 200
                setSuccess(true);
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            console.error('Erreur lors du changement de mot de passe:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return {
        loading,
        error,
        success,
        changePassword,
        reset
    };
};