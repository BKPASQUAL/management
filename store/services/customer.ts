// src/store/services/customer.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Updated Customer entity interface to match API response
export interface Customer {
  id: number;
  customerName: string;
  shopName: string;
  customerCode: string;
  customerType: "retail" | "enterprise";
  areaId: number;
  area: {
    area_id: number;
    area_name: string;
  };
  address: string;
  contactNumber: string;
  assignedRepId: number;
  assignedRep: {
    user_id: number;
    username: string;
    role: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
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

// Update Customer Request Payload
export interface UpdateCustomerRequest {
  customerName?: string;
  shopName?: string;
  customerType?: "retail" | "enterprise";
  areaId?: number;
  address?: string;
  contactNumber?: string;
  assignedRepId?: number;
  notes?: string;
}

// API Response interfaces
export interface CustomerResponse {
  statusCode: number;
  message: string;
  data: Customer;
}

export interface CustomersListResponse {
  statusCode: number;
  message: string;
  data: Customer[];
}

// API slice for customers
export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/", // Updated base URL - adjust as needed
    prepareHeaders: (headers) => {
      headers.set("content-type", "application/json");
      // Add authorization header if needed
      // const token = getToken(); // Implement your token retrieval logic
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    // Fetch all customers
    getCustomers: builder.query<CustomersListResponse, void>({
      query: () => "customers",
      providesTags: ["Customer"],
      transformResponse: (response: CustomersListResponse) => {
        console.log("getCustomers API Response:", response);
        return response;
      },
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
    getCustomerById: builder.query<CustomerResponse, number>({
      query: (id) => `customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customer", id }],
      transformResponse: (response: CustomerResponse) => {
        console.log("getCustomerById API Response:", response);
        return response;
      },
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
      transformResponse: (response: CustomerResponse) => {
        console.log("createCustomer API Response:", response);
        return response;
      },
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
      { id: number; data: UpdateCustomerRequest }
    >({
      query: ({ id, data }) => ({
        url: `customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Customer", id },
        "Customer",
      ],
      transformResponse: (response: CustomerResponse) => {
        console.log("updateCustomer API Response:", response);
        return response;
      },
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

    // Delete customer
    deleteCustomer: builder.mutation<
      { statusCode: number; message: string },
      number
    >({
      query: (id) => ({
        url: `customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
      transformResponse: (response: {
        statusCode: number;
        message: string;
      }) => {
        console.log("deleteCustomer API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any, meta, arg) => {
        console.error("deleteCustomer API Error:", {
          response,
          meta,
          customerId: arg,
        });
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to delete customer",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Search customers (if your API supports it)
    searchCustomers: builder.query<
      CustomersListResponse,
      {
        searchTerm?: string;
        area?: string;
        customerType?: "retail" | "enterprise";
        representative?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.searchTerm) {
          searchParams.append("search", params.searchTerm);
        }
        if (params.area && params.area !== "all") {
          searchParams.append("area", params.area);
        }
        if (params.customerType) {
          searchParams.append("type", params.customerType);
        }
        if (params.representative && params.representative !== "all") {
          searchParams.append("representative", params.representative);
        }

        return `customers/search?${searchParams.toString()}`;
      },
      providesTags: ["Customer"],
      transformResponse: (response: CustomersListResponse) => {
        console.log("searchCustomers API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("searchCustomers API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to search customers",
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
  useDeleteCustomerMutation,
  useSearchCustomersQuery,
} = customerApi;
