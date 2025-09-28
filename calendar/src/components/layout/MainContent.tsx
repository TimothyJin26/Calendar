import TaskBlock from '../TaskBlock'
import { Separator } from '../ui'
import FilterSvg from '../../assets/filter.svg'
import CalendarAllSvg from '../../assets/calendar_all.svg'
import { useTaskBlocks } from '../../hooks/useTaskBlocks'

const MainContent = () => {
  const { taskBlocks, loading, error, handleTaskToggle } = useTaskBlocks()

  if (loading) {
    return (
      <div className="flex justify-center pt-16">
        <div className="w-[38%] max-w-2xl">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center pt-16">
        <div className="w-[38%] max-w-2xl">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center pt-16 relative">
      <div className="w-[38%] max-w-2xl relative">
        {/* Title */}
        <h1 
          className="text-[40px] font-bold mb-5 text-left font-inter"
          style={{ color: '#002957' }}
        >
          UBC 2025 Term 1
        </h1>
        
        {/* Filter Button */}
        <div className="flex justify-end px-4 pb-10">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <img src={FilterSvg} alt="Filter" width="18" height="18" />
          </button>
        </div>
        
        {/* Task Blocks Container with Sidebar */}
        <div className="relative">
          {/* Sticky Sidebar - positioned relative to task blocks */}
          <div className="sticky top-16 flex items-center gap-2 float-left ml-[-120px] group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5">
            <div className="transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110">
              <img src={CalendarAllSvg} alt="Calendar" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-normal font-inter text-black transition-colors duration-300 ease-in-out group-hover:text-blue-600 group-hover:font-medium relative">
              All
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            </span>
          </div>
          
          {/* Task Blocks */}
          {taskBlocks.map((taskBlock, index) => (
            <div key={taskBlock.id}>
              <TaskBlock data={taskBlock} onTaskToggle={handleTaskToggle} />
              {index < taskBlocks.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainContent