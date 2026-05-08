// src/components/Sidebars/FullSidebar.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getNavItemsByRole } from "../../utils/navItems";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// ── Flyout Menu ──
function FlyoutMenu({ item, anchorRef }) {
  const [openChild, setOpenChild] = useState(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.top, left: rect.right + 8 });
    }
  }, [anchorRef]);

  return createPortal(
    <div
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-[9999] bg-sidebar-bg rounded-xl shadow-xl border border-gray-100 dark:border-white/10 min-w-[180px] py-2"
    >
      <div
        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b border-gray-100 dark:border-white/10 mb-1"
        style={{ color: "var(--sidebar-text)", opacity: 0.6 }}
      >
        {t(item.label)}
      </div>

      {!item.children?.length && (
        <NavLink
          to={item.path || "#"}
          style={({ isActive }) => ({
            display: "block", padding: "8px 16px", fontSize: "14px",
            transition: "all 0.2s",
            backgroundColor: isActive ? "var(--primary)" : "transparent",
            color: isActive ? "#ffffff" : "var(--sidebar-text)",
            borderRadius: isActive ? "8px" : "0",
            margin: isActive ? "2px 4px" : "0",
          })}
        >
          {t(item.label)}
        </NavLink>
      )}

      {item.children?.map((child) => (
        <div key={child.id} className="relative">
          {child.children?.length ? (
            <>
              <button
                onClick={() => setOpenChild(openChild === child.id ? null : child.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors"
                style={{ color: "var(--sidebar-text)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--sidebar-text)"; }}
              >
                {t(child.label)}
                <BsChevronRight className="w-3 h-3" />
              </button>
              {openChild === child.id && (
                <div className="absolute left-full top-0 ml-1 z-[9999] bg-sidebar-bg rounded-xl shadow-xl border border-gray-100 dark:border-white/10 min-w-[160px] py-2">
                  {child.children.map((sub) => (
                    <NavLink
                      key={sub.id}
                      to={sub.path || "#"}
                      style={({ isActive }) => ({
                        display: "block", padding: "8px 16px", fontSize: "14px",
                        transition: "all 0.2s",
                        backgroundColor: isActive ? "var(--primary)" : "transparent",
                        color: isActive ? "#ffffff" : "var(--sidebar-text)",
                        borderRadius: isActive ? "8px" : "0",
                        margin: isActive ? "2px 4px" : "0",
                      })}
                    >
                      {t(sub.label)}
                    </NavLink>
                  ))}
                </div>
              )}
            </>
          ) : (
            <NavLink
              to={child.path || "#"}
              style={({ isActive }) => ({
                display: "block", padding: "8px 16px", fontSize: "14px",
                transition: "all 0.2s",
                backgroundColor: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#ffffff" : "var(--sidebar-text)",
                borderRadius: isActive ? "8px" : "0",
                margin: isActive ? "2px 4px" : "0",
              })}
            >
              {t(child.label)}
            </NavLink>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
}

// ── Nav Item ──
function NavItem({ item, depth = 0, collapsed }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasChildren = item.children?.length > 0;
  const Icon = item.icon;
  const anchorRef = useRef(null);
  const { t } = useTranslation(); // ← sirf t() bas, koi useEffect nahi

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname.startsWith(c.path || ""));

  if (collapsed && depth === 0) {
    return (
      <li ref={anchorRef} className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          title={t(item.label)}
          className="w-full flex items-center justify-center py-3 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: hovered || isActive ? "var(--primary)" : "transparent",
            color: hovered || isActive ? "#ffffff" : "var(--sidebar-icon)",
          }}
        >
          {Icon && <Icon className="w-5 h-5 cursor-pointer" />}
        </button>
        {hovered && <FlyoutMenu item={item} anchorRef={anchorRef} />}
      </li>
    );
  }

  if (!hasChildren) {
    if (depth > 0) {
      return (
        <li>
          <NavLink
            to={item.path || "#"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={({ isActive: navActive }) => ({
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 12px", borderRadius: "6px",
              transition: "color 0.2s", fontSize: "13px", fontWeight: 400,
              marginLeft: "16px", backgroundColor: "transparent",
              color: navActive ? "var(--primary)" : "var(--sidebar-text)",
              textDecoration: "none",
            })}
          >
            <span className="bg-sidebar-icon" style={{
              display: "block", height: "1.5px", flexShrink: 0,
              borderRadius: "2px", transition: "width 0.25s ease",
              width: hovered ? "20px" : "10px", opacity: hovered ? 1 : 0.45,
            }} />
            <span style={{
              transition: "transform 0.25s ease, color 0.2s",
              transform: hovered ? "translateX(3px)" : "translateX(0)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {t(item.label)}
            </span>
          </NavLink>
        </li>
      );
    }

    return (
      <li>
        <NavLink
          to={item.path || "#"}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={({ isActive: navActive }) => ({
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 16px", borderRadius: "8px",
            transition: "background-color 0.2s, color 0.2s",
            fontSize: "15px", fontWeight: 500,
            backgroundColor: navActive || hovered ? "var(--primary)" : "transparent",
            color: navActive || hovered ? "#ffffff" : "var(--sidebar-text)",
            textDecoration: "none",
          })}
        >
          {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: "inherit", transition: "color 0.2s" }} />}
          <span className="truncate">{t(item.label)}</span>
        </NavLink>
      </li>
    );
  }

  if (depth > 0) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full flex items-center gap-2 py-2 rounded-md transition-all duration-200 cursor-pointer"
          style={{
            fontSize: "13px", fontWeight: 400,
            marginLeft: "16px", paddingLeft: "12px", paddingRight: "12px",
            backgroundColor: "transparent",
            color: open || isActive || hovered ? "var(--primary)" : "var(--sidebar-text)",
          }}
        >
          <span className="bg-sidebar-icon" style={{
            display: "block", height: "1.5px", flexShrink: 0,
            borderRadius: "2px", transition: "width 0.25s ease",
            width: hovered || open ? "20px" : "10px", opacity: hovered || open ? 1 : 0.45,
          }} />
          <span className="flex-1 text-left truncate text-sidebar-icon" style={{
            transition: "transform 0.25s ease",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}>
            {t(item.label)}
          </span>
          {open ? <BsChevronDown className="w-3 h-3 shrink-0 text-sidebar-icon" />
                : <BsChevronRight className="w-3 h-3 shrink-0 text-sidebar-icon" />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="mt-1 space-y-0.5">
            {item.children.map((child) => (
              <NavItem key={child.id} item={child} depth={depth + 1} collapsed={false} />
            ))}
          </ul>
        </div>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
        style={{
          fontSize: "15px", fontWeight: 500,
          backgroundColor: open || isActive || hovered ? "var(--primary)" : "transparent",
          color: open || isActive || hovered ? "#ffffff" : "var(--sidebar-text)",
        }}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: "inherit", transition: "color 0.2s" }} />}
        <span className="flex-1 text-left truncate">{t(item.label)}</span>
        {item.badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{
            borderColor: open || isActive || hovered ? "rgba(255,255,255,0.5)" : "var(--sidebar-icon)",
            color: open || isActive || hovered ? "#ffffff" : "var(--sidebar-icon)",
          }}>
            {t(item.badge)}
          </span>
        )}
        {open ? <BsChevronDown className="w-3 h-3 shrink-0" />
              : <BsChevronRight className="w-3 h-3 shrink-0" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="mt-1 space-y-0.5">
          {item.children.map((child) => (
            <NavItem key={child.id} item={child} depth={depth + 1} collapsed={false} />
          ))}
        </ul>
      </div>
    </li>
  );
}

// ── Full Sidebar ──
function FullSidebar() {
  const role = useSelector((state) => state.auth.role);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const navItems = getNavItemsByRole(role?.toLowerCase());
  // ← koi useEffect nahi, koi i18n.changeLanguage nahi
  // languageSlice mein dispatch hone pe i18n.changeLanguage call hoga
  // aur useTranslation() automatically re-render karega

  return (
    <aside
      className={`h-screen shrink-0 rounded-r-[40px] flex flex-col border-r border-gray-100 dark:border-white/5 sticky top-0 transition-all duration-300 ease-in-out overflow-visible ${sidebarOpen ? "w-[260px]" : "w-[72px]"}`}
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      <div className={`flex items-center border-b border-gray-100 dark:border-white/5 transition-all duration-300 ${sidebarOpen ? "px-6 py-5 justify-start" : "px-0 py-5 justify-center"}`}>
        {sidebarOpen
          ? <img src="./logo-full.png" alt="Logo" className="h-10 object-contain" />
          : <img src="./logo-half.png" alt="Logo" className="h-8 object-contain" />
        }
      </div>
      <nav className={`flex-1 overflow-y-auto py-4 ${sidebarOpen ? "px-3" : "px-2"} [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10`}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} depth={0} collapsed={!sidebarOpen} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default FullSidebar;