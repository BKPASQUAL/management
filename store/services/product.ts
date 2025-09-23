// src/store/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Product interface
export interface Product {
  item_code: string;
  item_name: string;
  description: string;
  additional_notes?: string;
  cost_price: number;
  selling_price: number;
  rep_commision: number;
  minimum_selling_price: number;
  unit_type: string;
  unit_quantity: number;
  supplier_id: number;
  category_id: number;
  images: string[];
  mrp: string;
}

export interface BillProduct {
  item_uuid: string;
  item_code: string;
  item_name: string;
  description: string;
  additional_notes?: string;
  cost_price: string;
  selling_price: string;
  rep_commision: string;
  minimum_selling_price: string;
  unit_type: string;
  unit_quantity: string;
  supplier_id: number;
  supplier_name: string;
  category_id: number;
  category_name: string;
  images: string[];
  mrp: string;
  shopId: number;
}

// Define the request type for creating a product
export type CreateProductRequest = Omit<Product, "item_code"> & {
  item_code?: string; // Optional if backend auto-generates
};

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Fetch all products
    getProducts: builder.query<{ data: BillProduct[] }, void>({
      query: () => "item",
      providesTags: ["Product"],
    }),

    // Fetch single product by ID
    getProductById: builder.query<Product, number>({
      query: (id) => `item/${id}`,
      providesTags: ["Product"],
    }),

    // Create a new product
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (newProduct) => ({
        url: "item",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update a product
    updateProduct: builder.mutation<
      Product,
      { id: number; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `item/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete a product
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
