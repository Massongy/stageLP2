import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import '../assets/header.css' 
import logo from '../assets/Logo_Options_Footer.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';

function Header() { 


const [username, setUsername] = useState(null)
  const navigate = useNavigate()
  const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access')
         console.log('Token brut :', token);
        const logged = !!token
        setIsLogged(logged)

         if (logged) {
          
      try {
        const decoded = jwtDecode(token)
        console.log('Decoded token:', decoded)
        setUsername(decoded.username || decoded.sub || decoded.name)
      } catch (error) {
        console.error('Token invalide', error)
      }
    }
    }, [])
  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }
    if (!isLogged) return null

  return (
   
    <header>
      <div className="left"> 
        <button className="boutton-search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />          
        </button>
      </div>
  
      <div className="left"><button className="bouton-actualiser">Actualiser les demandes</button> </div>
      <div className="center"><img src={logo} alt="Logo" className="logo-header"/></div>
        
      <Button className="bouton-utilisateur"
      component={Link}
                to={`/profile`}
                variant="contained"
      >
        <div className="right nom-utilisateur-header"> Bonjour <span style={{ fontWeight: 500 }}>{username}</span></div>
        <div className="right logo-utilisateur-header">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </Button>
      
        

    </header>
    
    
  )
}

export default Header
