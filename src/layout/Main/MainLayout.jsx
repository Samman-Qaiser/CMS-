// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SIDEBAR_TYPES } from '../../redux/Slice/uiSlice'
import ControlPanel from '../../components/theme/ControlPanel'
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
  const { sidebarType } = useSelector((state) => state.ui)
  const ActiveSidebar   = SIDEBAR_MAP[sidebarType] || SidebarFull

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <ActiveSidebar />

      {/* Right side */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header */}
        <Header />

        {/* Pages */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
 <ControlPanel />
      </div>
    </div>
  )
}

export default MainLayout