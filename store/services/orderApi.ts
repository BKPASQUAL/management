import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Enums - Updated to match backend
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CHECKING = "checking",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  CONFIRMED = "confirmed",
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

export interface CustomerSummary {
  dueAmount: number;
  pendingBillsCount: number;
  over45DaysAmount: number;
  lastBillingDate: string | null;
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
  confirmed_by?: OrderCreatedBy;
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
  customerSummary?: CustomerSummary;
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
  message?: string;
}

// Filter parameters
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

// ------------------------------------------------------
// API Slice
// ------------------------------------------------------
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
    // ------------------------------------------------------
    //  Get All Orders
    // ------------------------------------------------------
    getOrders: builder.query<OrdersResponse, OrderFilterParams | undefined>({
      query: (params) => {
        const searchParams = new URLSearchParams();

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
    }),

    // ------------------------------------------------------
    //  Get Single Order by ID
    // ------------------------------------------------------
    getOrderById: builder.query<SingleOrderResponse, number>({
      query: (id) => `customer-bills/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // ------------------------------------------------------
    //  Move to Processing
    // ------------------------------------------------------
    moveToProcessing: builder.mutation<SingleOrderResponse, number>({
      query: (id) => ({
        url: `customer-bills/orders/${id}/move-to-processing`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
    }),

    // ------------------------------------------------------
    //  Move to Checking
    // ------------------------------------------------------
    moveToChecking: builder.mutation<SingleOrderResponse, number>({
      query: (id) => ({
        url: `customer-bills/orders/${id}/move-to-checking`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
    }),

    // ------------------------------------------------------
    //  Move to Delivered
    // ------------------------------------------------------
    moveToDelivered: builder.mutation<SingleOrderResponse, number>({
      query: (id) => ({
        url: `customer-bills/orders/${id}/move-to-delivered`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
    }),

    // ------------------------------------------------------
    //  Confirm Order (new)
    // ------------------------------------------------------
    confirmOrder: builder.mutation<SingleOrderResponse, number>({
      query: (id) => ({
        url: `customer-bills/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
    }),

    // ------------------------------------------------------
    //  Update Order Status (generic)
    // ------------------------------------------------------
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
    }),

    // ------------------------------------------------------
    //  Cancel Order
    // ------------------------------------------------------
    cancelOrder: builder.mutation<
      SingleOrderResponse,
      { id: number; notes?: string }
    >({
      query: ({ id, notes }) => ({
        url: `customer-bills/orders/${id}/status`,
        method: "PATCH",
        body: {
          order_status: OrderStatus.CANCELLED,
          notes: notes || "Order cancelled",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        "OrderStats",
      ],
    }),

    // ------------------------------------------------------
    //  Order Stats
    // ------------------------------------------------------
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
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useMoveToProcessingMutation,
  useMoveToCheckingMutation,
  useMoveToDeliveredMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useConfirmOrderMutation,
  useGetOrderStatsQuery,
} = orderApi;
