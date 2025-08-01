import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const [buttonText, setButtonText] = useState("Actualiser les demandes");
  const [hasSelectedResult, setHasSelectedResult] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useCurrentUser();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsLogged(!!token);
    if (token) {
      try {
        jwtDecode(token);
      } catch (error) {
        console.error('Token invalide', error);
      }
    }
  }, []);

  useEffect(() => {
    window.notifyResultSelected = () => {
      setHasSelectedResult(true);
      setButtonText("Revenir aux demandes");
    };
    return () => {
      delete window.notifyResultSelected;
    };
  }, []);

  const handleSearch = () => {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        if (window.openSearchModal) window.openSearchModal();
      }, 100);
    } else if (window.openSearchModal) {
      window.openSearchModal();
    }
  };

  const handleRefetch = () => {
  if (hasSelectedResult) {
    if (window.clearFilter) window.clearFilter();

    setTimeout(() => {
      if (window.refetchQuotes) window.refetchQuotes();
    }, 50); // délai pour laisser React vider le filtre

    setHasSelectedResult(false);
    setButtonText("Actualiser les demandes");
  } else {
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(() => {
        if (window.clearFilter) window.clearFilter();
        if (window.refetchQuotes) window.refetchQuotes();
      }, 100);
    } else {
      if (window.clearFilter) window.clearFilter();
      if (window.refetchQuotes) window.refetchQuotes();
    }
  }
};


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLogged(false);
    navigate('/login');
  };

  if (!isLogged) {
    return null;
  }

  return (
    <Container fluid className="header">
      <Row className="align-items-center h-100 flex-column flex-md-row">
        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
          <Button className="boutton-search" onClick={handleSearch}>
            <FontAwesomeIcon className="icon-circle" icon={faMagnifyingGlass} />
          </Button>
          <LoadingButton className="bouton-actualiser" onClick={handleRefetch}>
            {buttonText}
          </LoadingButton>
        </Col>
        <Col xs={12} md={4} className="logo d-flex justify-content-center mb-2 mb-md-0">
          <img src={logo} alt="Logo" className="logo-header" />
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-end position-relative">
          <Dropdown show={open} onToggle={handleMenuClose} drop="down" align="end">
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
              <FontAwesomeIcon icon={faUser} className="logo-utilisateur-header" border />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-custom">
              <Dropdown.Item as={Link} to="/dashboard" onClick={handleMenuClose}>
                Tableau de bord
              </Dropdown.Item>
             
              <Dropdown.Item as={Link} to="/Users" onClick={handleMenuClose}>
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
