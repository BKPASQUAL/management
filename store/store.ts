// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./services/api";
import { authApi } from "./services/auth";
import { supplierApi } from "./services/supplier";
import { productApi } from "./services/product";
import { stockApi } from "./services/stock";
import { customerApi } from "./services/customer";
import { customerBillApi } from "./services/customerBill";
import { orderApi } from "./services/orderApi"; // NEW: Import orderApi
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    // API reducers
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [customerBillApi.reducerPath]: customerBillApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer, // NEW: Add orderApi reducer

    // Regular slices
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      authApi.middleware,
      supplierApi.middleware,
      productApi.middleware,
      stockApi.middleware,
      customerApi.middleware,
      customerBillApi.middleware,
      orderApi.middleware // NEW: Add orderApi middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
