import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import authService from '../../services/authService';

// Helper: decode token & get user info
const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.userId || decoded.sub,
      email: decoded.sub,
      name: decoded.name,
      role: decoded.role,
    };
  } catch { return null; }
};

// Async Thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    return { token: data.token, user: getUserFromToken(data.token) };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.register(userData);
    localStorage.setItem('token', data.token);
    return { token: data.token, user: getUserFromToken(data.token) };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getProfile();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

// Initial state
const token = localStorage.getItem('token');
const initialState = {
  token: token || null,
  user: token ? getUserFromToken(token) : null,
  profile: null,
  loading: false,
  error: null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError(state) { state.error = null; },
    updateUserRole(state, action) {
      if (state.user) state.user.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Register
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.token = a.payload.token;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      // Fetch profile
      .addCase(fetchCurrentUser.fulfilled, (s, a) => { s.profile = a.payload; })
  },
});

export const { logout, clearError, updateUserRole } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
