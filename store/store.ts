// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./services/api";
import { authApi } from "./services/auth";
import { customerApi } from "./services/customer";
import { customerBillApi } from "./services/customerBill";
import { stockApi } from "./services/stock";
import authReducer from "./slices/authSlice";
// import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    // Add all your API reducers
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [customerBillApi.reducerPath]: customerBillApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,

    // Regular slices
    auth: authReducer,
    // cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      authApi.middleware,
      customerApi.middleware,
      customerBillApi.middleware,
      stockApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
