import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarType, SIDEBAR_TYPES } from '../../redux/Slice/uiSlice'
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";

const OPTIONS = [
  { label: 'Full',       value: SIDEBAR_TYPES.FULL },
  { label: 'Mini',       value: SIDEBAR_TYPES.MINI },
  { label: 'Compact',    value: SIDEBAR_TYPES.COMPACT },
  { label: 'Modern',     value: SIDEBAR_TYPES.MODERN },
  { label: 'Overlay',    value: SIDEBAR_TYPES.OVERLAY },
  { label: 'Icon Hover', value: SIDEBAR_TYPES.ICON_HOVER },
]

function SidebarSelector() {
  const dispatch = useDispatch()
  const sidebarType = useSelector((state) => state.ui.sidebarType)
  const [isOpen, setIsOpen] = useState(false)

  // Current selected label nikalne ke liye
  const selectedLabel = OPTIONS.find(opt => opt.value === sidebarType)?.label || 'Full'

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
        Sidebar
      </label>

      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-4 bg-white dark:bg-[#222] border rounded-xl text-[15px] transition-all cursor-pointer outline-none
            ${isOpen 
              ? 'border-bg-secondary shadow-[0_0_0_1px_#FF6A59]' 
              : 'border-slate-200 dark:border-white/10'
            }`}
        >
          <span className="text-slate-500 dark:text-slate-300">{selectedLabel}</span>
          <IoChevronDownOutline 
            className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#222] border border-slate-100 dark:border-white/5 rounded-xl shadow-xl z-20 overflow-hidden py-1">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    dispatch(setSidebarType(opt.value))
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-5 py-3 text-[15px] transition-all cursor-pointer
                    ${sidebarType === opt.value
                      ? 'bg-[#F9FAFB] dark:bg-white/5 text-slate-900 dark:text-white font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SidebarSelector