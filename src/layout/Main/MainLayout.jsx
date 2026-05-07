// src/components/layout/MainLayout.jsx
// ... (imports same rahengy)

function MainLayout() {
  const { sidebarType } = useSelector((state) => state.ui)
  const ActiveSidebar = SIDEBAR_MAP[sidebarType] || SidebarFull
  const isOverlay = sidebarType === SIDEBAR_TYPES.OVERLAY

  return (
    // Background color yahan main div pe laga dein taake scroll ke waqt blur nazar aaye
    <div className="flex h-screen overflow-hidden bg-bg-main dark:bg-[#0b0e14]">

      {isOverlay ? (
        <div className="flex flex-col flex-1 overflow-hidden relative">
          {/* FIX: Wrapper se solid bg hata diya, sirf border rakha */}
          <div className="flex items-center border-b border-gray-100 dark:border-white/5 z-30 relative">
            <div className="flex items-center px-6 py-5 shrink-0">
              <img src="./logo-full.png" alt="Logo" className="h-10 object-contain" />
            </div>
            <div className="flex-1">
              <Header />
            </div>
          </div>

          <ActiveSidebar />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

          <ControlPanel />
        </div>
      ) : (
        <>
          <ActiveSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header yahan direct glass effect ke sath aayega */}
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
            <ControlPanel />
          </div>
        </>
      )}
    </div>
  )
}