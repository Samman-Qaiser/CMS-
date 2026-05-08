// src/components/Sidebars/OverlaySidebar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getNavItemsByRole } from "../../utils/navItems";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { useTranslation } from "react-i18next"; // ← add

// ── Nav Item ─────────────────────────────────────────────────
function NavItem({ item, depth = 0 }) {
  const location          = useLocation();
  const [open, setOpen]   = useState(false);
  const [hovered, setHov] = useState(false);
  const hasChildren       = item.children?.length > 0;
  const Icon              = item.icon;
  const { t }             = useTranslation(); // ← add

  const isActive = item.path
    ? location.pathname === item.path
    : item.children?.some((c) => location.pathname.startsWith(c.path || ""));

  // ── Sub-leaf (depth > 0, no children) ────────────────
  if (!hasChildren && depth > 0) {
    return (
      <li>
        <NavLink
          className="text-sidebar-icon"
          to={item.path || "#"}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={({ isActive: a }) => ({
            display: "flex", alignItems: "center", gap: "8px",
            padding: "7px 12px", borderRadius: "6px",
            fontSize: "13px", fontWeight: 400, marginLeft: "16px",
            backgroundColor: "transparent",
            color: a ? "" : "var(--sidebar-text)",
            textDecoration: "none", transition: "color 0.2s",
          })}
        >
          <span style={{
            display: "block", height: "1.5px", flexShrink: 0,
            borderRadius: "2px", backgroundColor: "var(--sidebar-icon)",
            transition: "width 0.25s ease, opacity 0.25s ease",
            width: hovered ? "20px" : "10px",
            opacity: hovered ? 1 : 0.45,
          }} />
          <span style={{
            transition: "transform 0.25s ease, color 0.2s",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            color: hovered ? "" : "inherit",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {t(item.label)} {/* ← add */}
          </span>
        </NavLink>
      </li>
    );
  }

  // ── Top-level leaf ────────────────────────────────────
  if (!hasChildren) {
    return (
      <li>
        <NavLink
          to={item.path || "#"}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={({ isActive: a }) => ({
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 16px", borderRadius: "8px",
            fontSize: "15px", fontWeight: 500,
            backgroundColor: a || hovered ? "var(--primary)" : "transparent",
            color: a || hovered ? "#ffffff" : "var(--sidebar-text)",
            textDecoration: "none",
            transition: "background-color 0.2s, color 0.2s",
          })}
        >
          {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: "inherit" }} />}
          <span className="truncate">{t(item.label)}</span> {/* ← add */}
        </NavLink>
      </li>
    );
  }

  // ── Sub-parent (depth > 0, has children) ─────────────
  if (depth > 0) {
    return (
      <li>
        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          className="w-full flex items-center gap-2 py-2 rounded-md cursor-pointer transition-all duration-200"
          style={{
            fontSize: "13px", fontWeight: 400,
            marginLeft: "16px", paddingLeft: "12px", paddingRight: "12px",
            backgroundColor: "transparent",
            color: "var(--sidebar-text)",
          }}
        >
          <span style={{
            display: "block", height: "1.5px", flexShrink: 0,
            borderRadius: "2px", backgroundColor: "var(--sidebar-icon)",
            transition: "width 0.25s ease, opacity 0.25s ease",
            width: hovered || open ? "20px" : "10px",
            opacity: hovered || open ? 1 : 0.45,
          }} />
          <span className="flex-1 text-left truncate" style={{
            transition: "transform 0.25s ease",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}>
            {t(item.label)} {/* ← add */}
          </span>
          {open
            ? <BsChevronDown  className="w-3 h-3 shrink-0 text-sidebar-icon" />
            : <BsChevronRight className="w-3 h-3 shrink-0 text-sidebar-icon" />
          }
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="mt-1 space-y-0.5">
            {item.children.map((c) => <NavItem key={c.id} item={c} depth={depth + 1} />)}
          </ul>
        </div>
      </li>
    );
  }

  // ── Top-level parent ──────────────────────────────────
  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          fontSize: "15px", fontWeight: 500,
          backgroundColor: open || isActive || hovered ? "var(--primary)" : "transparent",
          color: open || isActive || hovered ? "#ffffff" : "var(--sidebar-text)",
        }}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" style={{ color: "inherit" }} />}
        <span className="flex-1 text-left truncate">{t(item.label)}</span> {/* ← add */}
        {item.badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{
            borderColor: open || isActive || hovered ? "rgba(255,255,255,0.5)" : "var(--sidebar-icon)",
            color: open || isActive || hovered ? "#ffffff" : "var(--sidebar-icon)",
          }}>
            {t(item.badge)} {/* ← add */}
          </span>
        )}
        {open
          ? <BsChevronDown  className="w-3 h-3 shrink-0" />
          : <BsChevronRight className="w-3 h-3 shrink-0" />
        }
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="mt-1 space-y-0.5">
          {item.children.map((c) => <NavItem key={c.id} item={c} depth={depth + 1} />)}
        </ul>
      </div>
    </li>
  );
}

// ============================================================
// OVERLAY SIDEBAR
// ============================================================
function OverlaySidebar() {
  const role        = useSelector((s) => s.auth.role);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const navItems    = getNavItemsByRole(role?.toLowerCase());
  // ← koi useEffect nahi, languageSlice handle karega

  return (
    <>
      <aside
        className={`
          fixed left-0 bottom-0 z-50 flex flex-col
          bg-sidebar-bg
          border-r border-gray-100 dark:border-white/5
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-[20%]" : "w-0"}
        `}
        style={{ top: "72px" }}
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