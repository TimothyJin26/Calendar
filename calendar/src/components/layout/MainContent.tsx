import TaskBlock from '../TaskBlock'
import { Separator } from '../ui'
import FilterSvg from '../../assets/filter.svg'

const MainContent = () => (
  <div className="flex justify-center pt-16">
    <div className="w-[38%] max-w-2xl">
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
      
      {/* Task Blocks */}
      <TaskBlock />
      <Separator />
      <TaskBlock />
      <Separator />
      <TaskBlock />
    </div>
  </div>
)

export default MainContent