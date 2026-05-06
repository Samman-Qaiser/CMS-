// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

// ============================================================
// CONSTANTS — Sab options yahan define hain
// Import karke use karo — magic strings mat likho
// ============================================================

export const SIDEBAR_TYPES = {
  FULL:       'full',
  MINI:       'mini',
  COMPACT:    'compact',
  OVERLAY:    'overlay',
  MODERN:     'modern',
  ICON_HOVER: 'icon_hover',
}

export const SIDEBAR_POSITIONS = {
  FIXED:  'fixed',   // scroll karo sidebar wahi rahe
  STATIC: 'static',  // sidebar bhi scroll ho jaye
}

export const HEADER_POSITIONS = {
  FIXED:  'fixed',   // header upar fixed rahe
  STATIC: 'static',  // header bhi scroll ho jaye
}

export const LAYOUT_TYPES = {
  VERTICAL:   'vertical',    // sidebar left mein — default
  HORIZONTAL: 'horizontal',  // nav upar ho
}

export const CONTAINER_LAYOUTS = {
  WIDE:      'wide',       // full width
  BOXED:     'boxed',      // center mein box
  WIDE_BOXED: 'wide_boxed', // wide + content boxed
}

// ============================================================
// HELPER — localStorage se safely read karo
// ============================================================
const getFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? val : fallback
  } catch {
    return fallback
  }
}

const getBoolFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key)
    if (val === null) return fallback
    return val === 'true'
  } catch {
    return fallback
  }
}

// ============================================================
// INITIAL STATE
// ============================================================
const initialState = {
  // ── Sidebar ──────────────────────────────────────────────
  sidebarType:     getFromStorage('ui-sidebar-type',     SIDEBAR_TYPES.FULL),
  sidebarPosition: getFromStorage('ui-sidebar-position', SIDEBAR_POSITIONS.FIXED),
  sidebarOpen:     getBoolFromStorage('ui-sidebar-open', true),   // mobile mein toggle

  // ── Header ───────────────────────────────────────────────
  headerPosition:  getFromStorage('ui-header-position',  HEADER_POSITIONS.FIXED),

  // ── Layout ───────────────────────────────────────────────
  layoutType:      getFromStorage('ui-layout-type',      LAYOUT_TYPES.VERTICAL),
  containerLayout: getFromStorage('ui-container-layout', CONTAINER_LAYOUTS.WIDE),

  // ── Theme ────────────────────────────────────────────────
  darkMode:        getBoolFromStorage('ui-dark-mode',    false),
  fontFamily:      getFromStorage('ui-font',             'Poppins'),
}

// ============================================================
// SLICE
// ============================================================
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {

    // ── Sidebar Type (full, mini, compact, overlay, modern, icon_hover)
    setSidebarType: (state, action) => {
      state.sidebarType = action.payload
      localStorage.setItem('ui-sidebar-type', action.payload)
    },

    // ── Sidebar Position (fixed / static)
    setSidebarPosition: (state, action) => {
      state.sidebarPosition = action.payload
      localStorage.setItem('ui-sidebar-position', action.payload)
    },

    // ── Sidebar Open/Close (mobile toggle)
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
      localStorage.setItem('ui-sidebar-open', state.sidebarOpen)
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
      localStorage.setItem('ui-sidebar-open', action.payload)
    },

    // ── Header Position (fixed / static)
    setHeaderPosition: (state, action) => {
      state.headerPosition = action.payload
      localStorage.setItem('ui-header-position', action.payload)
    },

    // ── Layout Type (vertical / horizontal)
    setLayoutType: (state, action) => {
      state.layoutType = action.payload
      localStorage.setItem('ui-layout-type', action.payload)
    },

    // ── Container Layout (wide / boxed / wide_boxed)
    setContainerLayout: (state, action) => {
      state.containerLayout = action.payload
      localStorage.setItem('ui-container-layout', action.payload)
    },

    // ── Dark Mode
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('ui-dark-mode', state.darkMode)
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
      localStorage.setItem('ui-dark-mode', action.payload)
    },

    // ── Font Family
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload
      localStorage.setItem('ui-font', action.payload)
    },

    // ── Reset — sab default pe le aao
    resetUI: (state) => {
      state.sidebarType     = SIDEBAR_TYPES.FULL
      state.sidebarPosition = SIDEBAR_POSITIONS.FIXED
      state.sidebarOpen     = true
      state.headerPosition  = HEADER_POSITIONS.FIXED
      state.layoutType      = LAYOUT_TYPES.VERTICAL
      state.containerLayout = CONTAINER_LAYOUTS.WIDE
      state.darkMode        = false
      state.fontFamily      = 'Poppins'

      // localStorage bhi clear karo
      const keys = [
        'ui-sidebar-type', 'ui-sidebar-position', 'ui-sidebar-open',
        'ui-header-position', 'ui-layout-type', 'ui-container-layout',
        'ui-dark-mode', 'ui-font',
      ]
      keys.forEach((k) => localStorage.removeItem(k))
    },
  },
})

export const {
  setSidebarType,
  setSidebarPosition,
  toggleSidebar,
  setSidebarOpen,
  setHeaderPosition,
  setLayoutType,
  setContainerLayout,
  toggleDarkMode,
  setDarkMode,
  setFontFamily,
  resetUI,
} = uiSlice.actions

export default uiSlice.reducer