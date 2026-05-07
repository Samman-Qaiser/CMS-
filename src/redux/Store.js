import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/Slice/authSlice';
import uiReducer from '../redux/Slice/uiSlice';
import languageReducer from '../redux/Slice/languageSlice'

export const store = configureStore({
  reducer: {
   
    auth: authReducer,
    ui:uiReducer,
  language: languageReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;