import React, { useState } from 'react';
import LoadingButton from '../components/ui/LoadingButton';
import '../assets/style.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // <-- état pour loader

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/users/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
      } else {
        const data = await response.json();
        setMessage(data.detail || 'Erreur lors de l\'envoi de l\'e-mail.');
      }
    } catch (e) {
      setMessage('Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mot-de-passe-oublie">
      <h2 className="texte2">Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input
        className="input-mot-de-passe-oublie"
          type="email"
          placeholder="Entrez votre e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoadingButton type="submit" className="bouton bouton-reinit-mot-de-passe" isLoading={isLoading} >
          Envoyer le lien de réinitialisation
        </LoadingButton>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
