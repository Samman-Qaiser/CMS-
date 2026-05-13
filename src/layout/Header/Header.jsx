import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/Slice/uiSlice'
import { BsSearch } from 'react-icons/bs'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PAGE_TITLE_KEYS = {
  'dashboard':            'nav.dashboard',
  'users':                'nav.users',
  // ... baqi keys same rehti hain
}

function Header() {
  const dispatch    = useDispatch()
  const location    = useLocation()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const currentLang = useSelector((s) => s.language.current)
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    i18n.changeLanguage(currentLang.code)
  }, [currentLang.code])

  // 100px pe glass activate
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const segment   = location.pathname.split('/').filter(Boolean).pop() || 'dashboard'
  const titleKey  = PAGE_TITLE_KEYS[segment]
  const pageTitle = titleKey
    ? t(titleKey)
    : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

  return (
    <header
      className={`
        h-[70px] flex items-center w-full px-6 gap-4 shrink-0
        sticky top-0 z-50 border-b
        transition-all duration-500 ease-in-out
        ${scrolled
          ? `bg-white/10 dark:bg-white/5
             backdrop-blur-sm
             border-white/20 dark:border-white/10
             shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]`
          : 'bg-transparent border-transparent shadow-none backdrop-blur-none'
        }
      `}
    >

      {/* Menu Toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="group flex flex-col items-start justify-center w-10 h-10 rounded-xl
                   hover:bg-white/10 transition-colors duration-300"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <FaArrowRightLong className="w-5 h-5 text-header-text mx-auto" />
        ) : (
          <div className="flex flex-col gap-1.5 ml-2.5">
            <span className="h-0.5 bg-header-text rounded-full w-4 group-hover:w-6 transition-all duration-300" />
            <span className="h-0.5 bg-header-text rounded-full w-6 group-hover:w-4 transition-all duration-300" />
            <span className="h-0.5 bg-header-text rounded-full w-3 group-hover:w-6 transition-all duration-300" />
          </div>
        )}
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-header-text tracking-tight capitalize">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2
                      border border-white/20 dark:border-white/10
                      rounded-sm px-4 py-2
                      focus-within:ring-2 focus-within:ring-primary/50
                      transition-all duration-300">
        <BsSearch className="w-4 h-4 text-header-text/60" />
        <input
          type="text"
          placeholder={t('common.search')}
          className="bg-transparent outline-none text-sm text-header-text
                     placeholder:text-header-text/40
                     w-32 md:w-48 focus:w-60 transition-all duration-500"
        />
      </div>

    </header>
  )
}

export default Header