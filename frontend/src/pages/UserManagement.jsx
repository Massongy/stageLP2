import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Users from '../components/ui/Users.jsx';
import '../assets/UserManagement.css'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [hasPermission, setHasPermission] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '', created_by: '', groups: [] })
  const [editUserId, setEditUserId] = useState(null)
  const [availableGroups, setAvailableGroups] = useState([])
  const [createdBy, setCreatedBy] = useState([])
  const [profile, setProfile] = useState(null); //recupération données profile

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
/*
        const [userRes, groupRes] = await Promise.all([
          fetch('/api/users/users', { headers: { Authorization: `Bearer ${token}` } }), // il faut ici le bon edpoint pour obtenir la liste users
          fetch('/api/groups/', { headers: { Authorization: `Bearer ${token}` } }), // il faut ici le bon endpoitn pour récupérer les groupes
        ])

        const usersData = await userRes.json()
        const groupsData = await groupRes.json() */

        // en attendant le bon endpoint
       const usersData = [
  {
    id: 0,
    email: "user@example.com",
    first_name: "string",
    last_name: "string",
    groups: ["string"],
    permissions: "string"
  },
  {
    id: 1,
    email: "user1@example.com",
    first_name: "string",
    last_name: "string",
    groups: ["string"],
    permissions: "string"
  }
];


        //en attendant l'endpoint
        const groupsData = [
    { "id": 1, "name": "Gestionnaire Acceor" },
    { "id": 2, "name": "Gestionnaire Options" },
    { "id": 3, "name": "Utilisateur Acceor" },
    { "id": 4, "name": "Utilisateur Options" }
  ]


        setUsers(usersData)
        setAvailableGroups(groupsData)
      } catch (err) {
        setError('Erreur chargement données')
      }
    }

    fetchData()
  }, [token])

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
  console.log('1. Début handleSubmit')
  e.preventDefault()
  
  const url = editUserId ? `api/users/${editUserId}/` : 'api/users/users/'
  const method = editUserId ? 'PUT' : 'POST'
  
  console.log('2. URL:', url, 'Method:', method)
  console.log('3. formData:', formData)
  console.log('4. token:', token ? 'Token présent' : 'Token manquant')
  
  try {
    console.log('5. Envoi de la requête...')
    console.log('5.1 URL complète:', window.location.origin + '/' + url)
    
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    console.log('6. Response reçue, status:', res.status)
    console.log('6.1 Response ok:', res.ok)
    console.log('6.2 Response headers:', [...res.headers.entries()])
    
    // Vérifier le Content-Type de la réponse
    const contentType = res.headers.get('content-type')
    console.log('6.3 Content-Type:', contentType)
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('7. Erreur response:', res.status, errorText)
      return alert("Erreur: " + res.status)
    }
    
    // Lire la réponse comme texte d'abord pour voir ce qu'on reçoit
    console.log('8. Lecture de la réponse...')
    const responseText = await res.text()
    console.log('9. Réponse brute:', responseText)
    
    // Essayer de parser le JSON
    let user
    try {
      user = JSON.parse(responseText)
      console.log('10. JSON parsé avec succès:', user)
    } catch (parseError) {
      console.error('10. Erreur parsing JSON:', parseError)
      console.error('10.1 Réponse qui a causé l\'erreur:', responseText)
      alert('Erreur: Le serveur n\'a pas renvoyé du JSON valide')
      return
    }
    
    const message = editUserId ? 'Utilisateur modifié avec succès!' : 'Utilisateur ajouté avec succès!'
    console.log('11. Message à afficher:', message)
    
    // Forcer l'affichage avec window.alert
    console.log('12. Avant window.alert')
    window.alert(message)
    console.log('13. Après window.alert')
    
    console.log('14. Mise à jour des users...')
    setUsers(prev => {
      console.log('15. Dans setUsers, prev:', prev)
      if (editUserId) {
        const updated = prev.map(u => (u.id === editUserId ? user : u))
        console.log('16. Users après modification:', updated)
        return updated
      } else {
        const updated = [...prev, user]
        console.log('16. Users après ajout:', updated)
        return updated
      }
    })
    
    console.log('17. Avant setShowForm(false)')
    setShowForm(false)
    console.log('18. Fin handleSubmit - SUCCESS')
    
  } catch (error) {
    console.error('19. ERREUR dans handleSubmit:', error)
    console.error('20. Stack trace:', error.stack)
    alert('Erreur lors de la sauvegarde: ' + error.message)
  }
}
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return
    const res = await fetch(`/api/users/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.status === 204) setUsers(prev => prev.filter(u => u.id !== id))
  }

  if (!hasPermission) return <p>⛔ Accès refusé.</p>

  const dataadmin = profile
    ? [{
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name
      }]
    : [];

// a remplacer par l'appel à l'api users/users
  const datausers = [
  {
    "email": "user1@example.com",
    "first_name": "Alice",
    "last_name": "Dupont"
  },
  {
    "email": "user2@example.com",
    "first_name": "Bob",
    "last_name": "Martin"
  },
  {
    "email": "user3@example.com",
    "first_name": "Charlie",
    "last_name": "Durand"
  }
]
            
  return (
      <Box className="container-gestion-compte">
       
          <Box className="titre-gestion-compte"> Gestion du compte</Box>
       
        
        <Box className="info-admin-gestion-compte">
          <Box className="titre-info-admin-gestion-compte">Informations de mon compte administrateur</Box>
          
          <Users datausers={dataadmin}/>
          
        </Box>
<Box className="info-utilisateur-gestion-compte">
        
          <Box className="titre-info-utilisateur-gestion-compte">Mes utilisateurs</Box>
         <Users datausers={datausers}/>

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

        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
          <tr>
            <th>ID</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Groupes</th><th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.last_name}</td>
                <td>{u.first_name}</td>
                <td>{u.email}</td>
                <td>{u.groups?.join(', ')}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>✏️</button>{' '}
                  <button onClick={() => handleDelete(u.id)}>🗑️</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </Box>
  )
}

export default UserManagement
