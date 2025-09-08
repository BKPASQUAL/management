// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./services/api";
import { supplierApi } from "./services/supplier";
import { productApi } from "./services/product";
import { stockApi } from "./services/stock";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer, // ✅ added stockApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(supplierApi.middleware)
      .concat(productApi.middleware)
      .concat(stockApi.middleware), // ✅ fixed comma issue
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
