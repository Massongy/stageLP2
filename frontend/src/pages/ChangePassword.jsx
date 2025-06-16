import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('access')
      await api.patch(
        '/api/users/change-password/',
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      navigate('/')
    } catch (err) {
      setMessage('Error changing password')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border w-full p-2"
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border w-full p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
