/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { ALL_NAV_ITEMS } from "../../utils/navitems";
import logo from "/public/images/logo.png";

const CompactSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [isLightSidebar, setIsLightSidebar] = useState(true);

  const checkTheme = () => {
    const bg = getComputedStyle(document.documentElement)
      .getPropertyValue("--sidebar-bg")
      .trim()
      .toUpperCase();
    setIsLightSidebar(["#FFFFFF", "white", "#FFF"].includes(bg));
  };

  useEffect(() => {
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="h-screen w-50 flex flex-col border-r border-gray-200/10 z-50 shadow-lg transition-all duration-300"
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      {/* header */}
      <div
        className="flex items-center mx-auto px-6 py-4 sticky top-0 z-10 transition-colors duration-300"
        style={{ backgroundColor: "var(--nav-headbg)" }}
      >
        <img src={logo} alt="Logo" className="w-20" />
      </div>

      {/* Navigation Body */}
      <nav
        className="flex flex-col items-center gap-1 overflow-y-auto flex-1 transition-all duration-300 group/nav"
        style={{
          height: "calc(100vh - 70px)",
          direction: "rtl",
          scrollbarWidth: "thin",
        }}
      >
        <div
          style={{ direction: "ltr", width: "100%" }}
          className="flex flex-col items-center"
        >
          {ALL_NAV_ITEMS.map((item) => {
            const isOpen = !!openMenus[item.id];

            return (
              <div key={item.id} className="flex flex-col w-full items-center">
                <div
                  onClick={() => toggleMenu(item.id)}
                  className="group flex items-end justify-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200"
                >
                  <div className="relative flex flex-col items-center justify-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor:
                          isOpen && isLightSidebar
                            ? "var(--sidebar-icon)"
                            : isLightSidebar
                              ? "rgba(115, 123, 139, 0.1)"
                              : "rgba(255, 255, 255, 0.15)",
                        color:
                          isOpen && isLightSidebar
                            ? "var(--sidebar-bg)"
                            : "var(--sidebar-text)",
                      }}
                      onMouseEnter={(e) => {
                        if (isLightSidebar && !isOpen) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 106, 89, 0.2)";
                          e.currentTarget.style.color = "var(--sidebar-icon)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isLightSidebar && !isOpen) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(115, 123, 139, 0.1)";
                          e.currentTarget.style.color = "var(--sidebar-text)";
                        }
                      }}
                    >
                      <item.icon
                        size={20}
                        style={{
                          opacity: !isLightSidebar && !isOpen ? 0.8 : 1,
                        }}
                      />
                    </div>

                    {/* Label & Badge */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium text-sm transition-all duration-200"
                          style={{
                            color:
                              isOpen && isLightSidebar
                                ? "var(--sidebar-icon)"
                                : "var(--sidebar-text)",
                            opacity: !isLightSidebar && !isOpen ? 0.8 : 1,
                          }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: isLightSidebar
                                ? "rgba(255, 106, 89, 0.1)"
                                : "transparent",
                              border: isLightSidebar
                                ? "none"
                                : "1px solid var(--sidebar-text)",
                              color: isLightSidebar
                                ? "var(--primary)"
                                : "var(--sidebar-text)",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.children && (
                      <div
                        style={{ color: "var(--sidebar-text)" }}
                        className="absolute bottom-0 -right-5 transition-colors duration-300 mb-1"
                      >
                        {isOpen ? (
                          <BsChevronDown size={11} />
                        ) : (
                          <BsChevronRight size={11} />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Children (1st Level) */}
                {item.children && isOpen && (
                  <div
                    className="flex flex-col items-center mt-1 border-l border-gray-200/10 w-full"
                    style={{
                      color: "var(--sidebar-text)",
                      backgroundColor: !isLightSidebar
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                    }}
                  >
                    {item.children.map((child) => {
                      const hasSubChildren = !!child.children;
                      const isSubOpen = !!openMenus[child.id];
                      return (
                        <div
                          key={child.id}
                          className="flex flex-col items-center w-full"
                        >
                          <a
                            href={child.path || "#"}
                            onClick={(e) => {
                              if (hasSubChildren) {
                                e.preventDefault();
                                toggleMenu(child.id);
                              }
                            }}
                            className="relative px-8 py-2 text-xs transition-all duration-200 rounded-lg"
                          >
                            {child.label}
                            {hasSubChildren && (
                              <div className="absolute left-20 bottom-2 ">
                                {isSubOpen ? (
                                  <BsChevronDown size={12} />
                                ) : (
                                  <BsChevronRight size={12} />
                                )}
                              </div>
                            )}
                          </a>
                          {/* Sub-Children (2nd Level) */}
                          {hasSubChildren && isSubOpen && (
                            <div
                              className="flex flex-col my-1 rounded-lg transition-colors duration-300"
                              style={{
                                backgroundColor: "rgba(115, 123, 139, 0.1)",
                              }}
                            >
                              {child.children.map((sub) => (
                                <a
                                  key={sub.id}
                                  href={sub.path}
                                  className="px-8 py-2 text-xs transition-colors"
                                  style={{ color: "var(--sidebar-text)" }}
                                >
                                  {sub.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <style>{`
        nav {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent; 
        }
        nav:hover {
          scrollbar-color: #E2E2E2 transparent; 
        }
        
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        nav:hover::-webkit-scrollbar-thumb {
          background: #E2E2E2; 
        }

        nav::-webkit-scrollbar-thumb:active {
          background: #D1D1D1;
        }
      `}</style>
    </div>
  );
};

export default CompactSidebar;
