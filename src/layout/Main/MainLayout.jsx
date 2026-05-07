// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SIDEBAR_TYPES } from '../../redux/Slice/uiSlice'
import ControlPanel     from '../../components/theme/ControlPanel'
import Header           from '../Header/Header'
import SidebarFull      from '../Sidebars/FullSidebar'
import SidebarMini      from '../Sidebars/MiniSidebar'
import SidebarCompact   from '../Sidebars/CompactSidebar'
import SidebarOverlay   from '../Sidebars/OverlaySidebar'
import SidebarModern    from '../Sidebars/ModernSidebar'
import SidebarIconHover from '../Sidebars/IconHoverSidebar'

const SIDEBAR_MAP = {
  [SIDEBAR_TYPES.FULL]:       SidebarFull,
  [SIDEBAR_TYPES.MINI]:       SidebarMini,
  [SIDEBAR_TYPES.COMPACT]:    SidebarCompact,
  [SIDEBAR_TYPES.OVERLAY]:    SidebarOverlay,
  [SIDEBAR_TYPES.MODERN]:     SidebarModern,
  [SIDEBAR_TYPES.ICON_HOVER]: SidebarIconHover,
}

function MainLayout() {
  const { sidebarType, sidebarOpen } = useSelector((state) => state.ui)
  const ActiveSidebar = SIDEBAR_MAP[sidebarType] || SidebarFull
  const isOverlay     = sidebarType === SIDEBAR_TYPES.OVERLAY

  return (
    <div className="flex h-screen overflow-hidden">

      {isOverlay ? (
        // Overlay: sidebar fixed hai, content full width lega
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header — full width, upar fixed rahega */}
          <div className="flex items-center border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 z-30 relative">
            <div className="flex items-center px-6 py-5 shrink-0">
              <img src="./logo-full.png" alt="Logo" className="h-10 object-contain" />
            </div>
            <div className="flex-1">
              <Header />
            </div>
          </div>

          {/* Overlay Sidebar — header ke neeche fixed overlay karega */}
          <ActiveSidebar />

          {/* Main content — full width */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <Outlet />
          </main>

          <ControlPanel />
        </div>
      ) : (
        <>
          <ActiveSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
              <Outlet />
            </main>
            <ControlPanel />
          </div>
        </>
      )}

    </div>
  )
}

export default MainLayout