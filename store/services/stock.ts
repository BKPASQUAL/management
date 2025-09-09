// src/store/services/stock.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Stock entity interface (match your NestJS StockService select fields)
export interface Stock {
  stock_id: number;
  quantity: number;
  updated_at: string;
  item_id: number; // ← ADDED: This should be included from backend
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

// Stock Transfer Request Payload
export interface StockTransferRequest {
  source_location_id: number;
  destination_location_id: number;
  transfer_date: string;
  items: {
    item_id: number;
    item_code: string;
    item_name: string;
    supplier_name: string;
    requested_quantity: number;
    unit_cost?: number;
    notes?: string;
  }[];
}

// Stock Transfer Response
export interface StockTransferResponse {
  success: boolean;
  message: string;
  data: {
    transfer_id: number;
    transfer_number: string;
    source_location_id: number;
    destination_location_id: number;
    transfer_date: string;
    status: string;
    total_items: number;
    total_quantity: number;
    created_at: string;
    items: {
      item_id: number;
      item_code: string;
      item_name: string;
      requested_quantity: number;
      unit_cost?: number;
      notes?: string;
    }[];
  };
}

// API slice for stocks
export const stockApi = createApi({
  reducerPath: "stockApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    prepareHeaders: (headers) => {
      // Add any authentication headers if needed
      // headers.set('authorization', `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Stock", "StockLocation", "StockTransfer"],
  endpoints: (builder) => ({
    // Fetch all stocks
    getStocks: builder.query<{ data: Stock[] }, void>({
      query: () => "stocks",
      providesTags: ["Stock"],
      transformErrorResponse: (response: any) => {
        console.error("getStocks API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch stocks",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Fetch stock locations (dropdown)
    getStockLocations: builder.query<{ data: StockLocation[] }, void>({
      query: () => "stock-location/dropdown",
      providesTags: ["StockLocation"],
      transformErrorResponse: (response: any) => {
        console.error("getStockLocations API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch stock locations",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Create stock transfer
    createStockTransfer: builder.mutation<
      StockTransferResponse,
      StockTransferRequest
    >({
      query: (transferData) => {
        console.log("Making API request with data:", transferData);
        return {
          url: "stocks/transfers",
          method: "POST",
          body: transferData,
        };
      },
      transformErrorResponse: (response: any, meta, arg) => {
        console.error("createStockTransfer API Error:", {
          response,
          meta,
          requestData: arg,
        });

        // Handle different types of error responses
        let errorMessage = "Failed to create stock transfer";

        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.data?.error) {
          errorMessage = response.data.error;
        } else if (response?.message) {
          errorMessage = response.message;
        } else if (response?.status === 400) {
          errorMessage = "Bad request - please check your input data";
        } else if (response?.status === 401) {
          errorMessage = "Unauthorized - please check authentication";
        } else if (response?.status === 500) {
          errorMessage = "Internal server error";
        }

        return {
          message: errorMessage,
          status: response?.status || 500,
          data: response?.data || null,
          originalStatus: meta?.response?.status,
        };
      },
      invalidatesTags: ["Stock", "StockTransfer"],
    }),

    // Get stock transfers (optional - for viewing transfers)
    getStockTransfers: builder.query<{ data: any[] }, void>({
      query: () => "stocks/transfers",
      providesTags: ["StockTransfer"],
      transformErrorResponse: (response: any) => {
        console.error("getStockTransfers API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch stock transfers",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Get single stock transfer by ID (optional)
    getStockTransferById: builder.query<{ data: any }, number>({
      query: (id) => `stocks/transfers/${id}`,
      providesTags: ["StockTransfer"],
      transformErrorResponse: (response: any) => {
        console.error("getStockTransferById API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch stock transfer",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockLocationsQuery,
  useCreateStockTransferMutation,
  useGetStockTransfersQuery,
  useGetStockTransferByIdQuery,
} = stockApi;