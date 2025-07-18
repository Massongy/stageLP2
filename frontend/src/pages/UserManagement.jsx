import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import Users from '../components/ui/Users.jsx';
import '../assets/usermanagement.css';
import '../assets/style.css';
import { useCreateUser } from '../hooks/useCreateUser';
import { useMyUsers } from '../hooks/useMyUsers';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useEditUser } from '../hooks/useEditUser';
import { CircularProgress } from '@mui/material';

function UserManagement() {
  const [isCreating, setIsCreating] = useState(false);
const [newUser, setNewUser] = useState({
  first_name: '',
  last_name: '',
  email: '',
  groups: []
});
  const { users, loading: usersLoading, error: usersError } = useMyUsers();
  const { createUser, loading: createLoading, err: createError } = useCreateUser();
  const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();
  const { editUser, loading: editLoading, error: editError } = useEditUser();

  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '', created_by: '', groups: [] });
  const [editUserId, setEditUserId] = useState(null);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const [profile, setProfile] = useState(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const formRef = useRef(null);
  const token = localStorage.getItem('access');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const profileRes = await fetch('api/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profile = await profileRes.json();
      setProfile(profile);
      setCreatedBy(profile.id);

      // Ajoutez cette ligne pour stocker le groupe principal de l'utilisateur
      const userGroup = profile.groups && profile.groups.length > 0 ? 
                       (typeof profile.groups[0] === 'object' ? profile.groups[0].id : profile.groups[0]) : 
                       null;
      setCurrentUserGroup(userGroup);

      if (!profile.permissions?.includes('view_user')) {
        setHasPermission(false);
        return;
      }
      setHasPermission(true);

      setAvailableGroups([
        { id: 1, name: 'Gestionnaire Acceor' },
        { id: 2, name: 'Gestionnaire Options' },
        { id: 3, name: 'Utilisateur Acceor' },
        { id: 4, name: 'Utilisateur Options' },
      ]);
    } catch (err) {
      setError('Erreur chargement données');
    }
  };
  fetchData();
}, [token]);

const [currentUserGroup, setCurrentUserGroup] = useState(null);
console.log("Current User Group:", currentUserGroup);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGroupToggle = (groupId) => {
    setFormData(prev => ({ ...prev, groups: [groupId] }));
  };

  const handleAdd = () => {
  setIsCreating(true);
  setNewUser({
    first_name: '',
    last_name: '',
    email: '',
    groups: []
  });
  // Assurez-vous qu'aucune édition n'est en cours
  setEditUserId(null);
  setShowForm(false);
};


  const handleEdit = (user) => {
    setEditUserId(user.id);
    let userGroups = [];
    if (Array.isArray(user.groups) && user.groups.length > 0) {
      if (typeof user.groups[0] === 'object' && user.groups[0].id) {
        userGroups = user.groups.map(g => g.id);
      } else if (typeof user.groups[0] === 'number') {
        userGroups = user.groups;
      } else if (typeof user.groups[0] === 'string') {
        userGroups = user.groups.map(name => {
          const g = availableGroups.find(x => x.name === name);
          return g ? g.id : null;
        }).filter(id => id !== null);
      }
    }
    setFormData({ ...user, groups: userGroups });
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleCancel = () => {
    setEditUserId(null);
    setShowForm(false);
    setFormData({ email: '', password: '', first_name: '', last_name: '', created_by: '', groups: [] });
    setPendingData(null);
    setShowEmailConfirmation(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, created_by: createdBy };

    if (editUserId) {
      editUser(editUserId, dataToSend)
        .then(result => {
          alert(result ? 'Utilisateur mis à jour !' : 'Erreur mise à jour');
        })
        .catch(err => alert('Erreur: ' + err.message))
        .finally(() => {
          setShowForm(false);
          setEditUserId(null);
        });
    } else {
      setPendingData(dataToSend);
      setShowEmailConfirmation(true);
    }
  };

  const handleConfirmCreate = async () => {
  setIsCreatingUser(true); // Active le loader
  
  try {
    await createUser(pendingData);
    alert('Utilisateur créé avec succès');
    setShowEmailConfirmation(false);
  } catch (err) {
    console.error(err);
    alert('Erreur lors de la création: ' + err.message);
  } finally {
    setIsCreatingUser(false); // Désactive le loader
  }
};

  const handleDelete = (userId) => {
    if (!window.confirm('Êtes-vous sûr ?')) return;
    deleteUser(userId)
      .then(success => success && alert('Utilisateur supprimé'))
      .catch(err => alert('Erreur: ' + err.message));
  };

  const handleCreationChange = (e) => {
  const { name, value } = e.target;
  
  setNewUser(prev => {
    const updated = { ...prev };
    
    if (name === 'groups') {
      updated.groups = Array.isArray(value) ? value : [value].filter(Boolean);
    } else {
      updated[name] = value;
    }
    
    console.log('Updated user:', updated); // Pour débogage
    return updated;
  });
};

const saveNewUser = () => {
  const dataToSend = {
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    email: newUser.email,
    groups: [Number(newUser.groups[0])], // Conversion en nombre
    created_by: createdBy
  };
  
  console.log("Data being sent:", dataToSend); // Pour vérification
  setPendingData(dataToSend);
  setShowEmailConfirmation(true);
};

const cancelCreation = () => {
  setIsCreating(false);
};

  const dataadmin = profile ? [{
    email: profile.email,
    first_name: profile.first_name,
    last_name: profile.last_name
  }] : [];

  const [isCreatingUser, setIsCreatingUser] = useState(false);


const datausers = users;

  return (
    <Container fluid className="container-gestion-compte">
      {/* Row 1: Titre principal */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Box className="titre1 text-center text-md-start">Gestion du compte</Box>
        </Col>
      </Row>

      {/* Row 2: Informations compte administrateur */}
      <Row className="mt-3">
        <Col xs={12}>
          <Box className="info-admin-gestion-compte p-3">
            <Box className="titre2 mb-3">Informations de mon compte administrateur</Box>
            <Users 
              datausers={dataadmin}
              isAdminProfile={true}
              currentUserGroup={currentUserGroup}
              
            />
          </Box>
        </Col>
      </Row>

      {/* Row 3: Titre "Mes utilisateurs" */}
      <Row className="mt-4">
        <Col xs={12}>
          <Box className="titre2">Mes utilisateurs</Box>
        </Col>
      </Row>

      {/* Row 4: Liste des utilisateurs */}
      <Row className="mt-2">
        <Col xs={12}>
          <Box className="info-utilisateur-gestion-compte p-3">
            <Users
              datausers={datausers}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isCreating={isCreating}
              currentUserGroup={currentUserGroup}
              creationData={newUser}
              onCreationChange={handleCreationChange}
              onSaveNewUser={saveNewUser}
              onCancelCreation={cancelCreation}
            />
          </Box>
        </Col>
      </Row>

      {/* Row 5: Boutons d'action */}
      <Row className="mt-3 mb-4">
        <Col xs={12}>
          {editUserId ? (
            <Box className="d-flex flex-column flex-md-row align-items-center">
              <Button 
                onClick={handleCancel} 
                variant="outlined" 
                className="mb-2 mb-md-0 me-md-3"
              >
                ❌ Annuler l'édition
              </Button>
              <span className="text-center text-md-start">Mode édition : modifier les infos dans le formulaire ci-dessous</span>
            </Box>
          ) : (
           <Button 
  onClick={handleAdd} 
  className="custom-add-button w-100 w-md-auto"
>
  <span className="custom-add-icon">+</span>
  <span className="custom-add-text">Ajouter un utilisateur</span>
</Button>
          )}
        </Col>
      </Row>

      {/* Row 6: Formulaire (si affiché) */}
      {showForm && (
        <Row className="mt-3" ref={formRef}>
          <Col xs={12}>
            <form onSubmit={handleSubmit} className="p-3 border rounded user-form">
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <input 
                    name="first_name" 
                    placeholder="Prénom" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <input 
                    name="last_name" 
                    placeholder="Nom" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-12 mb-3">
                  <input 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
              </div>
              
              <input type="hidden" name="created_by" value={createdBy}/>

              {!editUserId && (
                <fieldset className="mb-3">
                  <legend>Groupes :</legend>
                  <div className="row">
                    {availableGroups.map(g => (
                      <div key={g.id} className="col-12 col-sm-6 col-md-3">
                        <label className="d-block">
                          <input 
                            type="radio" 
                            name="group" 
                            value={g.id}
                            checked={formData.groups.includes(g.id)}
                            onChange={() => handleGroupToggle(g.id)}
                            className="me-2"
                          />
                          {g.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}

              {editUserId && formData.groups.length > 0 && (
                <div className="alert alert-info">
                  <strong>Groupe actuel :</strong> {availableGroups.find(g => formData.groups.includes(g.id))?.name || 'Groupe inconnu'}
                  <br/>
                  <small className="text-muted">Les groupes ne peuvent pas être modifiés lors de l'édition.</small>
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1">
                  ✅ {editUserId ? 'Mettre à jour' : 'Créer'}
                </button>
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="btn btn-outline-secondary flex-grow-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </Col>
        </Row>
      )}

      <Dialog open={showEmailConfirmation} onClose={handleCancel} className="boite-dialogue">
        <div className="dialog-content">
          <DialogTitle className="dialog-title">
            Un email va être envoyé à l'utilisateur que vous venez d'ajouter, il y trouvera un lien pour créer son compte
          </DialogTitle>
          
          <DialogActions className="dialog-actions">
  <Button 
    onClick={handleConfirmCreate} 
    variant="contained" 
    className="bouton-confirmer"
    disabled={isCreatingUser} // Désactive le bouton pendant le chargement
  >
    {isCreatingUser ? (
      <>
        <CircularProgress size={24} color="inherit" /> 
        <span style={{ marginLeft: '8px' }}>Création...</span>
      </>
    ) : (
      'Confirmer'
    )}
  </Button>
  <Button onClick={() => setShowEmailConfirmation(false)} disabled={isCreatingUser}>
    Annuler
  </Button>
</DialogActions>
        </div>
      </Dialog>
    </Container>
  );
}

export default UserManagement;