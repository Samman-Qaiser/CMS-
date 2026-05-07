// src/components/Sidebars/ModernSidebar.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getNavItemsByRole } from "../../utils/navItems";
import { BsChevronRight } from "react-icons/bs";
import { createPortal } from "react-dom";

// ── Nested Sub-Flyout (level 2) ─────────────────────────────
function SubFlyout({ children, anchorRef, onClose }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 6 });
    }
  }, [anchorRef]);

  return createPortal(
    <div
      className="fixed z-[10000] bg-sidebar-bg rounded-2xl shadow-2xl
                 border border-black/5 dark:border-white/10
                 min-w-[180px] py-3 overflow-hidden"
      style={{ top: pos.top, left: pos.left }}
      onMouseLeave={onClose}
    >
      <ul className="space-y-0.5 px-2">
        {children.map((sub) => (
          <li key={sub.id}>
            <NavLink
              to={sub.path || "#"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-xl text-[13px] font-medium
                 transition-all duration-200
                 ${isActive
                  ? "bg-primary text-white"
                  : "text-sidebar-text"
                }`
              }
            >
              {sub.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>,
    document.body,
  );
}

// ── Flyout Row — har child item (with optional nested) ──────
function FlyoutRow({ child, onClose }) {
  const [subOpen, setSubOpen] = useState(false);
  const rowRef = useRef(null);
  const hasNested = child.children?.length > 0;

  return (
    <li
      key={child.id}
      ref={rowRef}
      className="relative"
      onMouseEnter={() => hasNested && setSubOpen(true)}
      onMouseLeave={() => setSubOpen(false)}
    >
      {hasNested ? (
        <button
          className="w-full flex items-center justify-between gap-3 px-3 py-2
                     rounded-xl text-[13px] font-medium transition-all duration-200
                     text-sidebar-text "
        >
          <span>{child.label}</span>
          <BsChevronRight className="w-3 h-3 shrink-0 opacity-50" />
        </button>
      ) : (
        <NavLink
          to={child.path || "#"}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium
             transition-all duration-200
             ${isActive
              ? "bg-primary text-white"
              : "text-sidebar-text "
            }`
          }
        >
          {child.label}
        </NavLink>
      )}

      {subOpen && hasNested && (
        <SubFlyout
          children={child.children}
          anchorRef={rowRef}
          onClose={() => setSubOpen(false)}
        />
      )}
    </li>
  );
}

// ── Main Flyout Panel (level 1) ─────────────────────────────
function FlyoutPanel({ item, anchorRef, onClose }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 6 });
    }
  }, [anchorRef]);

  if (!item.children?.length) return null;

  return createPortal(
    <div
      className="fixed z-[9999] bg-sidebar-bg rounded-2xl shadow-2xl
                 border border-black/5 dark:border-white/10
                 min-w-[200px] py-3 overflow-visible"
      style={{ top: pos.top, left: pos.left }}
      onMouseLeave={onClose}
    >
      {/* Section title */}
      <p className="px-5 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-widest
                    text-sidebar-text opacity-50 border-b border-black/5
                    dark:border-white/10">
        {item.label}
      </p>

      <ul className="mt-2 space-y-0.5 px-2">
        {item.children.map((child) => (
          <FlyoutRow key={child.id} child={child} onClose={onClose} />
        ))}
      </ul>
    </div>,
    document.body,
  );
}

// ── Single Sidebar Item ──────────────────────────────────────
function SidebarItem({ item }) {
  const location = useLocation();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const anchorRef = useRef(null);
  const Icon = item.icon;
  const hasChildren = item.children?.length > 0;

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname.startsWith(c.path || ""));

  const content = (
    <div className="flex flex-col gap-[1px]">
      <span className="relative flex items-center justify-center w-25 h-10 rounded-2xl
                        transition-all duration-200 shrink-0
                        group-hover:[&>svg]:scale-110">
        {Icon && (
          <Icon className="w-5 h-5 transition-all text-sidebar-icon duration-200" />
        )}
      </span>

      <span className="text-[13.125px] text-center leading-tight
                        transition-colors text-sidebar-text duration-200">
        {item.label}
      </span>

      {item.badge && (
        <span className="text-[11px] font-semibold rounded-full text-sidebar-icon mt-2">
          {item.badge}
        </span>
      )}
    </div>
  );

  const sharedClass = `group relative flex flex-col items-center justify-center
    w-full py-3 px-1 rounded-2xl cursor-pointer select-none
    transition-all duration-200`;

  return (
    <li
      ref={anchorRef}
      className="relative w-full"
      onMouseEnter={() => hasChildren && setFlyoutOpen(true)}
      onMouseLeave={() => setFlyoutOpen(false)}
    >
      {hasChildren ? (
        <button className={sharedClass}>{content}</button>
      ) : (
        <NavLink
          to={item.path || "#"}
          className={({ isActive: navActive }) =>
            `${sharedClass} ${navActive ? "" : ""}`
          }
        >
          {content}
        </NavLink>
      )}

      {flyoutOpen && hasChildren && (
        <FlyoutPanel
          item={item}
          anchorRef={anchorRef}
          onClose={() => setFlyoutOpen(false)}
        />
      )}
    </li>
  );
}

// ============================================================
// MODERN SIDEBAR
// ============================================================
function ModernSidebar() {
  const role = useSelector((state) => state.auth.role);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const navItems = getNavItemsByRole(role?.toLowerCase());

  return (
    <aside
      className={`
        h-screen shrink-0 flex flex-col
        bg-sidebar-bg
        border-r border-black/5 dark:border-white/5
        transition-all duration-300 ease-in-out
        overflow-hidden
        ${sidebarOpen ? "w-[10%]" : "w-0"}
      `}
    >
      <div className="flex items-center justify-center py-5 border-b
                      border-black/5 dark:border-white/5 shrink-0">
        <img src="./logo-half.png" alt="Logo" className="h-16 w-16 object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2
                      [&::-webkit-scrollbar]:w-0">
        <ul className="flex flex-col items-center gap-1 w-full">
          {navItems.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default ModernSidebar;