import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // ← import Link
import logoOptions from '@/assets/logo-options.png';
import logoAcceor from '@/assets/logo-acceor.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import '../assets/login.css';

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
    <Container
      fluid
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center container-login"
    >
      <Row className="mb-4 w-100 justify-content-center">
        <Col xs="auto" className="d-flex justify-content-center">
          <img src={logoOptions} alt="Options Logo" style={{ width: '17rem' }} />
        </Col>
      </Row>

      <Row className="mb-5 w-100 justify-content-center">
        <Col xs="auto" className="titre-login">
          Outil de gestion des demandes internet
        </Col>
      </Row>

      <Row className="mb-5 w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={7}>
          <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
            <Form.Label className="text-center d-block mt-4 mb-5 form-label-custom">
              Entrez vos identifiants de connexion
            </Form.Label>

            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Identifiant"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-50 mx-auto p-3 form-control-personnalise"
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Mot de Passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-50 mx-auto p-3 form-control-personnalise"
                required
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button
              variant="primary"
              type="submit"
              className="w-50 mx-auto py-3 rounded-pill fw-semibold bouton-login"
            >
              CONNEXION
            </Button>

            {/* ➕ Lien "Mot de passe oublié ?" */}
            <div className="w-50 mx-auto mt-3 text-center">
              <Link to="/forgot-password/" className="text-primary">
                Mot de passe oublié ?
              </Link>
            </div>
          </Form>
        </Col>
      </Row>

      <Row className="w-100 justify-content-center mb-5 pb-4">
        <Col xs="auto" className="d-flex justify-content-center">
          <img src={logoAcceor} alt="Acceor Logo" className="img-acceor" />
        </Col>
      </Row>
    </Container>
  );
}
