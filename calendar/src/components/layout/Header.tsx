import MenuIcon from '../ui/MenuIcon'

const Header = () => (
  <div className="fixed top-0 left-0 p-4 z-10">
    <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
      <MenuIcon />
    </button>
  </div>
)

export default Header