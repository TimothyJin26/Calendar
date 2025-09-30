import './App.css'
import { useState } from 'react'
import { Header, MainContent, Sidebar } from './components'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={handleMenuClick} />
      <MainContent />
      <Sidebar isOpen={isSidebarOpen} />
    </div>
  )
}

export default App
