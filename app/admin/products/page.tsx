"use client";

import { Input } from "@/components/ui/input";
import {
  Edit,
  Search,
  Trash2,
  DollarSign,
  Package,
  MapPin,
  Hash,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddProductModal from "@/components/model/AddProduct";

import Image from "next/image";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/store/services/product";

// Type definitions
interface Product {
  item_uuid: string;
  item_name: string;
  item_code: string;
  description: string;
  unit_type: string;
  unit_quantity: string;
  selling_price: string;
  supplier_name: string;
  category_name: string;
  images?: string[];
}

interface ApiResponse {
  data: Product[];
}

// Type for the query response - could be either format
type ProductsQueryResponse = Product[] | ApiResponse | undefined;

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  // Fetch products from API
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetProductsQuery() as {
    data: ProductsQueryResponse;
    isLoading: boolean;
    error: any;
  };
  const [deleteProduct] = useDeleteProductMutation();

  // Extract products from API response with proper type checking
  const products: Product[] = (() => {
    if (!apiResponse) return [];

    // Check if apiResponse is an array (direct product array)
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }

    // Check if apiResponse has a data property (wrapped response)
    if (
      apiResponse &&
      typeof apiResponse === "object" &&
      "data" in apiResponse
    ) {
      return (apiResponse as ApiResponse).data || [];
    }

    return [];
  })();

  // Filter products based on search and filters
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter || product.category_name === categoryFilter;
    const matchesSupplier =
      !supplierFilter || product.supplier_name === supplierFilter;

    return matchesSearch && matchesCategory && matchesSupplier;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Get unique categories and suppliers for filters
  const categories = [
    ...new Set(products.map((p: Product) => p.category_name)),
  ];
  const suppliers = [...new Set(products.map((p: Product) => p.supplier_name))];

  const handleRowClick = (itemUuid: string) => {
    router.push(`/admin/products/productDetail/${itemUuid}`);
  };

  const handleEdit = (e: React.MouseEvent, itemUuid: string) => {
    e.stopPropagation();
    console.log("Edit product:", itemUuid);
    // Implement edit functionality
  };

  const handleDelete = async (e: React.MouseEvent, itemUuid: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(itemUuid as any).unwrap();
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Get stock status color (based on unit_quantity for now)
  const getStockStatus = (quantity: number) => {
    if (quantity <= 5) return "text-red-600 bg-red-100";
    if (quantity <= 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  // Handle image error with proper typing
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    const nextSibling = target.nextElementSibling as HTMLElement | null;

    target.style.display = "none";
    if (nextSibling) {
      nextSibling.style.display = "flex";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error loading products</div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">Product Management</h1>
          <p className="text-gray-500 text-sm lg:text-base">
            Efficiently manage and track products
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            variant="outline"
            className="border-green-500 hover:bg-green-50 cursor-pointer w-full sm:w-auto"
          >
            Generate Report
          </Button>
          <div className="border p-3 rounded-lg text-sm w-full sm:w-auto text-center">
            Total Products: {products.length}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search products..."
                className="pl-10 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            {/* <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-[180px] h-10">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-[180px] h-10">
                  <SelectValue placeholder="Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Suppliers</SelectItem>
                  {suppliers.map((supplier: string) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Add Button */}
          <div className="w-full lg:w-auto">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer w-full lg:w-auto"
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Desktop Table View (hidden on mobile/tablet) */}
        <div className="hidden xl:block mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" w-[5%] font-bold">Image</TableHead>
                <TableHead className=" w-[10%] font-bold">Item Code</TableHead>
                <TableHead className=" w-[15%] font-bold">Item Name</TableHead>
                <TableHead className=" w-[10%] font-bold">Pack Type</TableHead>
                <TableHead className=" w-[10%] font-bold">
                  Unit Quantity
                </TableHead>
                <TableHead className=" w-[10%] font-bold">
                  Selling Price
                </TableHead>
                {/* <TableHead className=" w-[10%] font-bold">
                  Stockes
                </TableHead> */}
                <TableHead className=" w-[10%] font-bold">Supplier</TableHead>
                <TableHead className=" w-[5%] text-right font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product: Product) => (
                <TableRow
                  key={product.item_uuid}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(product.item_uuid)}
                >
                  <TableCell>
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`${product.images[0]}`}
                          alt={product.item_name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : null}
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.item_code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.item_name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {product.unit_type}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                        parseFloat(product.unit_quantity)
                      )}`}
                    >
                      {product.unit_quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rs. {parseFloat(product.selling_price).toFixed(2)}
                  </TableCell>
                  <TableCell>{product.supplier_name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, product.item_uuid)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, product.item_uuid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Tablet View (md to lg) - Simplified Table */}
        <div className="hidden md:block xl:hidden mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Product Info</TableHead>
                <TableHead className="font-bold">Price & Stock</TableHead>
                <TableHead className="font-bold">Supplier</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product: Product) => (
                <TableRow
                  key={product.item_uuid}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(product.item_uuid)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={`/images/${product.images[0]}`}
                            alt={product.item_name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : null}
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{product.item_name}</div>
                        <div className="text-xs font-mono text-gray-400 mt-1">
                          {product.item_code}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-lg">
                        Rs. {parseFloat(product.selling_price).toFixed(2)}
                      </div>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                            parseFloat(product.unit_quantity)
                          )}`}
                        >
                          {product.unit_quantity} {product.unit_type}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{product.supplier_name}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, product.item_uuid)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, product.item_uuid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="block md:hidden mt-4 space-y-4">
          {currentProducts.map((product: Product) => (
            <div
              key={product.item_uuid}
              className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRowClick(product.item_uuid)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${product.images[0]}`}
                        alt={product.item_name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : null}
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg leading-tight mb-1">
                      {product.item_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={(e) => handleEdit(e, product.item_uuid)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => handleDelete(e, product.item_uuid)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-lg">
                    Rs. {parseFloat(product.selling_price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                      parseFloat(product.unit_quantity)
                    )}`}
                  >
                    {product.unit_quantity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="font-mono text-xs text-gray-600">
                    {product.item_code}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-xs">
                    {product.supplier_name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>

          {totalPages > 1 && (
            <Pagination className="justify-center sm:justify-end">
              <PaginationContent className="flex-wrap">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
