// src/store/services/stock.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Stock entity interface (match your NestJS StockService select fields)
export interface Stock {
  stock_id: number;
  quantity: number;
  updated_at: string;
  item: {
    item_code: string;
    item_name: string;
    supplier: {
      supplier_id: number;
      supplier_name: string;
    };
  };
  location: {
    location_id: number;
    location_code: string;
    location_name: string;
  };
}

// Stock Location interface
export interface StockLocation {
  location_id: number;
  location_code: string;
  location_name: string;
}

// API slice for stocks
export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
  }),
  tagTypes: ["Stock", "StockLocation"],
  endpoints: (builder) => ({
    // Fetch all stocks
    getStocks: builder.query<{ data: Stock[] }, void>({
      query: () => "stocks",
      providesTags: ["Stock"],
    }),

    // Fetch stock locations (dropdown)
    getStockLocations: builder.query<{ data: StockLocation[] }, void>({
      query: () => "stock-location/dropdown",
      providesTags: ["StockLocation"],
    }),
  }),
});

export const { useGetStocksQuery, useGetStockLocationsQuery } = stockApi;
