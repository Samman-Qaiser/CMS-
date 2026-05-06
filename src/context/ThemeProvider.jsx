import { createContext, useContext, useEffect, useState } from "react"; 
import { presets } from "./ThemeConfig";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Logic to safely get initial color theme
  const getInitialColors = () => {
    const saved = localStorage.getItem("user-theme-custom");
    if (!saved) return presets.default;
    try {
      return JSON.parse(saved);
    } catch {
      return presets.default;
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Apply colors on mount
  useEffect(() => {
    const theme = getInitialColors();
    Object.entries(theme).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });
  }, []);

  // Sync dark mode class to <html> tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const updateSingleColor = (variable, hex) => {
    document.documentElement.style.setProperty(variable, hex);
    const currentTheme = getInitialColors();
    const updatedTheme = { ...currentTheme, [variable]: hex };
    localStorage.setItem("user-theme-custom", JSON.stringify(updatedTheme));
  };

  const applyPreset = (themeKey) => {
    const theme = presets[themeKey];
    if (!theme) return;
    Object.entries(theme).forEach(([variable, hex]) => {
      document.documentElement.style.setProperty(variable, hex);
    });
    localStorage.setItem("user-theme-custom", JSON.stringify(theme));
  };

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
      value={{ updateSingleColor, applyPreset, isDarkMode, toggleDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
