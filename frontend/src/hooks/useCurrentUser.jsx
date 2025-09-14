import { useEffect, useState } from "react";
import { authFetch } from '../services/auth.js'; // Ajustez le chemin selon votre structure

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    
    const fetchUser = async () => {
      try {
        const response = await authFetch('/users/me/');
        if (response && response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setUser(null);
      }
    };
    
    fetchUser();
  }, []);
  
  return user;
}