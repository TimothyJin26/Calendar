import { useState, useEffect } from 'react'
import ReactLogo from '../../assets/react.svg'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [selectedBoard, setSelectedBoard] = useState('UBC 2025 Term 1')
  const [showAddBoard, setShowAddBoard] = useState(false)
  const [showAddConnection, setShowAddConnection] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  const boards = ['UBC 2025 Term 1', 'nwPlus', 'Amazon']
  const connections = [
    { name: 'Google Calendar', logo: ReactLogo },
    { name: 'GitHub', logo: ReactLogo },
    { name: 'Slack', logo: ReactLogo },
    { name: 'Asana', logo: ReactLogo },
    { name: 'Jira', logo: ReactLogo }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-16 left-4 h-[calc(100vh-4rem)] w-80 bg-white z-40 overflow-y-auto">
        <div className="p-6 text-left">
          {/* Boards Section */}
          <div className="mb-8">
            <h2 className="text-[18px] font-semibold font-inter text-black mb-6 text-left">
              Board
            </h2>
            
            <div className="space-y-[22px]">
              {boards.map((board, index) => (
                <button
                  key={board}
                  onClick={() => setSelectedBoard(board)}
                  className={`block pl-5 text-left w-full hover:opacity-70 transition-all duration-500 text-[16px] font-inter text-black transform ${
                    selectedBoard === board ? 'font-semibold' : 'font-medium'
                  } ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 25}ms` }}
                >
                  {board}
                </button>
              ))}
              
              {/* Add Board Button */}
              <div
                className="relative -mt-2"
                onMouseEnter={() => setShowAddBoard(true)}
                onMouseLeave={() => setShowAddBoard(false)}
              >
                <button
                  className={`text-[15px] pl-5 font-medium font-inter text-[#c9c9c9] hover:text-[#afafaf] transition-all text-left ${
                    showAddBoard ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  + Add Board
                </button>
              </div>
            </div>
          </div>

          {/* Connections Section */}
          <div>
            <h2 className="text-[18px] font-semibold font-inter text-black mb-6 text-left">
              Connections
            </h2>
            
            <div className="space-y-[22px]">
              {connections.map((connection, index) => (
                <button
                  key={connection.name}
                  className={`flex pl-1 items-center justify-start gap-2 text-[16px] font-medium font-inter text-black hover:opacity-70 transition-all duration-500 text-left w-full transform ${
                    isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(boards.length + 1 + index) * 25}ms` }}
                >
                  <img 
                    src={connection.logo} 
                    alt={connection.name} 
                    className="w-5 h-5" 
                  />
                  {connection.name}
                </button>
              ))}
              
              {/* Add Connection Button */}
              <div
                className="relative -mt-2"
                onMouseEnter={() => setShowAddConnection(true)}
                onMouseLeave={() => setShowAddConnection(false)}
              >
                <button
                  className={`flex pl-1 items-center justify-start gap-2 text-[15px] font-medium font-inter text-[#c9c9c9] hover:text-[#afafaf] transition-all text-left ${
                    showAddConnection ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="w-5 h-5 border border-dashed border-gray-400 rounded"></div>
                  + Add Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar