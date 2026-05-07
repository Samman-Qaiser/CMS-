import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { ALL_NAV_ITEMS } from "../../utils/navitems";
import logo from "/public/images/logo.png";

const MiniSidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <div className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center bg-sidebar-bg border-r border-gray-200/10 z-50 shadow-lg transition-all duration-300">
      {/* Logo Section */}
      <div className="mb-10 bg-primary w-full flex items-center justify-center py-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Nav Items */}
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
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? // Active State: Primary Background, White Icon
                        "bg-primary text-white shadow-lg shadow-primary/30"
                      : // Inactive State: Uses content-text color 
                        "text-content-text hover:bg-white/10 hover:text-primary"
                  }
                `}
              >
                <item.icon size={22} />
              </button>

              {/* First Level Dropdown */}
              {item.children && isActive && (
                <div className="absolute left-full ml-2 top-0 w-52 bg-sidebar-bg border border-gray-100/10 rounded-lg shadow-2xl py-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  {item.children.map((child) => (
                    <div key={child.id} className="relative group/sub">
                      <a
                        href={child.path || "#"}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-content-text hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <span className="whitespace-nowrap">{child.label}</span>
                        {child.children && (
                          <BsChevronRight
                            size={10}
                            className="ml-2 opacity-50"
                          />
                        )}
                      </a>

                      {/* Second Level Dropdown */}
                      {child.children && (
                        <div className="absolute left-full top-0 ml-1 w-44 bg-sidebar-bg border border-gray-100/10 rounded-lg shadow-2xl py-2 hidden group-hover/sub:block animate-in fade-in slide-in-from-left-1">
                          {child.children.map((subChild) => (
                            <a
                              key={subChild.id}
                              href={subChild.path}
                              className="block px-4 py-2 text-sm text-content-text hover:text-primary hover:bg-primary/5"
                            >
                              {subChild.label}
                            </a>
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
