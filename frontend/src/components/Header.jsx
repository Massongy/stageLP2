import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../assets/header.css';
import '../assets/style.css';
import logo from '../assets/Logo_Options_Footer.svg';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import useCurrentUser from "../hooks/useCurrentUser.jsx";
import LoadingButton from "./ui/LoadingButton.jsx";

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
     setIsLogged(false);
    navigate('/login');
  };

  if (!isLogged) return null;

  return (
    <Container fluid className="header">
      <Row className="align-items-center h-100 flex-column flex-md-row">
        {/* Section boutons - première ligne sur mobile */}
        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
          <Button 
              className="boutton-search"
    
              onClick={() => {
                if (window.openSearchModal) {
                  window.openSearchModal();
                }
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Button>
          
          <LoadingButton
            className="titre2 bouton-actualiser"
            onClick={() => {
                if (window.refetchQuotes) {
                  window.refetchQuotes(); // Rafraîchit les données
                }
              }}
          >
            Actualiser les demandes
          </LoadingButton>
        </Col>
        
        {/* Logo - deuxième ligne sur mobile */}
        <Col xs={12} md={4} className="logo d-flex justify-content-center mb-2 mb-md-0">
          <img src={logo} alt="Logo" className="logo-header" />
        </Col>
        
        {/* Menu utilisateur - troisième ligne sur mobile */}
        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end position-relative">
          <Dropdown 
            show={open}
            onToggle={handleMenuClose}
            drop="down"
            align="end"
          >
            <Dropdown.Toggle 
              as={Button}
              className="bouton-utilisateur"
              variant="text"
              onClick={handleMenuOpen}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <div className="nom-utilisateur-header">
                Bonjour <span id="nom-user">{user?.first_name}</span>
              </div>
              <FontAwesomeIcon icon={faUser} className="logo-utilisateur-header" border/>
            </Dropdown.Toggle>
            
            <Dropdown.Menu className="dropdown-menu-custom">
              <Dropdown.Item as={Link} to="/dashboard" onClick={handleMenuClose}>
                Tableau de bord
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/profile" onClick={handleMenuClose}>
                Mon profil
              </Dropdown.Item>
              
              <Dropdown.Item 
                    as={Link} to="/Users"
                    onClick={handleMenuClose}
                  >               
                      Gestion du compte             
              </Dropdown.Item>
                  
              <Dropdown.Item onClick={handleLogout}>
                Déconnexion
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
