import { useState } from 'react'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Checkbox = ({ checked: controlledChecked, onChange }: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(false)
  
  // Use controlled state if provided, otherwise use internal state
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked
  
  const handleClick = () => {
    const newChecked = !isChecked
    if (onChange) {
      onChange(newChecked)
    } else {
      setInternalChecked(newChecked)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className="w-[12px] h-[12px] border-[1px] border-black rounded-none flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      type="button"
    >
      {isChecked && (
        <svg 
          width="7" 
          height="5" 
          viewBox="0 0 7 5" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 2.5L2.5 4L6 0.5" 
            stroke="black" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}

export default Checkbox