import { createSlice } from '@reduxjs/toolkit'
import i18n from '../../i18n' // ← yeh missing tha

export const LANGUAGES = [
  { code: 'en', label: 'English',  flag: 'https://flagcdn.com/w40/us.png', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी',   flag: 'https://flagcdn.com/w40/in.png', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: 'https://flagcdn.com/w40/fr.png', dir: 'ltr' },
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
  initialState: { current: getSavedLang() },
  reducers: {
  setLanguage: (state, action) => {
  const lang = LANGUAGES.find((l) => l.code === action.payload)
  if (!lang) return
  state.current = lang
  localStorage.setItem(STORAGE_KEY, lang.code)
  document.documentElement.dir  = lang.dir
  document.documentElement.lang = lang.code
  i18n.changeLanguage(lang.code)
},
  },
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer