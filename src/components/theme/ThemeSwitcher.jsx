import { IoDesktopOutline, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { presets } from "../../context/ThemeConfig";
import { useTheme } from "../../context/ThemeProvider";

const ThemeSwitcher = () => {
  const { updateSingleColor, applyPreset, toggleDarkMode, isDarkMode } =
    useTheme();

  const colorOptions = [
    "#e11d48",
    "#0d9488",
    "#2563eb",
    "#f59e0b",
    "#8b5cf6",
    "#334155",
  ];

  const currentThemeSetting = localStorage.getItem("theme") || "system";

  return (
    <div className="p-6 bg-white dark:bg-[#292d4a] rounded-xl shadow-2xl max-w-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Pick your style
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#20203c] border border-slate-200 dark:border-slate-700">
          {isDarkMode ? (
            <>
              <IoMoonOutline className="text-amber-400" />{" "}
              <span className="text-[10px] font-bold dark:text-slate-400 uppercase">
                Dark Mode Active
              </span>
            </>
          ) : (
            <>
              <IoSunnyOutline className="text-orange-500" />{" "}
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Light Mode Active
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Dark Mode Dropdown */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Background Theme
          </label>
          <div className="relative">
            <select
              value={currentThemeSetting}
              onChange={(e) => toggleDarkMode(e.target.value)}
              className="w-full p-2.5 pl-10 bg-slate-50 dark:bg-[#20203c] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold outline-hidden focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Preference</option>
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {currentThemeSetting === "dark" && <IoMoonOutline />}
              {currentThemeSetting === "light" && <IoSunnyOutline />}
              {currentThemeSetting === "system" && <IoDesktopOutline />}
            </div>
          </div>
        </div>

        {/* Primary Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Primary Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => updateSingleColor("--primary", color)}
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-700 transition-all hover:scale-110 cursor-pointer shadow-sm hover:shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Sidebar Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sidebar
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => updateSingleColor("--sidebar", color)}
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-slate-700 transition-all hover:scale-110 cursor-pointer shadow-sm hover:shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(presets).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className="px-4 py-2 bg-slate-100 dark:bg-[#20203c] text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all uppercase tracking-tighter border border-transparent hover:border-primary/20"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="mt-8 w-full py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg font-bold border border-rose-500/20 transition-all cursor-pointer"
      >
        Reset to Factory Settings
      </button>
    </div>
  );
};

export default ThemeSwitcher;
