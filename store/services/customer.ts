// src/store/services/customer.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Customer entity interface
export interface Customer {
  customer_id: number;
  customerName: string;
  shopName: string;
  customerType: "retail" | "enterprise";
  areaId: number;
  address: string;
  contactNumber: string;
  assignedRepId: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  area?: {
    area_id: number;
    area_name: string;
  };
  assignedRep?: {
    user_id: number;
    full_name: string;
  };
}

// Create Customer Request Payload
export interface CreateCustomerRequest {
  customerName: string;
  shopName: string;
  customerType: "retail" | "enterprise";
  areaId: number;
  address: string;
  contactNumber: string;
  assignedRepId: number;
  notes?: string;
}

// Customer Response
export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

// API slice for customers
export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    prepareHeaders: (headers) => {
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    // Fetch all customers
    getCustomers: builder.query<{ data: Customer[] }, void>({
      query: () => "customers",
      providesTags: ["Customer"],
      transformErrorResponse: (response: any) => {
        console.error("getCustomers API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch customers",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Get single customer by ID
    getCustomerById: builder.query<{ data: Customer }, number>({
      query: (id) => `customers/${id}`,
      providesTags: ["Customer"],
      transformErrorResponse: (response: any) => {
        console.error("getCustomerById API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch customer",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Create customer
    createCustomer: builder.mutation<CustomerResponse, CreateCustomerRequest>({
      query: (customerData) => ({
        url: "customers",
        method: "POST",
        body: customerData,
      }),
      invalidatesTags: ["Customer"],
      transformErrorResponse: (response: any, meta, arg) => {
        console.error("createCustomer API Error:", {
          response,
          meta,
          requestData: arg,
        });
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to create customer",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Update customer
    updateCustomer: builder.mutation<
      CustomerResponse,
      { id: number; data: Partial<CreateCustomerRequest> }
    >({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customer"],
      transformErrorResponse: (response: any, meta, arg) => {
        console.error("updateCustomer API Error:", {
          response,
          meta,
          requestData: arg,
        });
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to update customer",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;
