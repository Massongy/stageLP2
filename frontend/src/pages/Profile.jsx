import React, { useEffect, useState } from 'react'
import { authFetch } from '../services/auth'

function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access')
        const res = await authFetch('/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Erreur lors du chargement du profil')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const handleChange = async (e) => {
    e.preventDefault()
    // Implémenter la mise à jour du profil ici
  }

  return (
    <div className="p-4">
      <h2>Profil</h2>
      {user ? (
        <form onSubmit={handleChange}>
          <input type="text" value={user.first_name} readOnly />
          <input type="text" value={user.last_name} readOnly />
          <input type="email" value={user.email} readOnly />
          <p><strong>Groupes :</strong> {user.groups?.join(', ') || 'Aucun'}</p>
          <p><strong>Permissions :</strong></p>
          <ul>
            {user.permissions?.map((perm, i) => (
                <li key={i}>{perm}</li>
            ))}
          </ul>
        </form>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  )
}

export default Profile
