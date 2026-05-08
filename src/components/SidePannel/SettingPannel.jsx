// src/components/RightPanel/SettingsPanel.jsx
import { BsGear, BsX, BsMoon, BsBell, BsShieldLock, BsGlobe, BsPalette } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeProvider";
import { setContainerLayout } from "../../redux/Slice/uiSlice"; // Adjust import path

const settingGroups = [
  {
    title: "Appearance",
    items: [
      { icon: BsMoon,       label: "Dark Mode",           type: "toggle", key: "darkMode" },
      { icon: BsPalette,    label: "Compact View",        type: "toggle", key: "compact" },
    ],
  },
  {
    title: "Notifications",
    items: [
      { icon: BsBell,       label: "Push Notifications",  type: "toggle", key: "push" },
      { icon: BsBell,       label: "Email Alerts",        type: "toggle", key: "email" },
    ],
  },
  {
    title: "Privacy",
    items: [
      { icon: BsShieldLock, label: "Two-Factor Auth",     type: "toggle", key: "twofa" },
      { icon: BsGlobe,      label: "Public Profile",      type: "toggle", key: "public" },
    ],
  },
];

export default function SettingsPanel({ onClose }) {
  const dispatch = useDispatch();
  const { isDarkMode, toggleDarkMode: toggleDarkTheme } = useTheme();
  const { containerLayout } = useSelector((state) => state.ui);
  
  const [toggles, setToggles] = useState({
    compact: false, push: true, email: false, twofa: true, public: false,
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ui-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setToggles(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Set initial compact view state based on containerLayout
  useEffect(() => {
    setToggles(prev => ({
      ...prev,
      compact: containerLayout === 'boxed'
    }));
  }, [containerLayout]);

  const toggle = (key) => {
    if (key === "darkMode") {
      toggleDarkTheme(isDarkMode ? "light" : "dark");
    } else if (key === "compact") {
      // Toggle between boxed and full width
      const newLayout = !toggles.compact ? 'boxed' : 'full';
      dispatch(setContainerLayout(newLayout));
      setToggles((p) => ({ ...p, [key]: !p[key] }));
    } else {
      setToggles((p) => ({ ...p, [key]: !p[key] }));
    }
  };

  const handleSaveChanges = () => {
    const settingsToSave = {
      compact: toggles.compact,
      push: toggles.push,
      email: toggles.email,
      twofa: toggles.twofa,
      public: toggles.public,
    };
    localStorage.setItem('ui-settings', JSON.stringify(settingsToSave));
    onClose();
  };

  return (
    <div className="flex flex-col  bg-bg-main h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <BsGear className="w-5 h-5" style={{ color: "var(--primary)" }} />
          <h3 className="font-semibold text-base" style={{ color: "var(--content-text, #111827)" }}>
            Settings
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <BsX className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map(({ icon: Icon, label, key }) => {
                const value = key === "darkMode" ? isDarkMode : toggles[key];
                
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => toggle(key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: value ? "var(--primary)" : "var(--sidebar-bg, #f3f4f6)" }}>
                        <Icon className="w-4 h-4" style={{ color: value ? "#fff" : "var(--sidebar-icon, #9ca3af)" }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm" style={{ color: "var(--content-text, #111827)" }}>
                          {label}
                        </span>
                        {key === "compact" && value && (
                          <span className="text-xs text-gray-400 mt-0.5">
                            Boxed layout (max-width: 1000px)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div
                      className="w-10 h-5 rounded-full relative transition-colors duration-200 shrink-0"
                      style={{ backgroundColor: value ? "var(--primary)" : "#d1d5db" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                        style={{ left: value ? "22px" : "2px" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-white/10 shrink-0">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}