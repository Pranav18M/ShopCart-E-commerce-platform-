import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try { return await orderService.getMyOrders(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try { return await orderService.getOrderById(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try { return await orderService.placeOrder(orderData); }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to place order'); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], current: null, loading: false, error: null, success: false },
  reducers: {
    clearOrderSuccess(state) { state.success = false; },
    clearOrderError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (s) => { s.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchMyOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchOrderById.pending, (s) => { s.loading = true; })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(placeOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(placeOrder.fulfilled, (s, a) => { s.loading = false; s.success = true; s.current = a.payload; })
      .addCase(placeOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
export const selectOrders = (state) => state.orders.list;
export const selectCurrentOrder = (state) => state.orders.current;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderSuccess = (state) => state.orders.success;
