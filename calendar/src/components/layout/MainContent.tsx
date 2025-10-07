import TaskBlock from '../TaskBlock'
import { Separator } from '../ui'
import FilterSvg from '../../assets/filter.svg'
import CalendarAllSvg from '../../assets/calendar_all.svg'
import { useTaskBlocks } from '../../hooks/useTaskBlocks'
import { useEffect, useState, useRef } from 'react'

const MainContent = () => {
  const { taskBlocks, loading, error, handleTaskToggle } = useTaskBlocks()
  const [stickyLabel, setStickyLabel] = useState<string>('All')
  const [showNewTaskButton, setShowNewTaskButton] = useState(false)
  const taskBlockRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const labelsRef = useRef<HTMLDivElement>(null)
  const isAtTop = useRef(false)
  const scrollUpCount = useRef(0)
  const lastWheelTime = useRef(0)

  // Define which task blocks should have labels (all blocks for now)
  const labeledBlocks = taskBlocks.map((taskBlock, index) => ({
    blockIndex: index,
    label: taskBlock.dueDate
  }))

  useEffect(() => {
    const handleScroll = () => {
      if (!labelsRef.current) return

      const currentScrollY = window.scrollY
      const stickyPosition = 112 // top-28 = 112px
      
      // Update isAtTop flag
      if (currentScrollY === 0) {
        if (!isAtTop.current) {
          // Just reached the top - reset the scroll count
          isAtTop.current = true
          scrollUpCount.current = 0
          lastWheelTime.current = 0
        }
      } else {
        isAtTop.current = false
        scrollUpCount.current = 0
        lastWheelTime.current = 0
        // Hide button when scrolled away
        if (currentScrollY > 100 && showNewTaskButton) {
          setShowNewTaskButton(false)
        }
      }
      
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

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      
      // Dismiss button immediately on any scroll down
      if (showNewTaskButton && e.deltaY > 0) {
        setShowNewTaskButton(false)
        scrollUpCount.current = 0
        return
      }
      
      // Only count scroll up attempts when at the top
      if (isAtTop.current && e.deltaY < 0) {
        // Only count as a new scroll gesture if it's been more than 50ms since last wheel event
        // This filters out momentum scrolling which fires many events in quick succession
        if (now - lastWheelTime.current > 50) {
          scrollUpCount.current += 1
          
          // Show button on the second distinct scroll up gesture
          if (scrollUpCount.current >= 2 && !showNewTaskButton) {
            setShowNewTaskButton(true)
          }
        }
        
        lastWheelTime.current = now
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [taskBlocks, labeledBlocks, showNewTaskButton])

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
        
        {/* New Task Button - Hidden above viewport, revealed when scrolling past top */}
        <div 
          className={`transition-all duration-300 ease-out ${
            showNewTaskButton ? 'h-12 opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pb-4">
            <button className="text-gray-700 hover:text-gray-900 font-inter text-sm">
              New Task
            </button>
          </div>
        </div>
        
        {/* Task Blocks Container with Sidebar */}
        <div className="relative" ref={labelsRef}>
          {/* Sticky Label at Top */}
          <div className="sticky top-28 flex items-center gap-4 float-left ml-[-150px] group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-0.5 z-10">
            <div className="transition-transform duration-300 ease-in-out group-hover:rotate-12 group-hover:scale-110">
              <img src={CalendarAllSvg} alt="Calendar" className="w-6 h-6" />
            </div>
            <span className="text-[23px] font-normal font-inter text-black transition-colors duration-300 ease-in-out group-hover:text-blue-600 group-hover:font-medium relative whitespace-nowrap">
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
                  <span className="text-[23px] font-normal font-inter text-gray-600 whitespace-nowrap">
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