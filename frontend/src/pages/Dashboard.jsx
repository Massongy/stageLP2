import React from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="p-4">
      <h2>Bienvenue sur le Dashboard</h2>

    </div>
  )
}

export default Dashboard
