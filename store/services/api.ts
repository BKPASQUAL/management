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

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/", // Replace with your actual base URL
  }),
  tagTypes: ["Supplier"],
  endpoints: (builder) => ({
    // Existing endpoints
    getPosts: builder.query<any[], void>({
      query: () => "posts",
    }),
    getPostById: builder.query<any, number>({
      query: (id) => `posts/${id}`,
    }),

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
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddSupplierMutation,
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = api;
