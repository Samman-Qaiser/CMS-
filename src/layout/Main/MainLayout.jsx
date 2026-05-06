// src/components/layout/MainLayout.jsx
// Yeh sab UI preferences read karke layout apply karta hai

import { useState } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import {
  SIDEBAR_TYPES,
  SIDEBAR_POSITIONS,
  HEADER_POSITIONS,
  LAYOUT_TYPES,
  CONTAINER_LAYOUTS,
} from '../../store/slices/uiSlice'

import Header from './Header'
import SidebarSelector from './SidebarSelector'

// Sidebar components
import SidebarFull      from './sidebars/SidebarFull'
import SidebarMini      from './sidebars/SidebarMini'
import SidebarCompact   from './sidebars/SidebarCompact'
import SidebarOverlay   from './sidebars/SidebarOverlay'
import SidebarModern    from './sidebars/SidebarModern'
import SidebarIconHover from './sidebars/SidebarIconHover'

// ── Sidebar Map ───────────────────────────────────────────
const SIDEBAR_MAP = {
  [SIDEBAR_TYPES.FULL]:       SidebarFull,
  [SIDEBAR_TYPES.MINI]:       SidebarMini,
  [SIDEBAR_TYPES.COMPACT]:    SidebarCompact,
  [SIDEBAR_TYPES.OVERLAY]:    SidebarOverlay,
  [SIDEBAR_TYPES.MODERN]:     SidebarModern,
  [SIDEBAR_TYPES.ICON_HOVER]: SidebarIconHover,
}

// ── Container width classes ───────────────────────────────
const CONTAINER_CLASSES = {
  [CONTAINER_LAYOUTS.WIDE]:       'w-full',
  [CONTAINER_LAYOUTS.BOXED]:      'max-w-7xl mx-auto',
  [CONTAINER_LAYOUTS.WIDE_BOXED]: 'max-w-screen-2xl mx-auto',
}

// ============================================================
// MAIN LAYOUT
// ============================================================
function MainLayout({ children }) {
  const [customizerOpen, setCustomizerOpen] = useState(false)

  const {
    sidebarType,
    sidebarPosition,
    sidebarOpen,
    headerPosition,
    layoutType,
    containerLayout,
    darkMode,
  } = useAppSelector((state) => state.ui)

  const ActiveSidebar    = SIDEBAR_MAP[sidebarType] || SidebarFull
  const containerClass   = CONTAINER_CLASSES[containerLayout] || 'w-full'
  const isHorizontal     = layoutType === LAYOUT_TYPES.HORIZONTAL
  const isSidebarFixed   = sidebarPosition === SIDEBAR_POSITIONS.FIXED
  const isHeaderFixed    = headerPosition === HEADER_POSITIONS.FIXED
  const isOverlaySidebar = sidebarType === SIDEBAR_TYPES.OVERLAY

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 ${containerClass}`}>

        {/* ── VERTICAL LAYOUT ── */}
        {!isHorizontal && (
          <>
            {/* Sidebar */}
            <aside
              className={`
                ${isOverlaySidebar ? 'fixed z-30' : isSidebarFixed ? 'sticky top-0 h-screen' : 'relative'}
                shrink-0
              `}
            >
              <ActiveSidebar isOpen={sidebarOpen} />
            </aside>

            {/* Overlay backdrop */}
            {isOverlaySidebar && sidebarOpen && (
              <div className="fixed inset-0 bg-black/40 z-20" />
            )}

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

              {/* Header */}
              <header className={isHeaderFixed ? 'sticky top-0 z-10' : 'relative'}>
                <Header onOpenCustomizer={() => setCustomizerOpen(true)} />
              </header>

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </>
        )}

        {/* ── HORIZONTAL LAYOUT ── */}
        {isHorizontal && (
          <div className="flex flex-col w-full">

            {/* Header with horizontal nav */}
            <header className={isHeaderFixed ? 'sticky top-0 z-10' : 'relative'}>
              <Header
                horizontal
                onOpenCustomizer={() => setCustomizerOpen(true)}
              />
            </header>

            {/* Page Content — no sidebar */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        )}
      </div>

      {/* ── Theme Customizer Panel ── */}
      <SidebarSelector
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
      />
    </div>
  )
}

export default MainLayout