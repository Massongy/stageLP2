import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Alert, Snackbar } from '@mui/material';

import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import Users from '../components/ui/Users.jsx';
import '../assets/usermanagement.css';
import '../assets/style.css';
import { useCreateUser } from '../hooks/useCreateUser';
import { useMyUsers } from '../hooks/useMyUsers';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useEditUser } from '../hooks/useEditUser';
import useCurrentUser from '../hooks/useCurrentUser.jsx';
import ConfirmDeleteDialog from '../components/ui/ConfirmDeleteDialog.jsx';
import LoadingButton from '../components/ui/LoadingButton.jsx';

function UserManagement() {
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('info'); 
  const [isCreating, setIsCreating] = useState(false);
const [newUser, setNewUser] = useState({
  first_name: '',
  last_name: '',
  email: '',
  groups: []
});
  const { users, loading: usersLoading, error: usersError, refetch: usersRefetch } = useMyUsers();
  const { createUser, loading: createLoading, err: createError } = useCreateUser();
  const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();
  const { editUser, loading: editLoading, error: editError } = useEditUser();
  const [error, setError] = useState('');
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
          setSnackbarMessage(result ? 'Utilisateur mis à jour !' : 'Erreur lors de la mise à jour');
        setSnackbarSeverity(result ? 'success' : 'error');
        setOpenSnackbar(true);
          usersRefetch(); // Rafraîchit la liste des utilisateurs
        })
        .catch(err => {
        setSnackbarMessage('Erreur: ' + err.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      })
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
setSnackbarMessage('Utilisateur créé avec succès');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
        setShowEmailConfirmation(false);
    setShowEmailConfirmation(false);
    setShowForm(false);
    setIsCreating(false);
    usersRefetch(); // Rafraîchit la liste des utilisateurs
    
    
  } catch (err) {
   setSnackbarMessage('Erreur lors de la création: ' + err.message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
    } finally {
    setIsCreatingUser(false); // Désactive le loader
  }
};
useEffect(() => {
    if (!showForm) {
      // Action à effectuer lorsque le formulaire est masqué
      console.log('Le formulaire est maintenant masqué');
    }
  }, [showForm]);
  useEffect(() => {
  console.log('Valeur de showForm:', showForm);
}, [showForm]);
  
const handleDelete = (userId) => {
  const user = users.find(u => u.id === userId);
  setUserToDelete(user);
  setDeleteDialogOpen(true);
};

const handleUserDelete = async () => {
  if (!userToDelete) return;
  
  try {
    const success = await deleteUser(userToDelete.id);
    if (success) {
      setSnackbarMessage('Utilisateur supprimé avec succès');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      usersRefetch();
    }
  } catch (err) {
    setSnackbarMessage('Erreur lors de la suppression: ' + err.message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  } finally {
    setUserToDelete(null);
  }
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


const activeUsers = datausers.filter(user => user.is_active === true);
// Vérification des permissions de l'utilisateur courant
const user = useCurrentUser();
const hasFullRights = user?.permissions && ['add_user'].every(p => user.permissions.includes(p));



    if (!hasFullRights) {
    const myProfile = user ? [{
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }] : [];

    return (
     <Container fluid className="container-gestion-compte">
      {/* Row 1: Titre principal */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Box className="titre1 text-center">Gestion du compte</Box>
        </Col>
      </Row>

      {/* Row 2: Informations compte administrateur */}
      <Row className="mt-3">
        <Col xs={12}>
          <Box className="info-admin-gestion-compte">
            <Box className="titre2 text-center mb-3">Informations de mon compte utilisateur</Box>
            <Users 
              datausers={dataadmin}
              isCurrentProfile={true}
              currentUserGroup={currentUserGroup}
              
            />
          </Box>
        </Col>
      </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="container-gestion-compte">
      {/* Row 1: Titre principal */}
      
          <Box className="titre1 text-center mb-4">Gestion du compte</Box>
       
      {/* Row 2:titre compte administrateur */}
   
          
            <Box className="titre2 text-center text-md-start mb-3">Informations de mon compte administrateur</Box>
        
      {/* Row 3: Informations compte administrateur */}
    
                <Users 
                  datausers={dataadmin}
                  isCurrentProfile={true}
                  currentUserGroup={currentUserGroup}
                />
       
      {/* Row 4: Titre "Mes utilisateurs" */}
      
          <Box className="titre2 text-center text-md-start mt-5 mb-3">Mes utilisateurs</Box>
       


      {/* Row 5: Liste des utilisateurs */}
    
            <Users
              datausers={activeUsers}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isCreating={isCreating}
              currentUserGroup={currentUserGroup}
              creationData={newUser}
              onCreationChange={handleCreationChange}
              onSaveNewUser={saveNewUser}
              onCancelCreation={cancelCreation}
            />
          
      

      
          {editUserId ? (
            <Box className="d-flex flex-column flex-md-row align-items-center ">
                
                <span className="text-center text-md-start titre2 mt-5">Modifier les informations de mon utilisateur ci-dessous</span>
            </Box>
                  ) : (
            <Button 
            disableRipple
                onClick={handleAdd} 
                className="custom-add-button w-100 w-md-auto mt-5 mb-5"
            >
              <span className="custom-add-icon">+</span>
              <span className="custom-add-text">Ajouter un utilisateur</span>
            </Button>
          )}
       

      {/* Row 7: Formulaire (si affiché) */}
      {showForm  && (
        <Row className="mt-3" ref={formRef}>
          <Col xs={12}>
            <form onSubmit={handleSubmit} className="p-3 border-0 rounded-0 user-form">
              <div className="row">
                <div className="col-12 col-md-6 mb-3 ">
                  <input 
                    name="first_name" 
                    placeholder="Prénom" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control border-0 shadow-none input-formulaire-edition"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <input 
                    name="last_name" 
                    placeholder="Nom" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control border-0 shadow-none input-formulaire-edition"
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
                    className="form-control border-0 shadow-none input-formulaire-edition"
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
                <div className="alert alert-info input-formulaire-edition">
                  <strong className="titre3">Groupe actuel :</strong> <span className="text-muted texte2">{availableGroups.find(g => formData.groups.includes(g.id))?.name || 'Groupe inconnu'}</span>
                  <br/>
                  <small className="text-muted texte2"><i>Les groupes ne peuvent pas être modifiés lors de l'édition.</i></small>
                </div>
              )}

              <div className="d-flex flex-column flex-sm-row gap-2">
                <LoadingButton type="submit" className="bouton bouton-edition-utilisateur">
                   {editUserId ? 'Mettre à jour' : 'Créer'}
                </LoadingButton>
                <LoadingButton 
                  type="button" 
                  onClick={handleCancel} 
                  className="bouton bouton-annuler-edition-utilisateur"
                >
                  Annuler
                </LoadingButton>
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
  <LoadingButton
  onClick={handleConfirmCreate}
  isLoading={isCreatingUser}
  className="bouton bouton-confirmer"
>
  Confirmer
</LoadingButton>
<LoadingButton onClick={() => setShowEmailConfirmation(false)} disabled={isCreatingUser} className="bouton bouton-annuler">
  Annuler
</LoadingButton>
</DialogActions>
        </div>
      </Dialog>
      <Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}
  sx={{
    '& .MuiPaper-root': {
      minWidth: '300px',
      fontSize: '1.1rem',
      textAlign: 'center'
    }
  }}
>
  <Alert
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
    onClose={() => setOpenSnackbar(false)}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
<ConfirmDeleteDialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={() => {
    handleUserDelete();
    setDeleteDialogOpen(false);
  }}
  userData={userToDelete}
/>
    </Container>
  );
}

export default UserManagement;