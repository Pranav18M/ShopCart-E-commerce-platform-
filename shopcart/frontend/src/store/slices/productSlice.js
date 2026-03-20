import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try { return await productService.getProducts(params); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try { return await productService.getProductById(id); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try { return await productService.getCategories(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
  try { return await productService.getFeaturedProducts(); }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    featured: [],
    current: null,
    categories: [],
    pagination: { page: 0, totalPages: 0, totalElements: 0 },
    loading: false,
    error: null,
    filters: { category: '', minPrice: '', maxPrice: '', search: '', sort: 'createdAt,desc' },
  },
  reducers: {
    setFilters(state, action) { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters(state) { state.filters = { category: '', minPrice: '', maxPrice: '', search: '', sort: 'createdAt,desc' }; },
    clearCurrentProduct(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.content || a.payload;
        s.pagination = { page: a.payload.number || 0, totalPages: a.payload.totalPages || 1, totalElements: a.payload.totalElements || 0 };
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProductById.pending, (s) => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; })
      .addCase(fetchFeaturedProducts.fulfilled, (s, a) => { s.featured = a.payload; });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
export const selectProducts = (state) => state.products.list;
export const selectCurrentProduct = (state) => state.products.current;
export const selectCategories = (state) => state.products.categories;
export const selectFeatured = (state) => state.products.featured;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductPagination = (state) => state.products.pagination;
export const selectProductsLoading = (state) => state.products.loading;
