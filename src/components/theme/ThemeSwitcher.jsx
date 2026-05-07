import { useState } from "react";
import { IoSunnyOutline, IoMoonOutline, IoDesktopOutline, IoClose } from "react-icons/io5";
import { useTheme } from "../../context/ThemeProvider";
import { presets } from "../../context/ThemeConfig";
import SidebarSelector from "../../layout/Sidebars/SidebarSelector";
import FontSelector from "../selectors/FontSelector";
import ContainerSelector from "../selectors/ContainerSelector";

const ThemeSwitcher = ({ onClose }) => {
  const { updateSingleColor, toggleDarkMode, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Theme");

  // Screenshot ke mutabiq exact colors
  const colorOptions = [
    "none", // Slashed icon (Reset/None)
    "#3EB88F", "#FF6A59", "#FF9F59", "#3459FF", "#348FFF", "#34B3FF", "#B359FF",
    "#86A373", "#6259FF", "#C11A4D", "#30363D"
  ];

  const currentThemeSetting = localStorage.getItem("theme") || "system";

  // Reusable Color Grid Component
  const ColorGrid = ({ title, cssVar }) => (
    <div className="flex  flex-col gap-3">
      <label className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            onClick={() => updateSingleColor(cssVar, color === "none" ? "transparent" : color)}
            className="w-9 h-9 rounded-md border border-slate-200 dark:border-white/10 transition-all hover:scale-110 cursor-pointer shadow-sm relative overflow-hidden bg-white"
            style={{ backgroundColor: color === "none" ? "white" : color }}
          >
            {color === "none" && (
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ccc_45%,#ccc_55%,transparent_55%)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex w-[60vw] overflow-y-auto fixed right-16 bottom-0 flex-col h-[90vh] bg-white dark:bg-[#1a1a1a]">
      {/* 1. Header Section */}
      <div className="flex relative items-center justify-between p-6 bg-white dark:bg-[#1a1a1a] border-b border-slate-50 dark:border-white/5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pick your style</h2>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-primary text-white px-4 py-2 rounded-md text-[11px] font-bold hover:bg-black transition-all cursor-pointer uppercase tracking-tight"
        >
          Delete All Cookie
        </button>
          <button
      onClick={onClose}
      className="text-slate-400 p-2 cursor-pointer bottom-[83%] z-777 fixed right-6 bg-primary text-white transition-colors p-1"
    >
      <IoClose size={22} />
    </button>
    
      </div>

      {/* 2. Tabs Navigation */}
      <div className="flex bg-[#F1F1F1] dark:bg-black/40 p-1 mx-0">
        {["Theme", "Header", "Content"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[16px]  transition-all cursor-pointer
              ${activeTab === tab 
                ? "bg-white dark:bg-[#333] text-black dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <div className="p-8  custom-scrollbar flex-1">
        {activeTab === "Theme" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Left Column */}
            <div className="space-y-8">
              <ColorGrid title="Primary Color" cssVar="--primary" />
              <ColorGrid title="Navigation Header" cssVar="--nav-header" />
              <ColorGrid title="Sidebar" cssVar="--sidebar" />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ColorGrid title="Secondary Color" cssVar="--secondary" />
              <ColorGrid title="Header" cssVar="--header" />
              
              {/* Background Dropdown Section */}
              <div className="flex flex-col gap-3">
                <label className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
                  Background
                </label>
                <div className="relative group">
                  <select
                    value={currentThemeSetting}
                    onChange={(e) => toggleDarkMode(e.target.value)}
                    className="w-full p-3 pl-4 pr-10 bg-white dark:bg-[#222] border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium outline-none appearance-none cursor-pointer dark:text-white transition-all focus:border-[#5EEAD4]"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Preference</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Header" && (
          <div className="grid grid-cols-2 py-20 text-slate-400">
             <SidebarSelector />
          </div>
        )}

        {activeTab === "Content" && (
          <div className="grid grid-cols-2">
         
          <ContainerSelector />
           <FontSelector />
          </div>
        )}
      </div>

      {/* 4. Footer Note (Optionally included from your screenshot) */}
      <div className="p-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-black/10">
         <p className="text-[11px] text-slate-400 leading-relaxed">
           <span className="text-red-500 font-bold uppercase mr-1">*Note:</span> 
           This theme switcher is not part of the final product. It is only for previewing demo styles.
         </p>
      </div>
    </div>
  );
};

export default ThemeSwitcher;