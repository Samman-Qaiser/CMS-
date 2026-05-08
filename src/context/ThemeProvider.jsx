import { createContext, useContext, useEffect, useState } from "react";
import { presets } from "./ThemeConfig";

// ─── Presets jinka sidebar light/white hai ────────────────────────────────────
const LIGHT_SIDEBAR_PRESETS = ['default', 'demo3', 'demo5', 'demo8']

// ─── Dark mode overrides ──────────────────────────────────────────────────────
const DARK_MODE_OVERRIDES = {
  "--bg-main": "#20203c",
  "--content-text": "#828690",
  "--headerbg": "#292d4a",
  "--nav-headbg": "#292d4a",
  "--header-text": "#e0e0e0",
}

// Sirf light sidebar presets ke liye
const DARK_SIDEBAR_OVERRIDE = {
  "--sidebar-bg": "#292d4a",
  "--sidebar-text": "#a0a4b8",
}

// ─── Light mode overrides ─────────────────────────────────────────────────────
const LIGHT_MODE_OVERRIDES = {
  "--bg-main": "#F0F0F0",
  "--content-text": "#737B8B",
  "--headerbg": "#E2E2E2",
  "--nav-headbg": "#FFFFFF",
  "--header-text": "#333333",
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  // ─── Saved colors get karo ─────────────────────────────────────────────────
  const getInitialColors = () => {
    const saved = localStorage.getItem("user-theme-custom");
    if (!saved) return presets.default;
    try {
      return JSON.parse(saved);
    } catch {
      return presets.default;
    }
  };

  // ─── Active preset state ───────────────────────────────────────────────────
  const [activePreset, setActivePreset] = useState(() => {
    return localStorage.getItem('active-preset') || 'default'
  })

  // ─── Dark mode state ───────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") return true;
    if (savedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ─── Mount pe saved preset apply karo ─────────────────────────────────────
  useEffect(() => {
    const theme = getInitialColors();
    Object.entries(theme).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });
  }, []);

  // ─── Dark mode toggle ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");

      // Bg/text overrides
      Object.entries(DARK_MODE_OVERRIDES).forEach(([variable, hex]) => {
        document.documentElement.style.setProperty(variable, hex);
      });

      // Sirf light sidebar presets pe sidebar dark karo
      if (LIGHT_SIDEBAR_PRESETS.includes(activePreset)) {
        Object.entries(DARK_SIDEBAR_OVERRIDE).forEach(([variable, hex]) => {
          document.documentElement.style.setProperty(variable, hex);
        });
      }

    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");

      // Light mode mein saved preset ki values wapas
      const saved = getInitialColors();
      Object.entries(LIGHT_MODE_OVERRIDES).forEach(([variable, hex]) => {
        const value = saved[variable] || hex;
        document.documentElement.style.setProperty(variable, value);
      });

      // Sidebar bhi preset ki original value pe wapas
      if (saved["--sidebar-bg"]) {
        document.documentElement.style.setProperty("--sidebar-bg", saved["--sidebar-bg"]);
      }
      if (saved["--sidebar-text"]) {
        document.documentElement.style.setProperty("--sidebar-text", saved["--sidebar-text"]);
      }
    }

    window.dispatchEvent(new Event("themechange"));
  }, [isDarkMode, activePreset]);

  // ─── System theme listener ─────────────────────────────────────────────────
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const userPref = localStorage.getItem("theme");
      if (!userPref) setIsDarkMode(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // ─── Single color update ───────────────────────────────────────────────────
  const updateSingleColor = (variable, hex) => {
    document.documentElement.style.setProperty(variable, hex);
    const currentTheme = getInitialColors();
    const updatedTheme = { ...currentTheme, [variable]: hex };
    localStorage.setItem("user-theme-custom", JSON.stringify(updatedTheme));
  };

  // ─── Full preset apply ─────────────────────────────────────────────────────
  const applyPreset = (themeKey) => {
    const theme = presets[themeKey];
    if (!theme) return;

    // Step 1: Preset ke saare colors apply karo
    Object.entries(theme).forEach(([variable, hex]) => {
      document.documentElement.style.setProperty(variable, hex);
    });

    // Step 2: Active preset update karo
    setActivePreset(themeKey);
    localStorage.setItem('active-preset', themeKey);

    // Step 3: Dark mode on hai toh overrides re-apply karo
    if (isDarkMode) {
      Object.entries(DARK_MODE_OVERRIDES).forEach(([variable, hex]) => {
        document.documentElement.style.setProperty(variable, hex);
      });

      // Light sidebar preset hai toh sidebar bhi dark karo
      if (LIGHT_SIDEBAR_PRESETS.includes(themeKey)) {
        Object.entries(DARK_SIDEBAR_OVERRIDE).forEach(([variable, hex]) => {
          document.documentElement.style.setProperty(variable, hex);
        });
      }
    }

    localStorage.setItem("user-theme-custom", JSON.stringify(theme));
  };

  // ─── Dark mode toggle function ─────────────────────────────────────────────
  const toggleDarkMode = (mode) => {
    if (mode === "system") {
      localStorage.removeItem("theme");
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDarkMode(mode === "dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        updateSingleColor,
        applyPreset,
        isDarkMode,
        toggleDarkMode,
        activePreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);