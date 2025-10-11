import { useState, useEffect } from 'react'
import ReactLogo from '../../assets/react.svg'
import { useAuth } from '../../contexts/AuthContext'
import { useBoards } from '../../hooks/useBoards'
import { useCreateBoard } from '../../hooks/useCreateBoard'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { boards, loading, error, refetch, addBoardOptimistically } = useBoards()
  const { createNewBoard, loading: creating } = useCreateBoard()
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [showAddBoard, setShowAddBoard] = useState(false)
  const [showAddConnection, setShowAddConnection] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAddingBoard, setIsAddingBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }
  }, [isOpen])

  // Set first board as selected when boards load
  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0].id)
    }
  }, [boards, selectedBoard])

  const handleAddBoardClick = () => {
    setIsAddingBoard(true)
    setNewBoardTitle('')
  }

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) {
      setIsAddingBoard(false)
      return
    }

    try {
      const newBoard = await createNewBoard({ title: newBoardTitle.trim() })
      setNewBoardTitle('')
      setIsAddingBoard(false)
      
      // Optimistically add the board to the UI
      if (newBoard) {
        addBoardOptimistically(newBoard)
      }
      
      // Refresh in the background (silently)
      refetch(true)
    } catch (error) {
      console.error('Failed to create board:', error)
      // If creation failed, refresh to get the actual state
      refetch()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateBoard()
    } else if (e.key === 'Escape') {
      setIsAddingBoard(false)
      setNewBoardTitle('')
    }
  }

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
      <div className="fixed top-16 left-4 h-[calc(100vh-4rem)] w-64 bg-white z-40 flex flex-col">
        <div className="p-6 text-left flex-1 overflow-auto">
          {/* Boards Section */}
          <div className="mb-8">
            <h2 className="text-[18px] font-semibold font-inter text-black mb-6 text-left">
              Board
            </h2>
            
            {loading && (
              <div className="text-gray-500 text-sm pl-5">Loading boards...</div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm pl-5">Error loading boards</div>
            )}
            
            <div className="space-y-[22px]">
              {boards.map((board, index) => (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoard(board.id)}
                  className="block pl-5 text-left w-full hover:opacity-70 text-[16px] font-inter text-black"
                  style={{ 
                    transform: isAnimating ? 'translateX(0)' : 'translateX(-1rem)',
                    opacity: isAnimating ? 1 : 0,
                    transition: `transform 500ms ease ${index * 25}ms, opacity 500ms ease ${index * 25}ms`,
                    fontWeight: selectedBoard === board.id ? '600' : '500'
                  }}
                >
                  {board.title}
                </button>
              ))}
              
              {/* Add Board Input Field */}
              {isAddingBoard && (
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleCreateBoard}
                  autoFocus
                  placeholder="New Board"
                  disabled={creating}
                  className="block pl-5 text-left w-full text-[16px] font-medium font-inter text-black bg-transparent border-none outline-none focus:outline-none placeholder:hover:text-[#afafaf]"
                />
              )}
              
              {/* Add Board Button - Hidden while adding but maintains spacing */}
              <div
                className="relative"
                onMouseEnter={() => !isAddingBoard && setShowAddBoard(true)}
                onMouseLeave={() => setShowAddBoard(false)}
              >
                {!isAddingBoard ? (
                  <button
                    onClick={handleAddBoardClick}
                    className={`text-[15px] pl-5 font-medium font-inter text-[#c9c9c9] hover:text-[#afafaf] transition-all text-left ${
                      showAddBoard ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ fontWeight: '500' }}
                  >
                    + Add Board
                  </button>
                ) : (
                  <div className="text-[15px] pl-5 invisible" style={{ fontWeight: '500' }}>
                    + Add Board
                  </div>
                )}
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
                  className={`flex pl-1 items-center justify-start gap-2 text-[16px] font-inter text-black hover:opacity-70 text-left w-full transform ${
                    isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ 
                    transition: `transform 500ms ease ${(boards.length + 1 + index) * 25}ms, opacity 500ms ease ${(boards.length + 1 + index) * 25}ms`,
                    fontWeight: '500'
                  }}
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
                  className={`flex pl-1 items-center justify-start gap-2 text-[15px] font-inter text-[#c9c9c9] hover:text-[#afafaf] transition-all text-left ${
                    showAddConnection ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ fontWeight: '500' }}
                >
                  <div className="w-5 h-5 border border-dashed border-gray-400 rounded"></div>
                  + Add Connection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sign Out Section - Fixed to bottom */}
        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          <div className="space-y-3">
            {/* User Info */}
            <div className="text-sm text-gray-600 font-inter text-left">
              {user?.signInDetails?.loginId}
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={signOut}
              className="text-[16px] font-inter text-gray-700 hover:text-red-600 transition-colors duration-200 text-left w-full"
              style={{ fontWeight: '500' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar