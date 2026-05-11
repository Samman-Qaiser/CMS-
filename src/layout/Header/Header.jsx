import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/Slice/uiSlice'
import { BsSearch } from 'react-icons/bs'
import { FaArrowRightLong } from "react-icons/fa6"
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const PAGE_TITLE_KEYS = {
  'index':                   'nav.dashboardLight',
  'index-2':                 'nav.dashboardDark',
  'dashboard':               'nav.dashboard',
  'users':                   'nav.users',
  'groups':                  'nav.groups',
  'permissions':             'nav.permissions',
  'courses':                 'nav.courses',
  'profile':                 'nav.profile',
  'message':                 'nav.message',
  'activity':                'nav.activity',
  'schedule':                'nav.schedule',
  'blogs':                   'nav.blogs',
  'comments':                'nav.comment',
  'subscribe':               'nav.subscribers',
  'contact-us':              'nav.contactUs',
  'configurations':          'nav.configurations',
  'instructors':             'nav.instructors',
  'instructor-dashboard':    'nav.instructorDashboard',
  'instructor-courses':      'nav.instructorCourses',
  'instructor-schedule':     'nav.instructorSchedule',
  'instructor-students':     'nav.instructorStudents',
  'instructor-resources':    'nav.instructorResources',
  'instructor-transactions': 'nav.instructorTransactions',
  'instructor-liveclass':    'nav.instructorLiveclass',
  'app-profile':             'nav.profile',
  'post-details':            'nav.postDetails',
  'email-compose':           'nav.compose',
  'email-inbox':             'nav.inbox',
  'email-read':              'nav.read',
  'app-calender':            'nav.calendar',
  'ecom-product-grid':       'nav.productGrid',
  'ecom-product-list':       'nav.productList',
  'ecom-product-detail':     'nav.productDetails',
  'ecom-product-order':      'nav.order',
  'ecom-checkout':           'nav.checkout',
  'ecom-invoice':            'nav.invoice',
  'ecom-customers':          'nav.customers',
  'widget-basic':            'nav.widget',
  'form-element':            'nav.formElements',
  'form-wizard':             'nav.wizard',
  'form-ckeditor':           'nav.ckEditor',
  'form-pickers':            'nav.pickers',
  'form-validation':         'nav.formValidate',
  'table-bootstrap-basic':   'nav.bootstrap',
  'table-datatable-basic':   'nav.datatable',
  'pages':                   'nav.pages',
  'page-error-400':          'nav.error',
  'page-error-403':          'nav.error',
  'page-error-404':          'nav.error',
  'page-error-500':          'nav.error',
  'page-error-503':          'nav.error',
  'page-lock-screen':        'nav.lockScreen',
  'empty-page':              'nav.emptyPage',
}

function Header() {
  const dispatch    = useDispatch()
  const location    = useLocation()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const currentLang = useSelector((s) => s.language.current)
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  // Get the user-selected header background color from CSS variable
  const [headerBgColor, setHeaderBgColor] = useState('')

  useEffect(() => {
    i18n.changeLanguage(currentLang.code)
  }, [currentLang.code])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect to read the --headerbg CSS variable
  useEffect(() => {
    const updateHeaderColor = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const bgColor = computedStyle.getPropertyValue('--headerbg').trim()
      setHeaderBgColor(bgColor)
    }

    updateHeaderColor()
    // Watch for theme changes (like from ThemeSwitcher)
    const observer = new MutationObserver(updateHeaderColor)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    return () => observer.disconnect()
  }, [])

  const segment   = location.pathname.split('/').filter(Boolean).pop() || 'dashboard'
  const titleKey  = PAGE_TITLE_KEYS[segment]
  const pageTitle = titleKey
    ? t(titleKey)
    : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

  // Build dynamic style – if user selected a header color, apply it with glassmorphism mix
  const customHeaderStyle = {}
  if (headerBgColor && headerBgColor !== 'transparent') {
    // Convert the solid color to a rgba version with low opacity for glass effect
    // This creates a beautiful blend: selected color + blur + transparency
    let rgbaColor = headerBgColor
    try {
      // If it's hex, convert to rgba
      if (headerBgColor.startsWith('#')) {
        const r = parseInt(headerBgColor.slice(1, 3), 16)
        const g = parseInt(headerBgColor.slice(3, 5), 16)
        const b = parseInt(headerBgColor.slice(5, 7), 16)
        rgbaColor = `rgba(${r}, ${g}, ${b}, 0.85)`
      } else if (headerBgColor.startsWith('rgb')) {
        // Replace rgb or rgba with a lower opacity version
        if (headerBgColor.startsWith('rgba')) {
          rgbaColor = headerBgColor.replace(/rgba\((.+?)\)/, (_, values) => {
            const parts = values.split(',')
            return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.85)`
          })
        } else {
          rgbaColor = headerBgColor.replace(/rgb\((.+?)\)/, (_, values) => {
            return `rgba(${values}, 0.85)`
          })
        }
      }
    } catch (e) {
      rgbaColor = headerBgColor
    }
    customHeaderStyle.backgroundColor = rgbaColor
    customHeaderStyle.backdropFilter = 'blur(12px)'
    customHeaderStyle.borderBottomColor = 'rgba(255,255,255,0.25)'
  }

  return (
    <header className={`
      h-[70px] flex items-center w-full px-6 gap-4 shrink-0
      sticky top-0 z-50 border-b transition-all duration-500
      ${scrolled
        ? 'bg-white/40 dark:bg-sidebar-bg/10 backdrop-blur-sm border-white/30 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        : 'backdrop-blur-none border-transparent shadow-none'
      }
    `} style={customHeaderStyle}>

      {/* Menu Toggle */}
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
      <h1 className="text-2xl font-bold text-header-text tracking-tight capitalize">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search */}
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
          placeholder={t('common.search')}
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-white
                     placeholder:text-gray-500 dark:placeholder:text-content-text
                     w-32 md:w-48 focus:w-60 transition-all duration-500"
        />
      </div>
    </header>
  )
}

export default Header