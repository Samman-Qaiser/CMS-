import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/Slice/uiSlice'
import { BsSearch } from 'react-icons/bs'
import { FaArrowRightLong } from "react-icons/fa6"
import { useEffect, useState } from 'react'

const getPageTitle = (pathname) => {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const pageTitle = getPageTitle(location.pathname)

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
  
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`
      h-[70px] flex items-center w-full px-6 gap-4 shrink-0
      sticky top-0 z-50
      border-b transition-all duration-500
      ${scrolled
        ? 'bg-white/40 dark:bg-sidebar-bg/10 backdrop-blur-sm border-white/30 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        : 'bg-transparent backdrop-blur-none border-transparent shadow-none'
      }
    `}>

      {/* Menu Button */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="group flex flex-col items-start justify-center w-10 h-10 rounded-xl
                   hover:bg-white/30 dark:hover:bg-white/5 transition-colors duration-300"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <FaArrowRightLong className="w-5 h-5 text-header-text mx-auto" />
        ) : (
          <div className="flex flex-col gap-1.5 ml-2.5">
            <span className="h-0.5 bg-header-text rounded-full w-4 group-hover:w-6 transition-all duration-300 ease-in-out" />
            <span className="h-0.5 bg-header-text rounded-full w-6 group-hover:w-4 transition-all duration-300 ease-in-out" />
            <span className="h-0.5 bg-header-text rounded-full w-3 group-hover:w-6 transition-all duration-300 ease-in-out" />
          </div>
        )}
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-header-text tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search Bar */}
      <div className="flex items-center gap-2
                      bg-transparent dark:bg-sidebar-bg
                      backdrop-blur-md
                      border border-primary/40 dark:border-white/10
                      rounded-sm px-4 py-2
                      shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                      focus-within:ring-2 focus-within:ring-primary
                      transition-all duration-300">
        <BsSearch className="w-4 h-4 text-primary dark:text-sidebar-icon font-bold" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-white
                     placeholder:text-gray-500 dark:placeholder:text-content-text
                     w-32 md:w-48 focus:w-60 transition-all duration-500"
        />
      </div>
    </header>
  )
}

export default Header