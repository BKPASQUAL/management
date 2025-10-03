// store/services/auth.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// User roles enum
export type UserRole = "admin" | "representative" | "manager" | "super_admin";

// Auth interfaces
export interface User {
  user_id: number;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone_number?: string;
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
}

// Auth API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage or state
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => {
        console.log("Login API Response:", response);
        // Store token in localStorage
        if (typeof window !== "undefined" && response.access_token) {
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("Login API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Invalid credentials",
          status: response?.status || 401,
        };
      },
      invalidatesTags: ["Auth"],
    }),

    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear localStorage on logout
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
          }
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query<{ data: User }, void>({
      query: () => "auth/profile",
      providesTags: ["User"],
      transformErrorResponse: (response: any) => {
        console.error("getCurrentUser API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch user profile",
          status: response?.status || 500,
        };
      },
    }),

    // Verify token (optional - for checking if token is still valid)
    verifyToken: builder.query<{ valid: boolean; user?: User }, void>({
      query: () => "auth/verify",
      transformErrorResponse: () => ({
        valid: false,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useVerifyTokenQuery,
} = authApi;
