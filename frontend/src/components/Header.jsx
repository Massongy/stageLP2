import React, { useEffect, useState,  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Menu, MenuItem, IconButton, Avatar, Tooltip } from '@mui/material';
import '../assets/header.css';
import logo from '../assets/Logo_Options_Footer.svg';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useCurrentUser from "../hooks/useCurrentUser.jsx";
 

function Header() {
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);
    const user = useCurrentUser();
    console.log(user?.first_name);
    const handleMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};
 
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const logged = !!token;
    setIsLogged(logged);

    if (logged) {
      try {
        const decoded = jwtDecode(token);
        
      } catch (error) {
        console.error('Token invalide', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!isLogged) return null;

  return (
    <header>
      <div className="left">
        <button className="boutton-search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <div className="left">
        <button className="bouton-actualiser">Actualiser les demandes</button>
      </div>

      <div className="center">
        <img src={logo} alt="Logo" className="logo-header" />
      </div>
   <Tooltip title="Profil"  >
        
        
        
        <Button className="bouton-utilisateur"
        variant="text"
          onClick={handleMenuOpen}
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        ><div className="right nom-utilisateur-header">
          Bonjour <span style={{ fontWeight: 500 }}></span> {user?.first_name}
        </div>
          {/* Avatar ou icône */}
          
            <FontAwesomeIcon icon={faUser} className="right logo-utilisateur-header" />
          
        
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        
        <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
          Tableau de bord
        </MenuItem>
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          Mon profil
        </MenuItem>
        <MenuItem component={Link} to="/Users" onClick={handleMenuClose}>
          Gestion du compte
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Déconnexion
        </MenuItem>
      </Menu>
     
    </header>
  );
}

export default Header;
