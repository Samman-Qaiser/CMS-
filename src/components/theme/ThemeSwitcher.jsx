import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useTheme } from "../../context/ThemeProvider";
import { presets } from "../../context/ThemeConfig";
import CustomSelector from "../selectors/CustomSelector";
import { setSidebarType, SIDEBAR_TYPES, setContainerLayout, setHeaderPosition, setSidebarPosition, setFontFamily } from '../../redux/Slice/uiSlice'
import { useDispatch, useSelector } from "react-redux";

// ─── CSS variable to preset key mapping ──────────────────────────────────────
// Har ColorGrid ka cssVar ThemeConfig ke variables se match karna chahiye
const colorOptions = [
  "none",
  "#3EB88F", "#FF6A59", "#FF9F59", "#3459FF", "#348FFF",
  "#34B3FF", "#B359FF", "#86A373", "#6259FF", "#C11A4D", "#30363D"
];

const ThemeSwitcher = ({ onClose }) => {
  const { updateSingleColor, applyPreset, toggleDarkMode, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Theme");
  const dispatch = useDispatch();

  const currentLayout = useSelector((state) => state.ui.containerLayout);
  const headerPosition = useSelector((state) => state.ui.headerPosition);
  const sidebarPosition = useSelector((state) => state.ui.sidebarPosition);
  const sidebarType = useSelector((state) => state.ui.sidebarType);
  const currentFont = useSelector((state) => state.ui.fontFamily);

  const layoutOptions = [
    { label: 'Wide', value: 'wide' },
    { label: 'Boxed', value: 'boxed' },
    { label: 'Wide Boxed', value: 'wide_boxed' }
  ];

  const positionOptions = [
    { label: "Fixed", value: "fixed" },
    { label: "Static", value: "static" }
  ];

  const fontOptions = [
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Helvetica', value: 'HelveticaNeue' }
  ];

  const sidebarTypesOptions = [
    { label: 'Full', value: SIDEBAR_TYPES.FULL },
    { label: 'Mini', value: SIDEBAR_TYPES.MINI },
    { label: 'Compact', value: SIDEBAR_TYPES.COMPACT },
    { label: 'Modern', value: SIDEBAR_TYPES.MODERN },
    { label: 'Overlay', value: SIDEBAR_TYPES.OVERLAY },
    { label: 'Icon Hover', value: SIDEBAR_TYPES.ICON_HOVER },
  ];

  const currentThemeSetting = localStorage.getItem("theme") || "system";

  // ─── ColorGrid: ab properly variable update karta hai ──────────────────────
  const ColorGrid = ({ title, cssVar }) => {
    // Current active color get karo CSS se
    const currentColor = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();

    const handleColorClick = (color) => {
      const value = color === "none" ? "transparent" : color;

      // updateSingleColor se variable update karo
      // Yeh localStorage mein bhi save karega
      updateSingleColor(cssVar, value);

      // Agar dark mode on hai toh dark overrides re-apply honge
      // (ThemeProvider ka applyPreset logic handle karta hai)
    };

    return (
      <div className="flex flex-col gap-3">
        <label className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color, index) => {
            const isActive =
              color !== "none" &&
              currentColor.toLowerCase() === color.toLowerCase();

            return (
              <button
                key={index}
                onClick={() => handleColorClick(color)}
                className="w-9 h-9 rounded-md border transition-all hover:scale-110 cursor-pointer shadow-sm relative overflow-hidden"
                style={{
                  backgroundColor: color === "none" ? "white" : color,
                  // Active color pe ring dikhao
                  outline: isActive ? `2px solid ${color}` : "none",
                  outlineOffset: "2px",
                  border: isActive
                    ? "2px solid white"
                    : "1px solid rgba(0,0,0,0.1)",
                }}
                title={color === "none" ? "Reset" : color}
              >
                {color === "none" && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ccc_45%,#ccc_55%,transparent_55%)]" />
                )}
                {/* Active checkmark */}
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-[60vw] overflow-y-auto fixed right-16 bottom-0 flex-col h-[90vh] bg-white dark:bg-[#1a1a1a]">
      
      {/* Header */}
      <div className="flex relative items-center justify-between p-6 bg-white dark:bg-[#1a1a1a] border-b border-slate-50 dark:border-white/5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Pick your style
        </h2>
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

      {/* Tabs */}
      <div className="flex bg-[#F1F1F1] dark:bg-black/40 p-1 mx-0">
        {["Theme", "Header", "Content"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[16px] transition-all cursor-pointer
              ${activeTab === tab
                ? "bg-white dark:bg-[#333] text-black dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 custom-scrollbar flex-1">
        {activeTab === "Theme" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Primary color update karta hai --primary variable */}
              <ColorGrid title="Primary Color" cssVar="--primary" />
              {/* Nav header background */}
              <ColorGrid title="Navigation Header" cssVar="--nav-headbg" />
              {/* Sidebar background */}
              <ColorGrid title="Sidebar" cssVar="--sidebar-bg" />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Secondary color */}
              <ColorGrid title="Secondary Color" cssVar="--secondary" />
              {/* Header background */}
              <ColorGrid title="Header" cssVar="--headerbg" />

              {/* Dark/Light mode selector */}
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
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
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
          <div className="grid grid-cols-2 text-slate-400">
            <CustomSelector
              label="Layout"
              options={layoutOptions}
              value={currentLayout}
              onChange={(val) => dispatch(setContainerLayout(val))}
            />
            <CustomSelector
              label="Header Position"
              options={positionOptions}
              value={headerPosition}
              onChange={(val) => dispatch(setHeaderPosition(val))}
            />
            <CustomSelector
              label="Sidebar Type"
              options={sidebarTypesOptions}
              value={sidebarType}
              onChange={(val) => dispatch(setSidebarType(val))}
            />
            <CustomSelector
              label="Sidebar Position"
              options={positionOptions}
              value={sidebarPosition}
              onChange={(val) => dispatch(setSidebarPosition(val))}
            />
          </div>
        )}

        {activeTab === "Content" && (
          <div className="grid grid-cols-2">
            <CustomSelector
              label="Container Layout"
              options={layoutOptions}
              value={currentLayout}
              onChange={(val) => dispatch(setContainerLayout(val))}
            />
            <CustomSelector
              label="Font Family"
              options={fontOptions}
              value={currentFont}
              onChange={(val) => dispatch(setFontFamily(val))}
            />
          </div>
        )}
      </div>

      {/* Footer */}
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