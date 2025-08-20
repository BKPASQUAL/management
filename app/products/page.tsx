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

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "Premium noise-cancelling headphones",
      price: "$199.99",
      quantity: 45,
      sku: "WH001",
      location: "Warehouse A",
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Fitness tracking smartwatch",
      price: "$299.99",
      quantity: 32,
      sku: "SW002",
      location: "Warehouse B",
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      description: "Portable wireless speaker",
      price: "$79.99",
      quantity: 78,
      sku: "BS003",
      location: "Warehouse A",
    },
    {
      id: 4,
      name: "USB Cable",
      description: "High-speed USB-C cable",
      price: "$19.99",
      quantity: 120,
      sku: "UC004",
      location: "Warehouse C",
    },
    {
      id: 5,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: "$49.99",
      quantity: 65,
      sku: "WM005",
      location: "Warehouse A",
    },
    {
      id: 6,
      name: "Keyboard",
      description: "Mechanical gaming keyboard",
      price: "$129.99",
      quantity: 28,
      sku: "KB006",
      location: "Warehouse B",
    },
    {
      id: 7,
      name: "Monitor",
      description: "27-inch 4K display",
      price: "$399.99",
      quantity: 15,
      sku: "MN007",
      location: "Warehouse A",
    },
    {
      id: 8,
      name: "Webcam",
      description: "HD video conference camera",
      price: "$89.99",
      quantity: 42,
      sku: "WC008",
      location: "Warehouse C",
    },
    {
      id: 9,
      name: "Power Bank",
      description: "10000mAh portable charger",
      price: "$39.99",
      quantity: 95,
      sku: "PB009",
      location: "Warehouse A",
    },
    {
      id: 10,
      name: "Phone Case",
      description: "Protective silicone case",
      price: "$24.99",
      quantity: 150,
      sku: "PC010",
      location: "Warehouse B",
    },
    {
      id: 11,
      name: "Tablet Stand",
      description: "Adjustable aluminum stand",
      price: "$34.99",
      quantity: 38,
      sku: "TS011",
      location: "Warehouse C",
    },
    {
      id: 12,
      name: "USB Hub",
      description: "7-port USB 3.0 hub",
      price: "$29.99",
      quantity: 56,
      sku: "UH012",
      location: "Warehouse A",
    },
    {
      id: 13,
      name: "Tablet Stand Pro",
      description: "Premium adjustable aluminum stand",
      price: "$44.99",
      quantity: 25,
      sku: "TS013",
      location: "Warehouse C",
    },
    {
      id: 14,
      name: "USB Hub Pro",
      description: "10-port USB 3.1 hub with charging",
      price: "$49.99",
      quantity: 33,
      sku: "UH014",
      location: "Warehouse A",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(sampleProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sampleProducts.slice(startIndex, endIndex);

  const handleRowClick = (productId: number) => {
    router.push(`/products/productDetail/${productId}`);
  };

  const handleEdit = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    console.log("Edit product:", productId);
  };

  const handleDelete = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    console.log("Delete product:", productId);
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

  // Get stock status color
  const getStockStatus = (quantity: number) => {
    if (quantity <= 20) return "text-red-600 bg-red-100";
    if (quantity <= 50) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
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
            Total Products: {sampleProducts.length}
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
              <Input placeholder="Search products..." className="pl-10 h-9" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Select>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-[180px] h-10">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-[180px] h-10">
                  <SelectValue placeholder="Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Supplier A</SelectItem>
                  <SelectItem value="supplier2">Supplier B</SelectItem>
                  <SelectItem value="supplier3">Supplier C</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <div className="hidden xl:block mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Product Name</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Quantity</TableHead>
                <TableHead className="font-bold">SKU</TableHead>
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(product.id)}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-600">
                    {product.description}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {product.price}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                        product.quantity
                      )}`}
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, product.id)}
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
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(product.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {product.description}
                      </div>
                      <div className="text-xs font-mono text-gray-400 mt-1">
                        SKU: {product.sku}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-lg">
                        {product.price}
                      </div>
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                            product.quantity
                          )}`}
                        >
                          Stock: {product.quantity}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{product.location}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, product.id)}
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
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRowClick(product.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-lg leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={(e) => handleEdit(e, product.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => handleDelete(e, product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-lg">{product.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                      product.quantity
                    )}`}
                  >
                    {product.quantity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="font-mono text-xs text-gray-600">
                    {product.sku}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 text-xs">
                    {product.location}
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
            {Math.min(endIndex, sampleProducts.length)} of{" "}
            {sampleProducts.length} products
          </div>

          <Pagination className="justify-center sm:justify-end">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
        </div>
      </div>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
