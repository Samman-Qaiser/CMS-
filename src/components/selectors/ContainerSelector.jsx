import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setContainerLayout } from '../../redux/Slice/uiSlice' // Path check karlein
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const layouts = [
  { label: 'Wide', value: 'wide' },
  { label: 'Boxed', value: 'boxed' },
  { label: 'Wide Boxed', value: 'wide_boxed' }
]

const ContainerSelector = () => {
  const dispatch = useDispatch()
  const currentLayout = useSelector((state) => state.ui.containerLayout)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Dropdown ke bahar click detect karna
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (layoutValue) => {
    dispatch(setContainerLayout(layoutValue))
    setIsOpen(false)
  }

  // Current display label nikalne ke liye
  const selectedLabel = layouts.find(l => l.value === currentLayout)?.label || 'Wide'

  return (
    <div className="w-full max-w-[300px]" ref={dropdownRef}>
      <label className="block text-content-text dark:text-white font-semibold mb-2 text-sm transition-colors duration-300">
        Container
      </label>
      
      <div className="relative">
        {/* Main Box */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 
            border-2 rounded-xl transition-all duration-300
            ${isOpen 
              ? 'border-primary ring-1 ring-primary/10 shadow-lg' 
              : 'border-primary hover:border-primary-hover'}
          `}
        >
          <span className="text-content-text dark:text-white text-base font-medium">
            {selectedLabel}
          </span>
          <span className="text-primary/40 dark:text-white/20">
            {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="
            absolute z-50 w-full mt-2
            shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)]
            rounded-xl overflow-hidden border border-primary/20
            animate-in fade-in slide-in-from-top-2 duration-200
          ">
            {layouts.map((layout) => (
              <li
                key={layout.value}
                onClick={() => handleSelect(layout.value)}
                className={`
                  px-4 py-3 cursor-pointer transition-all text-base
                  ${currentLayout === layout.value 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-content-text dark:text-white/80 hover:bg-bg-main hover:text-primary'}
                `}
              >
                {layout.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ContainerSelector