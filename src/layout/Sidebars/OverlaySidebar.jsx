
// ============================================================
// OVERLAY SIDEBAR
// ============================================================
// OverlaySidebar.jsx
function OverlaySidebar() {
  const role        = useSelector((s) => s.auth.role);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const navItems    = getNavItemsByRole(role?.toLowerCase());

  return (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          style={{ top: '72px' }} // header height ke barabar
        />
      )}

      {/* Sidebar — fixed, header ke neeche */}
      <aside
        className={`
          fixed left-0 bottom-0 z-50 flex flex-col
          bg-sidebar-bg
          border-r border-gray-100 dark:border-white/5
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-[20%]" : "w-0"}
        `}
        style={{ top: '72px' }} // header height match karo
      >
        <nav className={`
          flex-1 overflow-y-auto py-4 px-3
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          dark:[&::-webkit-scrollbar-thumb]:bg-white/10
        `}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.id} item={item} depth={0} />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default OverlaySidebar;