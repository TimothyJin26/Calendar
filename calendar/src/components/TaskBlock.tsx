import { Checkbox } from './ui'
import type { TaskBlock as TaskBlockType } from '../types'

interface TaskBlockProps {
  data: TaskBlockType
  onTaskToggle?: (blockId: string, taskId: string) => void
}

const TaskBlock = ({ data, onTaskToggle }: TaskBlockProps) => (
  <div className="pb-16">
    {/* Header Section - 2x2 Grid Layout */}
    <div className="flex justify-between mb-6 px-4">
      {/* Left Column - Title and Group */}
      <div className="flex flex-col min-w-0 flex-1 items-start">
        <h2 className="text-base font-semibold text-black font-inter mb-3 whitespace-nowrap">
          {data.title}
        </h2>
        <div 
          className="px-3 py-1 rounded-full w-fit"
          style={{ backgroundColor: data.groupColor }}
        >
          <span className="text-sm font-normal text-black font-inter">
            {data.group}
          </span>
        </div>
      </div>
      
      {/* Right Column - Time Left and Due Date */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-base font-semibold text-black font-inter">
          {data.timeLeft}
        </span>
        <span className="text-base font-normal text-black font-inter">
          {data.dueDate}
        </span>
      </div>
    </div>
    
    {/* Checklist Items */}
    <div className="space-y-2 px-4">
      {data.tasks.map((task) => (
        <div key={task.id} className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={task.completed}
              onChange={() => onTaskToggle?.(data.id, task.id)}
            />
            <span className={`text-base font-normal font-inter ${task.completed ? 'line-through text-gray-500' : 'text-black'}`}>
              {task.text}
            </span>
          </div>
          <span className="text-base font-normal text-black font-inter">
            {task.timeLeft}
          </span>
        </div>
      ))}
    </div>
  </div>
)

export default TaskBlock