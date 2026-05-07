import { createSlice } from '@reduxjs/toolkit';

// ── localStorage helpers ──────────────────────────────────
const STORAGE_KEY = 'auth';

const loadAuth = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveAuth = (user, role) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, role }));
  } catch {}
};

const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

// ── Load persisted state ──────────────────────────────────
const persisted = loadAuth();

// ─────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            persisted?.user  ?? null,
    role:            persisted?.role  ?? null,
    isAuthenticated: persisted        ? true : false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, role } = action.payload;
      state.user            = user;
      state.role            = role;
      state.isAuthenticated = true;
      saveAuth(user, role);
    },
    logout: (state) => {
      state.user            = null;
      state.role            = null;
      state.isAuthenticated = false;
      clearAuth();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;