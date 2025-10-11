import './App.css'
import './config/amplify' // Initialize Amplify configuration
import { useState } from 'react'
import { Header, MainContent, Sidebar } from './components'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="min-h-screen bg-white">
          <Header onMenuClick={handleMenuClick} />
          <MainContent />
          <Sidebar isOpen={isSidebarOpen} />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App
