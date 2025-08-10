"use client";

import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState, useMemo } from "react";
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
  TableCaption,
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

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const router = useRouter();

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
      name: "Tablet Stand",
      description: "Adjustable aluminum stand",
      price: "$34.99",
      quantity: 38,
      sku: "TS011",
      location: "Warehouse C",
    },
    {
      id: 14,
      name: "USB Hub",
      description: "7-port USB 3.0 hub",
      price: "$29.99",
      quantity: 56,
      sku: "UH012",
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
    e.stopPropagation(); // Prevent row click when clicking edit button
    console.log("Edit product:", productId);
  };

  const handleDelete = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Prevent row click when clicking delete button
    console.log("Delete product:", productId);
  };

  const handleAddProduct = () => {
    console.log("Add new product");
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Product Management</h1>
          <p className="text-gray-500">Efficiently manage and track products</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-green-500  hover:bg-green-50 cursor-pointer"
          >
            Generate Report
          </Button>

          <div className="border p-4 rounded-lg">
            Total Products: {sampleProducts.length}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between gap-4 mt-2">
          {/* Search Bar */}
          <div className="w-full flex items-center gap-4">
            <div className="relative w-2/7">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input placeholder="Search products..." className="pl-10 h-9" />
            </div>

            {/* Filters */}
            <Select>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier1">Supplier A</SelectItem>
                <SelectItem value="supplier2">Supplier B</SelectItem>
                <SelectItem value="supplier3">Supplier C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={handleAddProduct} className="cursor-pointer">
              Add Product
            </Button>
          </div>
        </div>

        <Table className="mt-4">
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
                <TableCell className="font-semibold">{product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
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

        {/* Pagination */}
        <div className=" flex  justify-between items-center mt-4 ">
          <div className="text-sm text-gray-500 w-full">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, sampleProducts.length)} of{" "}
            {sampleProducts.length} products
          </div>

          <Pagination className="flex  justify-end">
            <PaginationContent>
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
    </div>
  );
}
