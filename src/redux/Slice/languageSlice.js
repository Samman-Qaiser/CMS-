// src/redux/Slice/languageSlice.js
import { createSlice } from '@reduxjs/toolkit'

// src/redux/Slice/languageSlice.js
export const LANGUAGES = [
  { code: 'en', label: 'English',  flag: 'https://flagcdn.com/w40/us.png', dir: 'ltr' },
  { code: 'ur', label: 'اردو',     flag: 'https://flagcdn.com/w40/pk.png', dir: 'rtl' },
  { code: 'ar', label: 'العربية', flag: 'https://flagcdn.com/w40/sa.png', dir: 'rtl' },
  { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/w40/fr.png', dir: 'ltr' },
  { code: 'de', label: 'Deutsch',  flag: 'https://flagcdn.com/w40/de.png', dir: 'ltr' },
  { code: 'es', label: 'Español',  flag: 'https://flagcdn.com/w40/es.png', dir: 'ltr' },
]

const STORAGE_KEY = 'ui-language'

const getSavedLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((l) => l.code === saved) || LANGUAGES[0]
  } catch {
    return LANGUAGES[0]
  }
}

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    current: getSavedLang(),
  },
  reducers: {
    setLanguage: (state, action) => {
      const lang = LANGUAGES.find((l) => l.code === action.payload)
      if (!lang) return
      state.current = lang
      try {
        localStorage.setItem(STORAGE_KEY, lang.code)
        // RTL/LTR support — html dir attribute change karo
        document.documentElement.dir  = lang.dir
        document.documentElement.lang = lang.code
      } catch {}
    },
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer