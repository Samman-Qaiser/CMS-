import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const CustomSelector = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select option" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Bahar click detect karke close karna
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Selected label dhundne ke liye
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="w-full  max-w-[300px]" ref={dropdownRef}>
      {label && (
        <label className="block py-2 text-content-text dark:text-white font-semibold mb-2 text-sm transition-colors duration-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 
            border-2 rounded-xl transition-all duration-300
            ${isOpen 
              ? 'border-primary border-[1px] ring-1 ring-primary/10 shadow-lg' 
              : 'border-primary hover:border-primary-hover'}
          `}
        >
          <span className="text-content-text dark:text-white text-base font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="text-primary/40 dark:text-white/20">
            {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {isOpen && (
          <ul className="
            absolute z-50 w-full mt-2 
            shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)]
            rounded-xl overflow-hidden border border-primary/20 bg-bg-main
            animate-in fade-in slide-in-from-top-2 duration-200
          ">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`
                  px-4 py-3 cursor-pointer transition-all text-base
                  ${value === option.value 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-content-text dark:text-white/80 hover:bg-bg-main hover:text-primary'}
                `}
                style={label === "Body Font" ? { fontFamily: option.value } : {}}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CustomSelector