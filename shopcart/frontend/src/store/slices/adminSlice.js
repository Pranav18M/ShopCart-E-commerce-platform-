import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

export const fetchAdminStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
  try { return await adminService.getStats(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllUsers = createAsyncThunk('admin/users', async (_, { rejectWithValue }) => {
  try { return await adminService.getAllUsers(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchPendingSubscriptions = createAsyncThunk('admin/subscriptions', async (_, { rejectWithValue }) => {
  try { return await adminService.getPendingSubscriptions(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchPendingOrders = createAsyncThunk('admin/pendingOrders', async (_, { rejectWithValue }) => {
  try { return await adminService.getPendingOrders(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllProducts = createAsyncThunk('admin/products', async (_, { rejectWithValue }) => {
  try { return await adminService.getAllProducts(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const approveSubscription = createAsyncThunk('admin/approveSubscription', async (id, { rejectWithValue }) => {
  try { return await adminService.approveSubscription(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const rejectSubscription = createAsyncThunk('admin/rejectSubscription', async (id, { rejectWithValue }) => {
  try { return await adminService.rejectSubscription(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const approveOrderPayment = createAsyncThunk('admin/approveOrder', async (id, { rejectWithValue }) => {
  try { return await adminService.approveOrderPayment(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try { return await adminService.updateOrderStatus(id, status); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const approveProduct = createAsyncThunk('admin/approveProduct', async (id, { rejectWithValue }) => {
  try { return await adminService.approveProduct(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const rejectProduct = createAsyncThunk('admin/rejectProduct', async (id, { rejectWithValue }) => {
  try { return await adminService.rejectProduct(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null, users: [], subscriptions: [], pendingOrders: [],
    products: [], loading: false, error: null,
  },
  reducers: { clearAdminError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (s, a) => { s.stats = a.payload; })
      .addCase(fetchAllUsers.fulfilled, (s, a) => { s.users = a.payload; })
      .addCase(fetchPendingSubscriptions.fulfilled, (s, a) => { s.subscriptions = a.payload; })
      .addCase(fetchPendingOrders.fulfilled, (s, a) => { s.pendingOrders = a.payload; })
      .addCase(fetchAllProducts.fulfilled, (s, a) => { s.products = a.payload; })
      .addCase(approveSubscription.fulfilled, (s, a) => {
        s.subscriptions = s.subscriptions.filter(sub => sub.id !== a.payload.id);
      })
      .addCase(rejectSubscription.fulfilled, (s, a) => {
        s.subscriptions = s.subscriptions.filter(sub => sub.id !== a.payload.id);
      })
      .addCase(approveOrderPayment.fulfilled, (s, a) => {
        s.pendingOrders = s.pendingOrders.filter(o => o.id !== a.payload.id);
      })
      .addCase(approveProduct.fulfilled, (s, a) => {
        const idx = s.products.findIndex(p => p.id === a.payload.id);
        if (idx !== -1) s.products[idx] = a.payload;
      })
      .addCase(rejectProduct.fulfilled, (s, a) => {
        const idx = s.products.findIndex(p => p.id === a.payload.id);
        if (idx !== -1) s.products[idx] = a.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
export const selectAdminStats = (state) => state.admin.stats;
export const selectAdminUsers = (state) => state.admin.users;
export const selectPendingSubscriptions = (state) => state.admin.subscriptions;
export const selectPendingOrders = (state) => state.admin.pendingOrders;
export const selectAdminProducts = (state) => state.admin.products;
