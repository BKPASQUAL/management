// src/store/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Supplier interface
export interface Supplier {
  id?: number;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  credit_days: number;
  address: string;
  additional_notes?: string;
}

// Dropdown supplier type (id + supplier_name only)
export interface DropdownSupplier {
  supplier_id: string | number; // can be uuid or number depending on backend
  supplier_name: string;
}

// Supplier Bill interfaces
export interface SupplierBillItem {
  item_id: number;
  unit_price: number;
  quantity: number;
  discount_percentage?: number;
  free_item_quantity?: number;
  mrp: string;
}

export interface CreateSupplierBillDto {
  supplierId: string; // backend expects this
  billNo: string;
  billingDate: string;
  receivedDate: string;
  items: {
    itemCode: string;
    itemName: string;
    price: number;
    quantity: number;
    discount?: number;
    amount: number;
    freeItemQuantity?: number;
    mrp: number;
  }[];
  extraDiscount?: string;
  subtotal: number;
  extraDiscountAmount: number;
  finalTotal: number;
  shopId: number;
}

export interface SupplierBillResponse {
  statusCode: number;
  message: string;
}

// Business interface
export interface Business {
  business_id?: number;
  business_name: string;
}

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/", // ⚡ NestJS backend port
  }),
  tagTypes: ["Supplier", "SupplierBill", "Business"],
  endpoints: (builder) => ({
    // Supplier endpoints
    addSupplier: builder.mutation<Supplier, Omit<Supplier, "id">>({
      query: (supplierData) => ({
        url: "supplier",
        method: "POST",
        body: supplierData,
      }),
      invalidatesTags: ["Supplier"],
    }),

    getSuppliers: builder.query<Supplier[], void>({
      query: () => "supplier",
      providesTags: ["Supplier"],
    }),

    getSupplierById: builder.query<Supplier, number>({
      query: (id) => `supplier/${id}`,
      providesTags: ["Supplier"],
    }),

    updateSupplier: builder.mutation<
      Supplier,
      { id: number; data: Partial<Supplier> }
    >({
      query: ({ id, data }) => ({
        url: `supplier/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),

    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Supplier"],
    }),

    // ✅ Dropdown suppliers (only id + name)
    getDropdownSuppliers: builder.query<DropdownSupplier[], void>({
      query: () => "supplier/dropdown",
      providesTags: ["Supplier"],
      transformResponse: (response: {
        data: DropdownSupplier[];
        count: number;
      }) => response.data,
    }),

    // ✅ Supplier Bill endpoint
    createSupplierBill: builder.mutation<
      SupplierBillResponse,
      CreateSupplierBillDto
    >({
      query: (billData) => ({
        url: "supplier-bills",
        method: "POST",
        body: billData,
      }),
      invalidatesTags: ["SupplierBill"],
    }),

    // ✅ Business endpoint
    getAllBusiness: builder.query<Business[], void>({
      query: () => "business",
      providesTags: ["Business"],
      transformResponse: (response: { data: Business[] }) => response.data,
    }),
  }),
});

export const {
  useAddSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetDropdownSuppliersQuery,
  useCreateSupplierBillMutation,
  useGetAllBusinessQuery, // ✅ new hook for businesses
} = supplierApi;
