import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style.css';


function ResetPasswordPage() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const response = await fetch(`/api/users/reset-password/${uidb64}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });
      if (response.ok) {
        setSuccess('Mot de passe changé avec succès. Vous pouvez vous connecter.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Erreur lors de la réinitialisation. Vérifiez le format du mot de passe.');
      }
    } catch (e) {
      setError('Erreur réseau');
    }
  };

  return (
    <div className="mot-de-passe-oublie">
      <h2 className="texte2">Réinitialiser le mot de passe</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success ? (
        <p style={{ color: 'green' }}>{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
          className="input-mot-de-passe-oublie"
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
          className="input-mot-de-passe-oublie"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="bouton bouton-reinit-mot-de-passe">Changer le mot de passe</button>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordPage;
