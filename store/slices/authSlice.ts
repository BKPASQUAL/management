// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../services/auth";

interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initialize state from localStorage (only on client side)
const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return {
      user,
      access_token: token,
      isAuthenticated: !!token && !!user,
      isLoading: false,
    };
  }

  return {
    user: null,
    access_token: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access_token: string }>
    ) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", action.payload.access_token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }): UserRole | null =>
  state.auth.user?.role || null;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.access_token;
