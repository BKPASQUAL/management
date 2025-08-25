// src/store/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Supplier interface
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

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/", // ⚡ should point to your NestJS backend port
  }),
  tagTypes: ["Supplier"],
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
      }) => response.data, // pick only data array
    }),
  }),
});

export const {
  useAddSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetDropdownSuppliersQuery, // ✅ new hook
} = supplierApi;
