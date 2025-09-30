import { MenuIcon } from '../ui'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => (
  <div className="fixed top-0 left-1 p-4 z-10">
    <button 
      onClick={onMenuClick}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
    >
      <MenuIcon />
    </button>
  </div>
)

export default Header