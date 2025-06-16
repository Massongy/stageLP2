import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access')
        setIsLogged(!!token)
    }, [])
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }
    if (!isLogged) return null

  return (
    <header style={{ backgroundColor: '#f2f2f2', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>Accueil</Link>
        <Link to="/profile" style={{ marginRight: '1rem' }}>Profil</Link>
        <Link to="/change-password" style={{ marginRight: '1rem' }}>Changer mot de passe</Link>
        <Link to="/users" style={{ marginRight: '1rem' }}>Utilisateurs</Link>
        <Link to="/users" style={{ marginRight: '1rem' }}>Devis</Link>
      </div>
      <div>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </header>
  )
}

export default Header
