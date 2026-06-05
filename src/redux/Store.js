import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/Slice/authSlice';
import uiReducer from '../redux/Slice/uiSlice';
import cartReducer from '../redux/Slice/cartSlice';
import wishlistReducer from '../redux/Slice/wishlistSlice';
import languageReducer from '../redux/Slice/languageSlice'

export const store = configureStore({
  reducer: {
   
    auth: authReducer,
    ui:uiReducer,
  language: languageReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;