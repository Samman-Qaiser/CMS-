// src/components/Header/Header.jsx
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/Slice/uiSlice'
import { BsSearch } from 'react-icons/bs'
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'

const getPageTitle = (pathname) => {
  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard'
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

function Header() {
  const dispatch    = useDispatch()
  const location    = useLocation()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const pageTitle   = getPageTitle(location.pathname)

  return (
    <header className="
      h-[64px] flex items-center px-6 gap-4 shrink-0
      backdrop-blur-md bg-white/30 dark:bg-white/5
      border-b border-white/40 dark:border-white/10
      shadow-sm sticky top-0 z-10
    ">
      {/* Toggle button — fold/unfold icon changes with state */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="flex items-center justify-center w-9 h-9 rounded-lg
                   text-primary hover:bg-primary/10 transition-all duration-200"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen
          ? <RiMenuFoldLine className="w-5 h-5" />
          : <RiMenuUnfoldLine className="w-5 h-5" />
        }
      </button>

      {/* Page Title */}
      <h1 className="text-[20px] font-bold text-gray-800 dark:text-white tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search — glassmorphism pill */}
      <div className="flex items-center gap-2
                      bg-white/50 dark:bg-white/10
                      border border-white/60 dark:border-white/10
                      rounded-full px-4 py-2 backdrop-blur-sm">
        <BsSearch className="w-4 h-4 text-primary shrink-0" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none text-sm text-gray-700
                     placeholder:text-gray-400 dark:text-white
                     w-32 focus:w-48 transition-all duration-300"
        />
      </div>
    </header>
  )
}

export default Header