import Checkbox from './ui/Checkbox'

const TaskBlock = () => (
  <div className="mb-12">
    {/* Header Section - 2x2 Grid Layout */}
    <div className="flex justify-between mb-4 px-4">
      {/* Left Column - Title and Group */}
      <div className="flex flex-col">
        <h2 className="text-base font-semibold text-black font-inter mb-1">
          Block Title
        </h2>
        <div className="bg-[#EEFFE7] px-3 py-1 rounded-full w-fit">
          <span className="text-sm font-normal text-black font-inter">
            group
          </span>
        </div>
      </div>
      
      {/* Right Column - Duration and Date */}
      <div className="flex flex-col items-end">
        <span className="text-base font-semibold text-black font-inter">
          1 week
        </span>
        <span className="text-base font-normal text-black font-inter">
          Sep 29
        </span>
      </div>
    </div>
    
    {/* Checklist Items */}
    <div className="space-y-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Checkbox />
          <span className="text-base font-normal text-black font-inter">
            checkbox
          </span>
        </div>
        <span className="text-base font-normal text-black font-inter">
          1 day
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Checkbox />
          <span className="text-base font-normal text-black font-inter">
            checkbox
          </span>
        </div>
        <span className="text-base font-normal text-black font-inter">
          1 day
        </span>
      </div>
    </div>
    
    {/* Separator Line */}
    <div className="w-full h-px bg-black mt-12"></div>
  </div>
)

export default TaskBlock