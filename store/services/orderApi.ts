// store/services/orderApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Enums
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  CHECK = "check",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
}

export enum BillStatus {
  DRAFT = "draft",
  PAID = "paid",
  CANCELLED = "cancelled",
  PARTIALLY_PAID = "partially_paid",
  PENDING = "pending",
}

// Interfaces for Order Items
export interface OrderItem {
  bill_item_id: number;
  item_id: number;
  item_code: string;
  item_name: string;
  category_name: string;
  unit_price: string;
  quantity: string;
  unit_type: string;
  discount_percentage: string;
  discount_amount: string;
  free_quantity: string;
  subtotal: string;
  total_amount: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Customer interface
export interface OrderCustomer {
  id: number;
  customerName: string;
  shopName: string;
  customerCode: string;
  customerType: "retail" | "enterprise";
  areaId: number;
  address: string;
  contactNumber: string;
  assignedRepId: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Created By (Representative) interface
export interface OrderCreatedBy {
  user_id: number;
  username: string;
  role: string;
  phone_number: string;
  email: string;
}

// Main Order interface
export interface Order {
  bill_id: number;
  invoice_no: string;
  customer: OrderCustomer;
  billing_date: string;
  payment_method: PaymentMethod;
  status: BillStatus;
  is_order: boolean;
  order_status: OrderStatus;
  order_confirmed_at?: string;
  subtotal: string;
  discount_percentage: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  paid_amount: string;
  balance_amount: string;
  total_items: number;
  total_quantity: number;
  notes?: string;
  reference_no?: string;
  created_by: OrderCreatedBy;
  location: any;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

// API Response interfaces
export interface OrdersResponse {
  success: boolean;
  data: Order[];
  total: number;
}

export interface SingleOrderResponse {
  success: boolean;
  data: Order;
}

// Filter parameters - made all properties optional
export interface OrderFilterParams {
  status?: OrderStatus;
  order_status?: OrderStatus;
  customer_id?: number;
  representative_id?: number;
  area_id?: number;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

// Update order status payload
export interface UpdateOrderStatusPayload {
  order_status: OrderStatus;
  notes?: string;
}

// Confirm order payload
export interface ConfirmOrderPayload {
  notes?: string;
}

// Order API slice
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/",
    prepareHeaders: (headers) => {
      headers.set("content-type", "application/json");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Order", "OrderStats"],
  endpoints: (builder) => ({
    // Get all orders with filters
    getOrders: builder.query<OrdersResponse, OrderFilterParams | undefined>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Type-safe parameter handling
        if (params?.status) searchParams.append("status", params.status);
        if (params?.order_status)
          searchParams.append("order_status", params.order_status);
        if (params?.customer_id)
          searchParams.append("customer_id", params.customer_id.toString());
        if (params?.representative_id)
          searchParams.append(
            "representative_id",
            params.representative_id.toString()
          );
        if (params?.area_id)
          searchParams.append("area_id", params.area_id.toString());
        if (params?.from_date)
          searchParams.append("from_date", params.from_date);
        if (params?.to_date) searchParams.append("to_date", params.to_date);
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.limit)
          searchParams.append("limit", params.limit.toString());

        const queryString = searchParams.toString();
        return `customer-bills/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ bill_id }) => ({
                type: "Order" as const,
                id: bill_id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      transformResponse: (response: OrdersResponse) => {
        console.log("getOrders API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("getOrders API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch orders",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Get single order by ID
    getOrderById: builder.query<SingleOrderResponse, number>({
      query: (id) => `customer-bills/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
      transformResponse: (response: SingleOrderResponse) => {
        console.log("getOrderById API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("getOrderById API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch order",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Update order status
    updateOrderStatus: builder.mutation<
      SingleOrderResponse,
      { id: number; data: UpdateOrderStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `customer-bills/orders/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
      transformResponse: (response: SingleOrderResponse) => {
        console.log("updateOrderStatus API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("updateOrderStatus API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to update order status",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Confirm order
    confirmOrder: builder.mutation<
      SingleOrderResponse,
      { id: number; data?: ConfirmOrderPayload }
    >({
      query: ({ id, data = {} }) => ({
        url: `customer-bills/orders/${id}/confirm`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
      transformResponse: (response: SingleOrderResponse) => {
        console.log("confirmOrder API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("confirmOrder API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to confirm order",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Cancel order
    cancelOrder: builder.mutation<
      SingleOrderResponse,
      { id: number; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `customer-bills/orders/${id}/cancel`,
        method: "POST",
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
      transformResponse: (response: SingleOrderResponse) => {
        console.log("cancelOrder API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("cancelOrder API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to cancel order",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),

    // Get order statistics
    getOrderStats: builder.query<any, OrderFilterParams | undefined>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.representative_id)
          searchParams.append(
            "representative_id",
            params.representative_id.toString()
          );
        if (params?.area_id)
          searchParams.append("area_id", params.area_id.toString());
        if (params?.from_date)
          searchParams.append("from_date", params.from_date);
        if (params?.to_date) searchParams.append("to_date", params.to_date);

        const queryString = searchParams.toString();
        return `customer-bills/orders/stats${
          queryString ? `?${queryString}` : ""
        }`;
      },
      providesTags: ["OrderStats"],
      transformResponse: (response: any) => {
        console.log("getOrderStats API Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("getOrderStats API Error:", response);
        return {
          message:
            response?.data?.message ||
            response?.message ||
            "Failed to fetch order statistics",
          status: response?.status || 500,
          data: response?.data || null,
        };
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useGetOrderStatsQuery,
} = orderApi;
