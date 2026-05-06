// src/components/Sidebars/FullSidebar.jsx
import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getNavItemsByRole } from '../../utils/navItems'
import { BsChevronRight, BsChevronDown } from 'react-icons/bs'
import { createPortal } from 'react-dom'

// ── Flyout Menu — Portal se render hoga (fixed position) ──
function FlyoutMenu({ item, anchorRef }) {
  const [openChild, setOpenChild] = useState(null)
  const [pos, setPos]             = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ top: rect.top, left: rect.right + 8 })
    }
  }, [anchorRef])

  return createPortal(
    <div
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-[9999]
                 bg-sidebar-bg rounded-xl shadow-xl
                 border border-gray-100 dark:border-white/10
                 min-w-[180px] py-2"
    >
      {/* Header label */}
      <div className="px-4 py-2 text-xs font-semibold text-sidebar-text/60
                      uppercase tracking-wider border-b border-gray-100
                      dark:border-white/10 mb-1">
        {item.label}
      </div>

      {/* No children — direct link */}
      {!item.children?.length && (
        <NavLink
          to={item.path || '#'}
          className={({ isActive }) => `
            block px-4 py-2 text-sm transition-colors
            ${isActive ? 'text-primary font-medium' : 'text-sidebar-text hover:text-primary'}
          `}
        >
          {item.label}
        </NavLink>
      )}

      {/* Children list */}
      {item.children?.map((child) => (
        <div key={child.id} className="relative">
          {child.children?.length ? (
            <>
              <button
                onClick={() => setOpenChild(openChild === child.id ? null : child.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm
                           text-sidebar-text hover:text-primary transition-colors"
              >
                {child.label}
                <BsChevronRight className="w-3 h-3" />
              </button>

              {/* Nested flyout */}
              {openChild === child.id && (
                <div className="absolute left-full top-0 ml-1 z-[9999]
                                bg-sidebar-bg rounded-xl shadow-xl
                                border border-gray-100 dark:border-white/10
                                min-w-[160px] py-2">
                  {child.children.map((sub) => (
                    <NavLink
                      key={sub.id}
                      to={sub.path || '#'}
                      className={({ isActive }) => `
                        block px-4 py-2 text-sm transition-colors
                        ${isActive ? 'text-primary font-medium' : 'text-sidebar-text hover:text-primary'}
                      `}
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          ) : (
            <NavLink
              to={child.path || '#'}
              className={({ isActive }) => `
                block px-4 py-2 text-sm transition-colors
                ${isActive ? 'text-primary font-medium' : 'text-sidebar-text hover:text-primary'}
              `}
            >
              {child.label}
            </NavLink>
          )}
        </div>
      ))}
    </div>,
    document.body
  )
}

// ── Nav Item (recursive) ──────────────────────────────────
function NavItem({ item, depth = 0, collapsed }) {
  const location              = useLocation()
  const [open, setOpen]       = useState(false)
  const [hovered, setHovered] = useState(false)
  const hasChildren           = item.children?.length > 0
  const Icon                  = item.icon
  const anchorRef             = useRef(null)

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname.startsWith(c.path || ''))

  // ── Collapsed mode — icon + flyout on hover ───────────
  if (collapsed && depth === 0) {
    return (
      <li
        ref={anchorRef}
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          title={item.label}
          className={`
            w-full flex items-center justify-center py-3 rounded-xl
            transition-all duration-200
            ${isActive ? 'bg-primary/20 text-white' : ' hover:bg-primary/10'}
          `}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </button>

        {hovered && <FlyoutMenu item={item} anchorRef={anchorRef} />}
      </li>
    )
  }

  // ── Leaf item ─────────────────────────────────────────
  if (!hasChildren) {
    return (
      <li>
        <NavLink
          to={item.path || '#'}
          className={({ isActive: navActive }) => `
            group flex items-center gap-3 px-4 py-2.5 rounded-lg
            transition-all duration-200 cursor-pointer
            ${depth === 0 ? 'text-[15px] font-medium' : 'text-[13px] font-normal ml-4'}
            ${navActive ? 'text-primary' : 'text-sidebar-text hover:text-primary'}
          `}
        >
          {depth > 0 && (
            <span className="relative flex items-center">
              <span className={`
                block h-px bg-primary transition-all duration-300
                ${depth === 1 ? 'w-3 group-hover:w-5' : 'w-2 group-hover:w-4'}
              `} />
            </span>
          )}
          {depth === 0 && Icon && (
            <Icon className="w-5 h-5 shrink-0 text-primary" />
          )}
          <span className="transition-transform duration-200 text-sidebar-text group-hover:text-primary group-hover:-translate-x-0.5 truncate">
            {item.label}
          </span>
        </NavLink>
      </li>
    )
  }

  // ── Parent item ───────────────────────────────────────
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl
          transition-all duration-200 cursor-pointer
          ${depth === 0 ? 'text-[15px] font-medium' : 'text-[13px] font-normal ml-4'}
          ${isActive && !open
            ? 'text-primary'
            : open
            ? 'bg-primary text-white'
            : 'text-sidebar-text hover:text-primary'
          }
        `}
      >
        {depth === 0 && Icon && (
          <Icon className={`w-5 h-5 shrink-0 ${open ? 'text-white' : 'text-primary'}`} />
        )}
        {depth > 0 && (
          <span className={`block h-px w-3 ${open ? 'bg-white' : 'bg-primary'}`} />
        )}
        <span className="flex-1 text-left truncate">{item.label}</span>
        {item.badge && (
          <span className={`
            text-[10px] font-semibold px-2 py-0.5 rounded-full border mr-1
            ${open ? 'border-white/40 text-white' : 'border-primary text-primary'}
          `}>
            {item.badge}
          </span>
        )}
        {open
          ? <BsChevronDown className="w-3 h-3 shrink-0" />
          : <BsChevronRight className="w-3 h-3 shrink-0" />
        }
      </button>

      <div className={`overflow-hidden transition-all duration-300
        ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="mt-1 space-y-0.5">
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} depth={depth + 1} collapsed={false} />
          ))}
        </ul>
      </div>
    </li>
  )
}

// ============================================================
// SIDEBAR FULL
// ============================================================
function FullSidebar() {
  const role        = useSelector((state) => state.auth.role)
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)
  const navItems    = getNavItemsByRole(role?.toLowerCase())

  return (
    <aside className={`
      h-screen shrink-0 rounded-r-[20px] bg-sidebar-bg flex flex-col
      border-r border-gray-100 dark:border-white/5
      transition-all duration-300 ease-in-out overflow-visible
      ${sidebarOpen ? 'w-[260px]' : 'w-[72px]'}
    `}>

      {/* Logo */}
      <div className={`flex items-center border-b border-gray-100 dark:border-white/5
        transition-all duration-300
        ${sidebarOpen ? 'px-6 py-5 justify-start' : 'px-0 py-5 justify-center'}
      `}>
        {sidebarOpen ? (
          <img src='./logo-full.png' alt="Logo" className="h-10 object-contain" />
        ) : (
          <img src='./logo-half.png' alt="Logo" className="h-8 object-contain" />
        )}
      </div>

      {/* Nav — dono states mein overflow-y-auto, overflow-x visible nahi chahiye kyunki portal use ho raha */}
      <nav className={`
        flex-1 overflow-y-auto py-4
        ${sidebarOpen ? 'px-3' : 'px-2'}
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-200
        dark:[&::-webkit-scrollbar-thumb]:bg-white/10
      `}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              depth={0}
              collapsed={!sidebarOpen}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default FullSidebar