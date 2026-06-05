import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

// Fetch Cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/cart/${userId}`);
      if (response.data.success && response.data.cart) {
        return response.data.cart;
      }
      return { items: [], totalPrice: 0, totalItems: 0 };
    } catch (error) {
      return { items: [], totalPrice: 0, totalItems: 0 };
    }
  }
);

// Add to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity, size }) => {
    const response = await axios.post(`${baseUrl}/api/cart/add`, {
      userId,
      productId,
      quantity,
      size
    });
    return response.data.cart;
  }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, itemId, quantity }) => {
    const response = await axios.put(`${baseUrl}/api/cart/update`, {
      userId,
      itemId,
      quantity
    });
    return response.data.cart;
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, itemId }) => {
    const response = await axios.delete(`${baseUrl}/api/cart/remove`, {
      data: { userId, itemId }
    });
    return response.data.cart;
  }
);

// Clear Cart - SIMPLIFIED VERSION
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId) => {
    await axios.delete(`${baseUrl}/api/cart/clear/${userId}`);
    return { items: [], totalPrice: 0, totalItems: 0 };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    totalItems: 0,
    loading: false,
    error: null,
    couponApplied: null,
    savedAmount: 0
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.couponApplied = null;
      state.savedAmount = 0;
    },
    applyCoupon: (state, action) => {
      state.couponApplied = action.payload.coupon;
      state.savedAmount = action.payload.savedAmount;
    },
    removeCoupon: (state) => {
      state.couponApplied = null;
      state.savedAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      // Update Cart
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalPrice = 0;
        state.totalItems = 0;
        state.couponApplied = null;
        state.savedAmount = 0;
      });
  }
});

export const { clearCartState, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;