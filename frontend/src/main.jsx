import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'

import '@/assets/index.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Edition from './pages/Edition'
import UserManagement from './pages/UserManagement'
import PrivateRoute from './components/PrivateRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    
      <BrowserRouter>
      
          {localStorage.getItem('access') && <Header />}
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                  path="/"
                  element={
                      <PrivateRoute>
                          <Dashboard />
                      </PrivateRoute>
                  }
              />
              <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />

              <Route
                  path="/profile"
                  element={
                      <PrivateRoute>
                          <Profile />
                      </PrivateRoute>
                  }
              />
              <Route
                  path="/change-password"
                  element={
                      <PrivateRoute>
                          <ChangePassword />
                      </PrivateRoute>
                  }
              />
              <Route
                 path="/edition/:reference"
                 element={
                     <PrivateRoute>
                        <Edition />
                     </PrivateRoute>
                 }
             />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </BrowserRouter>
    
  </React.StrictMode>,
)
