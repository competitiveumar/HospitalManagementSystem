import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { mockUsers } from '../../utils/mockData';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state: AuthState, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state: AuthState) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateUserProfile: (state: AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user && action.payload.id === state.user.id) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserProfile } = authSlice.actions;

// Thunk for login
export const login = (email: string, password: string) => (dispatch: any) => {
  dispatch(loginStart());
  
  try {
    // This is a mock login - in a real app, we would call an API
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      // Mock successful login
      setTimeout(() => {
        dispatch(loginSuccess({ 
          user, 
          token: 'mock-jwt-token' 
        }));
      }, 1000);
    } else {
      // Mock failed login
      setTimeout(() => {
        dispatch(loginFailure('Invalid email or password'));
      }, 1000);
    }
  } catch (error) {
    dispatch(loginFailure('An error occurred during login'));
  }
};

export default authSlice.reducer; 