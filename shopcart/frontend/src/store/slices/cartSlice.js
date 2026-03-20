import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try { return await cartService.getCart(); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart'); }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try { return await cartService.addToCart(productId, quantity); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add to cart'); }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try { return await cartService.updateCartItem(cartItemId, quantity); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update cart'); }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (cartItemId, { rejectWithValue }) => {
  try { await cartService.removeCartItem(cartItemId); return cartItemId; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to remove item'); }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try { await cartService.clearCart(); return []; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, totalAmount: 0, totalItems: 0 },
  reducers: {
    resetCart(state) { state.items = []; state.totalAmount = 0; state.totalItems = 0; },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false;
      state.items = action.payload.items || action.payload || [];
      state.totalAmount = state.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      state.totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
    };
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
        state.totalAmount = state.items.reduce((s, i) => s + (i.price * i.quantity), 0);
        state.totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
      })
      .addCase(clearCart.fulfilled, (s) => { s.items = []; s.totalAmount = 0; s.totalItems = 0; });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartCount = (state) => state.cart.totalItems;
