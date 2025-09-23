// store/services/customerBill.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Enums matching your backend
export enum BillStatus {
  DRAFT = 'draft',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  PARTIALLY_PAID = 'partially_paid'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card'
}

// Interfaces matching your backend DTOs
export interface CustomerBillItemDto {
  item_id: number;
  unit_price: number;
  quantity: number;
  discount_percentage?: number;
  free_quantity?: number;
  notes?: string;
}

export interface CreateCustomerBillDto {
  customer_id: number;
  billing_date?: Date;
  payment_method?: PaymentMethod;
  status?: BillStatus;
  discount_percentage?: number;
  tax_amount?: number;
  paid_amount?: number;
  notes?: string;
  reference_no?: string;
  location_id?: number;
  items: CustomerBillItemDto[];
}

export interface UpdateCustomerBillDto {
  customer_id?: number;
  billing_date?: Date;
  payment_method?: PaymentMethod;
  status?: BillStatus;
  discount_percentage?: number;
  tax_amount?: number;
  paid_amount?: number;
  notes?: string;
  reference_no?: string;
  items?: CustomerBillItemDto[];
}

export interface UpdatePaymentDto {
  payment_amount: number;
  payment_method?: PaymentMethod;
  payment_reference?: string;
}

export interface BillFilterDto {
  customer_id?: number;
  status?: BillStatus;
  from_date?: Date;
  to_date?: Date;
  location_id?: number;
}

// Response interfaces
export interface CustomerBillItem {
  item_id: number;
  item_code: string;
  item_name: string;
  category_name?: string;
  unit_price: number;
  quantity: number;
  unit_type: string;
  discount_percentage: number;
  discount_amount: number;
  free_quantity: number;
  subtotal: number;
  total_amount: number;
  notes?: string;
}

export interface CustomerBill {
  bill_id: number;
  invoice_no: string;
  customer: {
    id: number;
    customerName: string;
    shopName: string;
    customerCode: string;
  };
  billing_date: string;
  payment_method?: PaymentMethod;
  status: BillStatus;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  total_items: number;
  total_quantity: number;
  notes?: string;
  reference_no?: string;
  items: CustomerBillItem[];
  created_at: string;
  updated_at: string;
}

export interface CustomerBillResponse {
  statusCode: number;
  message: string;
  data: CustomerBill;
}

export interface CustomerBillListResponse {
  statusCode: number;
  message: string;
  data: CustomerBill[];
}

export interface BillSummaryResponse {
  statusCode: number;
  message: string;
  data: {
    total_bills: number;
    total_amount: number;
    paid_amount: number;
    balance_amount: number;
    total_items: number;
  };
}

// Customer Bill API slice
export const customerBillApi = createApi({
  reducerPath: "customerBillApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
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
  tagTypes: ["CustomerBill"],
  endpoints: (builder) => ({
    // Create a new customer bill
    createCustomerBill: builder.mutation<CustomerBillResponse, CreateCustomerBillDto>({
      query: (billData) => ({
        url: "customer-bills",
        method: "POST",
        body: {
          ...billData,
          billing_date: billData.billing_date ? billData.billing_date.toISOString() : undefined,
        },
      }),
      invalidatesTags: ["CustomerBill"],
      transformResponse: (response: CustomerBillResponse) => {
        console.log("createCustomerBill API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("createCustomerBill API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to create customer bill",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Fetch all customer bills with optional filters
    // getCustomerBills: builder.query<CustomerBillListResponse, BillFilterDto | void>({
    //   query: (filters = {}) => {
    //     const params = new URLSearchParams();
        
    //     if (filters.customer_id) params.append('customer_id', filters.customer_id.toString());
    //     if (filters.status) params.append('status', filters.status);
    //     if (filters.from_date) params.append('from_date', filters.from_date.toISOString());
    //     if (filters.to_date) params.append('to_date', filters.to_date.toISOString());
    //     if (filters.location_id) params.append('location_id', filters.location_id.toString());

    //     return `customer-bills?${params.toString()}`;
    //   },
    //   providesTags: ["CustomerBill"],
    //   transformResponse: (response: CustomerBillListResponse) => {
    //     console.log("getCustomerBills API Response:", response);
    //     return response;
    //   },
    //   transformErrorResponse: (response: any) => {
    //     console.error("getCustomerBills API Error:", response);
    //     return {
    //       message:
    //         response?.data?.message ||
    //         response?.message ||
    //         "Failed to fetch customer bills",
    //       status: response?.status || 500,
    //       data: response?.data || null,
    //     };
    //   },
    // }),

    // // Get single customer bill by ID
    // getCustomerBillById: builder.query<CustomerBillResponse, number>({
    //   query: (id) => `customer-bills/${id}`,
    //   providesTags: (result, error, id) => [{ type: "CustomerBill", id }],
    //   transformResponse: (response: CustomerBillResponse) => {
    //     console.log("getCustomerBillById API Response:", response);
    //     return response;
    //   },
    //   transformErrorResponse: (response: any) => {
    //     console.error("getCustomerBillById API Error:", response);
    //     return {
    //       message:
    //         response?.data?.message ||
    //         response?.message ||
    //         "Failed to fetch customer bill",
    //       status: response?.status || 500,
    //       data: response?.data || null,
    //     };
    //   },
    // }),

    // Update customer bill
    updateCustomerBill: builder.mutation<CustomerBillResponse, { id: number; data: UpdateCustomerBillDto }>({
      query: ({ id, data }) => ({
        url: `customer-bills/${id}`,
        method: "PUT",
        body: {
          ...data,
          billing_date: data.billing_date ? data.billing_date.toISOString() : undefined,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CustomerBill", id },
        "CustomerBill",
      ],
      transformResponse: (response: CustomerBillResponse) => {
        console.log("updateCustomerBill API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("updateCustomerBill API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to update customer bill",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Update payment for a bill
    updateBillPayment: builder.mutation<CustomerBillResponse, { id: number; payment: UpdatePaymentDto }>({
      query: ({ id, payment }) => ({
        url: `customer-bills/${id}/payment`,
        method: "POST",
        body: payment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CustomerBill", id },
        "CustomerBill",
      ],
      transformResponse: (response: CustomerBillResponse) => {
        console.log("updateBillPayment API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("updateBillPayment API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to update payment",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Cancel a bill
    cancelCustomerBill: builder.mutation<CustomerBillResponse, number>({
      query: (id) => ({
        url: `customer-bills/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CustomerBill", id },
        "CustomerBill",
      ],
      transformResponse: (response: CustomerBillResponse) => {
        console.log("cancelCustomerBill API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("cancelCustomerBill API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to cancel customer bill",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Get bill summary
    getBillSummary: builder.query<BillSummaryResponse, { customer_id?: number; from_date?: Date; to_date?: Date }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        
        if (params.customer_id) searchParams.append('customer_id', params.customer_id.toString());
        if (params.from_date) searchParams.append('from_date', params.from_date.toISOString());
        if (params.to_date) searchParams.append('to_date', params.to_date.toISOString());

        return `customer-bills/summary?${searchParams.toString()}`;
      },
      providesTags: ["CustomerBill"],
      transformResponse: (response: BillSummaryResponse) => {
        console.log("getBillSummary API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("getBillSummary API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch bill summary",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),
  }),
});

export const {
  useCreateCustomerBillMutation,
//   useGetCustomerBillsQuery,
//   useGetCustomerBillByIdQuery,
  useUpdateCustomerBillMutation,
  useUpdateBillPaymentMutation,
  useCancelCustomerBillMutation,
  useGetBillSummaryQuery,
} = customerBillApi;