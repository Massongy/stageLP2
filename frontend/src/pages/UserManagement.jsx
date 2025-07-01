import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import InfoCompte from '../components/ui/infocompte.jsx';
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
        console.log(profile);
        setProfile(profile);
        setCreatedBy(profile.id)

        if (!profile.permissions?.includes('view_user')) {
          setHasPermission(false)
          return
        }
        setHasPermission(true)

        const [userRes, groupRes] = await Promise.all([
          fetch('/api/users/users', { headers: { Authorization: `Bearer ${token}` } }), // il faut ici le bon edpoint pour obtenir la liste users
          fetch('/api/groups/', { headers: { Authorization: `Bearer ${token}` } }), // il faut ici le bon endpoitn pour récupérer les groupes
        ])

        const usersData = await userRes.json()
        const groupsData = await groupRes.json()

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
    e.preventDefault()
    const url = editUserId ? `/api/users/${editUserId}/` : '/api/users/users/'
    const method = editUserId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    if (!res.ok) return alert("Erreur")

    const user = await res.json()
    setUsers(prev => {
      if (editUserId) {
        return prev.map(u => (u.id === editUserId ? user : u))
      } else {
        return [...prev, user]
      }
    })
    setShowForm(false)
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

  return (
      <Box className="container-gestion-compte">
       
          <Box className="titre-gestion-compte"> Gestion du compte</Box>
       
        
        <Box className="info-admin-gestion-compte">
          <Box className="titre-info-admin-gestion-compte">Informations de mon compte administrateur</Box>
          
         <InfoCompte nom={profile.last_name} prenom={profile.first_name} motdepasse="..." email={profile.email}/>
          
        </Box>
<Box className="info-utilisateur-gestion-compte">
        
          <Box className="titre-info-utilisateur-gestion-compte">Mes utilisateurs</Box>
         
<InfoCompte nom="Degas" prenom="Paul" motdepasse="sss" email="k@k"/>
            <InfoCompte nom="Degas" prenom="Paul" motdepasse="sss" email="k@k"/>

        <InfoCompte nom="Degas" prenom="Paul" motdepasse="sss" email="k@k"/>
    </Box>
        
        <Button onClick={handleAdd} className>➕ Ajouter un utilisateur</Button>

        {showForm && (
            <form onSubmit={handleSubmit} style={{ margin: '1rem 0', border: '1px solid #ccc', padding: '1rem' }}>
              <input name="first_name" placeholder="Prénom" value={formData.first_name} onChange={handleChange} required />
              <input name="last_name" placeholder="Nom" value={formData.last_name} onChange={handleChange} required />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="hidden" name="created_by" value={createdBy} onChange={handleChange} required />

              <fieldset>
                <legend>Groupes :</legend>
                {availableGroups.map(g => (
                    <label key={g.name} style={{ display: 'block' }}>
                      <input
                          type="checkbox"
                          checked={formData.groups.includes(g.name)}
                          onChange={() => handleGroupToggle(g.name)}
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
