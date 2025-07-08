import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  selectedLanguage: localStorage.getItem('i18nextLng'),
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  name: localStorage.getItem('name'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk('login', async (userData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
      userData
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
});

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    languageChanged(state, action) {
      state.selectedLanguage = action.payload;
    },
    autoLogin(state) {
      state.token = localStorage.getItem('token');
      state.userId = localStorage.getItem('userId');
      state.name = localStorage.getItem('name');
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      state.token = null;
      state.name = null;
      state.userId = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.token = null;
        state.name = null;
        state.userId = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status === 200) {
          const results = action.payload.results;
          localStorage.setItem('token', results.token);
          localStorage.setItem('userId', results._id);
          localStorage.setItem('name', results.name);
          state.token = results.token;
          state.name = results.name;
          state.userId = results._id;
        } else {
          state.token = null;
          state.name = null;
          state.userId = null;
          state.error = action.payload;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.name = null;
        state.userId = null;
        state.error = action.payload;
      });
  },
});

export const { languageChanged, autoLogin, logout } = globalSlice.actions;
export default globalSlice.reducer;
