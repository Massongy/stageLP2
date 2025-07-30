import React, { useState } from 'react';
import LoadingButton from '../components/ui/LoadingButton';

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
    <div>
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Entrez votre e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoadingButton type="submit" isLoading={isLoading} >
          Envoyer le lien de réinitialisation
        </LoadingButton>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
