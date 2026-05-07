import { useState } from "react";
import { Link } from "react-router-dom"; 
import { BsChevronRight } from "react-icons/bs";
import { ALL_NAV_ITEMS } from "../../utils/navitems";
import logo from "/public/images/logo.png";

const MiniSidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const isLightSidebar =
    ["#FFFFFF", "white"].includes(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--sidebar-bg")
        .trim()
        .toUpperCase(),
    ) || !activeItem;

  return (
    <div
      className="h-screen w-20 flex flex-col items-center border-r border-gray-200/10 z-50 shadow-lg transition-all duration-300"
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      {/* Sidebar Header */}
      <div
        className="mb-10 w-full flex items-center justify-center py-4"
        style={{ backgroundColor: "var(--nav-headbg)" }}
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Nav Items Container */}
      <nav className="flex flex-col gap-4 w-full px-2">
        {ALL_NAV_ITEMS.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <div
              key={item.id}
              className="relative group flex justify-center"
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
            >
              {/* Main Icon Button */}
              <button
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center`}
                style={{
                  backgroundColor: isActive
                    ? isLightSidebar
                      ? "var(--primary)"
                      : "var(--primary-hover)"
                    : "transparent",
                  color: isActive ? "#FFFFFF" : "var(--sidebar-icon)",
                }}
              >
                <item.icon size={22} />
              </button>

              {/* First Level Dropdown */}
              {item.children && isActive && (
                <div
                  className="absolute left-full ml-2 top-0 w-52 border border-gray-100/10 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-left-2 duration-200"
                  style={{ backgroundColor: "var(--sidebar-bg)" }}
                >
                  {item.children.map((child) => (
                    <div key={child.id} className="relative group/sub">
                      {/* Changed <a> to <Link> and href to to */}
                      <Link
                        to={child.path || "#"}
                        className="flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200"
                        style={{
                          color: "var(--sidebar-text)",
                          "--hover-bg": isLightSidebar
                            ? "transparent"
                            : "var(--primary-hover)",
                          "--hover-text": isLightSidebar
                            ? "var(--primary)"
                            : "var(--sidebar-text)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isLightSidebar
                            ? "transparent"
                            : "var(--primary-hover)";
                          e.currentTarget.style.color = isLightSidebar
                            ? "var(--primary)"
                            : "var(--sidebar-text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "var(--sidebar-text)";
                        }}
                      >
                        <span className="whitespace-nowrap">{child.label}</span>
                        {child.children && (
                          <BsChevronRight
                            size={10}
                            className="ml-2 opacity-50"
                          />
                        )}
                      </Link>

                      {/* Second Level Dropdown */}
                      {child.children && (
                        <div
                          className="absolute left-full top-0 ml-1 w-44 border border-gray-100/10 rounded-lg shadow-2xl py-2 hidden group-hover/sub:block animate-in fade-in slide-in-from-left-1"
                          style={{ backgroundColor: "var(--sidebar-bg)" }}
                        >
                          {child.children.map((subChild) => (
                            /* Changed <a> to <Link> and href to to */
                            <Link
                              key={subChild.id}
                              to={subChild.path || "#"}
                              className="block px-4 py-2 text-sm transition-all duration-200"
                              style={{ color: "var(--sidebar-text)" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  isLightSidebar
                                    ? "transparent"
                                    : "var(--primary-hover)";
                                e.currentTarget.style.color = isLightSidebar
                                  ? "var(--primary)"
                                  : "var(--sidebar-text)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.color =
                                  "var(--sidebar-text)";
                              }}
                            >
                              {subChild.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default MiniSidebar;
