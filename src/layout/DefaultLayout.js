import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated, redirect to login if not
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  // Don't render the layout if not authenticated
  if (!isAuthenticated()) {
    return null
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
