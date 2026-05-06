import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/Slice/authSlice';
import uiReducer from '../redux/Slice/uiSlice';
export const store = configureStore({
  reducer: {
   
    auth: authReducer,
    ui:uiReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;