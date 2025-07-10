import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@mui/material/Button';
import logoOptions from '@/assets/logo-options.png';
import logoAcceor from '@/assets/logo-acceor.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Identifiants invalides');

      const data = await res.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
          <div className='min-h-screen flex flex-col items-center justify-center bg-[#cdbcaa] px-4'>
            <motion.img
            src={logoOptions}
            alt='Options Logo'
            className='w-24 mb-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            />
            <h1 className='text-white text-4xl font-light tracking-wider'>OUTIL DE GESTION DES DEMANDES INTERNET</h1>
            <Card className='w-full max-w-md shadow-xl'>
            <CardContent className='p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-gray-700'>Identifiant</label>
                <input
                    id='email'
                    type='text'
                    className='w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='password' className='text-gray-700'>Mot de passe</label>
                <input
                    id='password'
                    type='password'
                    className='w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              {error && <p className='text-red-600 text-sm'>{error}</p>}

              <Button type='submit' className='w-full py-3 rounded-2xl text-base font-semibold'>CONNEXION</Button>
            </form>
            </CardContent>
            </Card>
            <img src={logoAcceor} alt='Acceor Logo' className='w-24 mt-12' />
          </div>
        );
}
