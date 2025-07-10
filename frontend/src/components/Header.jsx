import React, { useEffect, useState,  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Menu, Box,MenuItem,  Tooltip } from '@mui/material';

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
    <Box className="header">
      <Box className="left-header">
          <button className="boutton-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
      </Box>

      <Box>
          <button className="bouton-actualiser">Actualiser les demandes</button>
      </Box>
      <Box className="logo">

          
            <img src={logo} alt="Logo" className="logo-header" />
          
        </Box>

      <Tooltip title="Profil"  >
            
            <Button className="bouton-utilisateur"
            variant="text"
              onClick={handleMenuOpen}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <div className="nom-utilisateur-header">
              Bonjour <span id="nom-user">{user?.first_name}</span> 
            </div>
              {/* Avatar ou icône */}
              
                <FontAwesomeIcon icon={faUser} className="right logo-utilisateur-header " border/>
              
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
     
   </Box>
  );
}

export default Header;
