// src/redux/slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/wishlist/${userId}`);
      console.log("Wishlist fetch response:", response.data);
      
      if (response.data.success && response.data.wishlist) {
        return {
          items: response.data.wishlist.products || [],
          wishlistId: response.data.wishlist._id,
          totalItems: response.data.wishlist.products?.length || 0
        };
      }
      return { items: [], wishlistId: null, totalItems: 0 };
    } catch (error) {
      if (error.response?.status === 404) {
        return { items: [], wishlistId: null, totalItems: 0 };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/api/wishlist/add`, {
        userId,
        productId
      });
      return response.data.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/wishlist/remove`, {
        data: { userId, productId }
      });
      return { productId, wishlist: response.data.wishlist };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/api/wishlist/clear/${userId}`);
      return { items: [], wishlistId: null, totalItems: 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async ({ userId, productId, size }, { rejectWithValue, dispatch }) => {
    try {
      // First, move from wishlist to cart using the move-to-cart endpoint
      const response = await axios.post(`${baseUrl}/api/wishlist/move-to-cart`, {
        userId,
        productId
      });
      
      // Then add to cart with selected size
      await axios.post(`${baseUrl}/api/cart/add`, {
        userId,
        productId,
        quantity: 1,
        size: size
      });
      
      return { productId, wishlist: response.data.wishlist };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move to cart');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    wishlistId: null,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.wishlistId = null;
      state.totalItems = 0;
      state.error = null;
    },
    removeItemLocally: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item._id !== productId);
      state.totalItems = state.items.length;
    },
    addItemLocally: (state, action) => {
      const product = action.payload;
      const exists = state.items.some(item => item._id === product._id);
      if (!exists) {
        state.items.push(product);
        state.totalItems = state.items.length;
      }
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item._id === product._id);
      if (index !== -1) {
        state.items.splice(index, 1);
        state.totalItems = state.items.length;
      } else {
        state.items.push(product);
        state.totalItems = state.items.length;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.wishlistId = action.payload.wishlistId;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.products) {
          state.items = action.payload.products;
          state.totalItems = action.payload.products.length;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.productId);
        state.totalItems = state.items.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear Wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.wishlistId = null;
        state.totalItems = 0;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Move to Cart
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.productId);
        state.totalItems = state.items.length;
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearWishlistState, 
  removeItemLocally, 
  addItemLocally,
  toggleWishlistItem 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;