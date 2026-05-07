import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFontFamily } from '../../redux/Slice/uiSlice' // Apna path check karlein
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const fonts = ['Roboto', 'Poppins', 'Open Sans', 'HelveticaNeue']

const FontSelector = () => {
  const dispatch = useDispatch()
  const currentFont = useSelector((state) => state.ui.fontFamily) // Redux se current font uthaya
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Bahar click karne par band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFontChange = (font) => {
    dispatch(setFontFamily(font)) // Redux action trigger
    setIsOpen(false)
  }

  return (
    <div className="w-full max-w-[300px]" ref={dropdownRef}>
      <label className="block text-content-text dark:text-white font-semibold mb-2 text-sm transition-colors duration-300">
        Body Font
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 
            border-2 text-content-text rounded-xl transition-all duration-300
            ${isOpen ? 'border-primary ring-1 ring-primary/10 shadow-lg' : 'border-primary'}
          `}
        >
          <span className="dark:text-white text-base font-medium" style={{ fontFamily: currentFont }}>
            {currentFont}
          </span>
          <span className="text-primary">
            {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-50 w-full mt-2  shadow-xl rounded-xl overflow-hidden border border-primary/20">
            {fonts.map((font) => (
              <li
                key={font}
                onClick={() => handleFontChange(font)}
                className={`px-4 py-3 cursor-pointer transition-all text-base
                  ${currentFont === font 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-content-text dark:text-white/80 hover:bg-bg-main hover:text-primary'}
                `}
                style={{ fontFamily: font }}
              >
                {font}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FontSelector