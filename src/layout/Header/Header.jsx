import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/Slice/uiSlice'
import { BsSearch } from 'react-icons/bs'
import { FaArrowRightLong } from "react-icons/fa6";

const getPageTitle = (pathname) => {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const pageTitle = getPageTitle(location.pathname)

  return (
    <header className="
      h-[70px] flex items-center  px-6 gap-4 shrink-0
      /* Glassmorphism Effect */
  bg-transparent
      backdrop-blur-lg 
      border-b border-white/30 dark:border-white/10
      sticky top-0 z-50
    ">
      
      {/* Menu Button with Animated Lines */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="group flex flex-col items-start justify-center w-10 h-10 rounded-xl
                   hover:bg-white/30 dark:hover:bg-white/5 transition-colors duration-300"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <FaArrowRightLong className="w-5 h-5 text-gray-800  mx-auto" />
        ) : (
          <div className="flex flex-col gap-1.5 ml-2.5">
            {/* Line 1 - Base width */}
            <span className="h-0.5 bg-gray-800  rounded-full 
                           w-4 group-hover:w-6 transition-all duration-300 ease-in-out" />
            
            {/* Line 2 - Medium width */}
            <span className="h-0.5 bg-gray-800  rounded-full 
                           w-6 group-hover:w-4 transition-all duration-300 ease-in-out" />
            
            {/* Line 3 - Shorter line that expands */}
            <span className="h-0.5 bg-gray-800  rounded-full 
                           w-3 group-hover:w-6 transition-all duration-300 ease-in-out" />
          </div>
        )}
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800  tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Glassmorphism Search Bar */}
      <div className="flex items-center gap-2
      bg-transparent
                      dark:bg-sidebar-bg
                      backdrop-blur-xl
                      border border-primary/40 dark:border-white/10
                      rounded-sm px-4 py-2
                      shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      focus-within:ring-2 focus-within:ring-primary
                      transition-all duration-300">
        <BsSearch className="w-4 h-4 text-primary dark:text-sidebar-icon font-bold " />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-white
                     placeholder:text-gray-500 
                     dark:placeholder:text-content-text
                     w-32 md:w-48 focus:w-60 transition-all duration-500"
        />
      </div>
    </header>
  )
}

export default Header