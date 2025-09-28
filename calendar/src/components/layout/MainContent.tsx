import TaskBlock from '../TaskBlock'
import { Separator } from '../ui'
import FilterSvg from '../../assets/filter.svg'
import CalendarAllSvg from '../../assets/calendar_all.svg'
import { useTaskBlocks } from '../../hooks/useTaskBlocks'
import { useEffect, useState, useRef } from 'react'

const MainContent = () => {
  const { taskBlocks, loading, error, handleTaskToggle } = useTaskBlocks()
  const [stickyLabel, setStickyLabel] = useState<string>('All')
  const taskBlockRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const labelsRef = useRef<HTMLDivElement>(null)

  // Define which task blocks should have labels (all blocks for now)
  const labeledBlocks = taskBlocks.map((taskBlock, index) => ({
    blockIndex: index,
    label: taskBlock.dueDate
  }))

  useEffect(() => {
    const handleScroll = () => {
      if (!labelsRef.current) return

      const stickyPosition = 112 // top-28 = 112px
      let activeLabel = labeledBlocks[0]?.label || 'All'

      // Check each labeled block from bottom to top to find which should be active
      // This ensures we only switch when a block reaches the sticky position
      for (let i = labeledBlocks.length - 1; i >= 0; i--) {
        const { blockIndex, label } = labeledBlocks[i]
        const taskBlockElement = taskBlockRefs.current[taskBlocks[blockIndex]?.id]
        
        if (taskBlockElement) {
          const rect = taskBlockElement.getBoundingClientRect()
          
          // If this block's top has reached or passed the sticky position
          if (rect.top <= stickyPosition) {
            activeLabel = label
            break // Use the first (topmost) block that meets this criteria
          }
        }
      }

      setStickyLabel(activeLabel)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [taskBlocks, labeledBlocks])

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
      <div className="w-[39%] max-w-2xl relative">
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
        <div className="relative" ref={labelsRef}>
          {/* Sticky Label at Top */}
          <div className="sticky top-28 flex items-center gap-4 float-left ml-[-150px] group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 z-10">
            <div className="transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110">
              <img src={CalendarAllSvg} alt="Calendar" className="w-6 h-6" />
            </div>
            <span className="text-2xl font-normal font-inter text-black transition-colors duration-300 ease-in-out group-hover:text-blue-600 group-hover:font-medium relative whitespace-nowrap">
              {stickyLabel}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"></div>
            </span>
          </div>
          
          {/* Task Blocks with Positioned Labels */}
          {taskBlocks.map((taskBlock, index) => (
            <div 
              key={taskBlock.id}
              data-task-block-id={taskBlock.id}
              ref={(el) => {taskBlockRefs.current[taskBlock.id] = el}}
              className="relative"
            >
              {/* Individual Label for this Task Block (if specified) */}
              {labeledBlocks.some(lb => lb.blockIndex === index) && (
                <div className="absolute left-[-150px] top-0 flex items-center gap-4 opacity-30 transition-opacity duration-300 hover:opacity-70">
                  <div>
                    <img src={CalendarAllSvg} alt="Calendar" className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-normal font-inter text-gray-600 whitespace-nowrap">
                    {taskBlock.dueDate}
                  </span>
                </div>
              )}
              
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