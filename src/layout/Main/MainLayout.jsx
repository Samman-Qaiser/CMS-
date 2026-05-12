import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SIDEBAR_TYPES } from "../../redux/Slice/uiSlice";
import ControlPanel from "../../components/theme/ControlPanel";
import Header from "../Header/Header";
import SidebarFull from "../Sidebars/FullSidebar";
import SidebarMini from "../Sidebars/MiniSidebar";
import SidebarCompact from "../Sidebars/CompactSidebar";
import SidebarOverlay from "../Sidebars/OverlaySidebar";
import SidebarModern from "../Sidebars/ModernSidebar";
import SidebarIconHover from "../Sidebars/IconHoverSidebar";
import { useEffect } from "react";
import RightPanel from "./SidePannel";
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../redux/Slice/languageSlice'
const SIDEBAR_MAP = {
  [SIDEBAR_TYPES.FULL]: SidebarFull,
  [SIDEBAR_TYPES.MINI]: SidebarMini,
  [SIDEBAR_TYPES.COMPACT]: SidebarCompact,
  [SIDEBAR_TYPES.OVERLAY]: SidebarOverlay,
  [SIDEBAR_TYPES.MODERN]: SidebarModern,
  [SIDEBAR_TYPES.ICON_HOVER]: SidebarIconHover,
};

function MainLayout() {
  const { sidebarType, fontFamily, containerLayout } = useSelector((state) => state.ui);
  
const { t, i18n } = useTranslation()
  const savedCode = localStorage.getItem('ui-language') || 'en'
  const lang = LANGUAGES.find(l => l.code === savedCode)
  if (lang) {
    document.documentElement.dir = lang.dir
    document.documentElement.lang = lang.code
  }

  useEffect(() => {
    document.body.style.fontFamily = `${fontFamily}, sans-serif`;
  }, [fontFamily]);

  const getContainerClass = () => {
    switch (containerLayout) {
      case 'boxed':
        return 'max-w-[1000px] mx-auto w-full shadow-2xl';
      case 'wide_boxed':
        return 'max-w-[1600px] mx-auto w-full';
      default:
        return 'w-[92vw]';
    }
  };

  const ActiveSidebar = SIDEBAR_MAP[sidebarType] || SidebarFull;
  const isOverlay = sidebarType === SIDEBAR_TYPES.OVERLAY;

  return (
  
    <div className={`flex transition-colors duration-300 min-h-screen ${getContainerClass()}`}>

      {!isOverlay && <ActiveSidebar />}

   
      <div
        style={{ backgroundColor: 'var(--bg-main)' }}
        className="flex flex-col flex-1 transition-all duration-500"
      >

        <div className="flex flex-col flex-1">

          {isOverlay ? (
            <div className="flex fixed left-0 top-0 items-center border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 z-30 shrink-0">
              <div className="flex  items-center bg-nav-headbg px-6 py-5 shrink-0">
                <img src="./logo-full.png" alt="Logo" className="h-10 object-contain" />
              </div>
              <div className="flex-1 ">
                <Header />
              </div>
              <ActiveSidebar />
            </div>
          ) : (
          <Header /> 
          )}

     
          <main className="flex-1 p-4 md:p-6 ">
            <Outlet />
          </main>

          <ControlPanel />
        </div>
      </div>

      {containerLayout !== 'wide_boxed' && <RightPanel />}
    </div>
  );
}

export default MainLayout;