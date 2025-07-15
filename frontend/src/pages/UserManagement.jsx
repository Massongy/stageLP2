import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Users from '../components/ui/Users.jsx';
import '../assets/usermanagement.css';
import '../assets/style.css';
import { useCreateUser } from '../hooks/useCreateUser';
import { useMyUsers } from '../hooks/useMyUsers';
import { useDeleteUser } from '../hooks/useDeleteUser';
import {authFetch} from '../services/auth.js'

function UserManagement() {
 //récupération des données users  
  const { users, loading:usersLoading, error:usersError } = useMyUsers();
  // fonction créer utilisateur
  const { createUser, loading, err } = useCreateUser(); 
  //fonction supprimer utilisateur
  const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();


  const [error, setError] = useState('')
  const [hasPermission, setHasPermission] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '', created_by: '', groups: [] })
  const [editUserId, setEditUserId] = useState(null)
  const [availableGroups, setAvailableGroups] = useState([])
  const [createdBy, setCreatedBy] = useState([])
  const [profile, setProfile] = useState(null); //recupération données profile
 

  //recuperation données utilisateur actuel

  const token = localStorage.getItem('access')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch('api/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const profile = await profileRes.json()
       
        setProfile(profile);
        setCreatedBy(profile.id)

        if (!profile.permissions?.includes('view_user')) {
          setHasPermission(false)
          return
        }
        setHasPermission(true)

        setAvailableGroups([
          { "id": 1, "name": "Gestionnaire Acceor" },
          { "id": 2, "name": "Gestionnaire Options" },
          { "id": 3, "name": "Utilisateur Acceor" },
          { "id": 4, "name": "Utilisateur Options" }
       ]); 
      
      } catch (err) {
        setError('Erreur chargement données')
      }
    }

    fetchData()
  }, [token])

useEffect(() => {
}, [users]); // Se déclenche quand users change


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGroupToggle = (groupName) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(groupName)
          ? prev.groups.filter(g => g !== groupName)
          : [...prev.groups, groupName]
    }))
  }

  const handleAdd = () => {
    setEditUserId(null)
    setFormData({ email: '', first_name: '', last_name: '', created_by: '', groups: [] })
    setShowForm(true)
  }

  const handleEdit = (user) => {
    setEditUserId(user.id)
    setFormData({ ...user, groups: user.groups || [] })
    setShowForm(true)
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  try {
    
    const res = await createUser(formData);
    if (res) {
      alert('Utilisateur ajouté avec succès')
    }
    
    
  } catch (error) {
    
    alert('Erreur lors de la sauvegarde: ' + error.message);
  }
}




const handleDelete = async (userId) => {
  
  
  try {
    if (!window.confirm('Êtes-vous sûr ?')) return;
    
    const success = await deleteUser(userId);
    if (success) {
      alert('Utilisateur supprimé');
    }
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
};

const dataadmin = profile
    ? [{
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name
      }]
    : [];

const datausers = users;
            
  return (
      <Box className="container-gestion-compte">
       
          <Box className="titre1"> Gestion du compte</Box>
       
        
        <Box className="info-admin-gestion-compte">
          <Box className="titre2">Informations de mon compte administrateur</Box>
          
          <Users datausers={dataadmin}/>
          
        </Box>
<Box className="info-utilisateur-gestion-compte">
        
          <Box className="titre2">Mes utilisateurs</Box>
         <Users datausers={datausers} handleEdit={handleEdit} handleDelete={handleDelete}/>

    </Box>
        
        <Button onClick={handleAdd} >➕ Ajouter un utilisateur</Button>
        
                {showForm && (
                    <form onSubmit={handleSubmit} style={{ margin: '1rem 0', border: '1px solid #ccc', padding: '1rem' }}>
                      <input name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} required />
                      <input name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} required />
                      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                      <input type="hidden" name="created_by" value={createdBy} onChange={handleChange} required />
        
                      <fieldset>
                        <legend>Groupes :</legend>
                        {availableGroups.map(g => (
                          <label key={g.id} style={{ display: 'block' }}>
                            <input
                              type="radio"
                              name="group"  // Le même nom pour tous les boutons radio
                              value={g.id}
                              checked={formData.groups.includes(g.id)}
                              onChange={() => handleGroupToggle(g.id)}
                            />
                            {g.name}
                          </label>
                        ))}
                      </fieldset>
                      <button type="submit">✅ {editUserId ? 'Mettre à jour' : 'Créer'}</button>
                    </form>
                )}
        

        
        
      </Box>
  )
}

export default UserManagement
