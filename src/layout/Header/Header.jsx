// src/components/Header/Header.jsx
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, SIDEBAR_TYPES } from "../../redux/Slice/uiSlice"; 
import { BsSearch } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";

const getPageTitle = (pathname) => {
  const segment = pathname.split("/").filter(Boolean).pop() || "dashboard";
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
};

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const sidebarType = useSelector((state) => state.ui.sidebarType); // Get current sidebar type
  const pageTitle = getPageTitle(location.pathname);

  // Determine if the toggle button should be hidden
  const hideToggleButton =
    sidebarType === SIDEBAR_TYPES.MINI || sidebarType === SIDEBAR_TYPES.COMPACT;

  return (
    <header
      className="
      h-[64px] flex items-center px-6 gap-4 shrink-0
      bg-white/10 dark:bg-black/10
      backdrop-blur-xl
      border-b border-white/20 dark:border-white/5
      shadow-lg
      sticky top-0 z-10
    "
    >
      {/* Custom Menu Button - Conditionally Rendered */}
      {!hideToggleButton && (
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="group relative flex flex-col items-center justify-center w-9 h-9 rounded-lg
                     hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? (
            /* Arrow icon when sidebar is open */
            <FaArrowRightLong className="w-4 h-4 text-gray-800 dark:text-white" />
          ) : (
            /* Hamburger lines when sidebar is closed */
            <>
              {/* Line 1 */}
              <span className="block h-0.5 rounded-full bg-gray-800 dark:bg-white w-5 -translate-y-1" />

              {/* Line 2 */}
              <span className="block h-0.5 rounded-full bg-gray-800 dark:bg-white w-5 my-1" />

              {/* Line 3 - shorter, grows from right side on hover */}
              <span
                className="block h-0.5 rounded-full bg-gray-800 dark:bg-white 
                             w-3 group-hover:w-5 transition-all duration-300 origin-right"
              />
            </>
          )}
        </button>
      )}

      {/* Page Title */}
      <h1
        className="text-[35px] font-bold text-gray-800 dark:text-white tracking-tight
                     drop-shadow-sm"
      >
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search — mirror-like glassmorphism */}
      <div
        className="flex items-center gap-2
                      bg-white/20 dark:bg-white/5
                      backdrop-blur-lg
                      border border-white/30 dark:border-white/10
                      rounded-full px-4 py-2
                      shadow-inner
                      hover:bg-white/30 dark:hover:bg-white/10 
                      transition-all duration-300
                      hover:shadow-lg"
      >
        <BsSearch className="w-4 h-4 text-gray-600 dark:text-gray-300 shrink-0" />
        <input
          type="text"
          placeholder="Search here..."
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-white
                     placeholder:text-gray-500 dark:placeholder:text-gray-400
                     w-32 focus:w-48 transition-all duration-300"
        />
      </div>
    </header>
  );
}

export default Header;
