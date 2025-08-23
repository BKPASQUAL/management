"use client";

import { Input } from "@/components/ui/input";
import {
  Edit,
  Search,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  Loader2,
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
import AddSupplier from "@/components/model/AddSupplier";
import {
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
  Supplier,
} from "@/store/services/api";
import { toast } from "sonner";

// Define the API response type
interface SuppliersApiResponse {
  data: Supplier[];
  // Add other properties if your API response has them
  message?: string;
  status?: string;
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const itemsPerPage = 11;
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // API hooks with proper typing
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useGetSuppliersQuery();
  const [deleteSupplier, { isLoading: isDeleting }] =
    useDeleteSupplierMutation();

  // Extract suppliers array from API response with proper type checking
  const suppliers: Supplier[] = Array.isArray(apiResponse)
    ? apiResponse
    : (apiResponse as unknown as SuppliersApiResponse)?.data || [];

  // Filter suppliers based on search term and category
  const filteredSuppliers = suppliers.filter((supplier: Supplier) => {
    const matchesSearch =
      supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone_number.includes(searchTerm);

    // For category filter, you might need to add a category field to your Supplier interface
    // const matchesCategory = !categoryFilter || supplier.category === categoryFilter;

    return matchesSearch; // && matchesCategory (uncomment when category is added)
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  const handleRowClick = (supplierId: number) => {
    router.push(`/admin/suppliers/supplierDetail/${supplierId}`);
  };

  const handleEdit = (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation();
    router.push(`/admin/suppliers/edit/${supplierId}`);
  };

  const handleDelete = async (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(supplierId).unwrap();
        toast.success("Supplier deleted successfully");
        refetch();
      } catch (error) {
        console.error("Failed to delete supplier:", error);
        toast.error("Failed to delete supplier");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value === "all" ? "" : value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Generate page numbers for pagination
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading suppliers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load suppliers</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">Supplier Management</h1>
          <p className="text-gray-500 text-sm lg:text-base">
            Manage our suppliers easily and efficiently.
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
            Total Suppliers: {suppliers.length}
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
                placeholder="Search Suppliers..."
                className="pl-10 h-9"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="w-full lg:w-auto">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer w-full lg:w-auto"
            >
              Add Supplier
            </Button>
          </div>
        </div>

        {/* No suppliers found message */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || categoryFilter
                ? "No suppliers found matching your criteria."
                : "No suppliers found."}
            </p>
          </div>
        )}

        {/* Desktop Table View (hidden on mobile/tablet) */}
        {filteredSuppliers.length > 0 && (
          <div className="hidden xl:block mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Supplier Name</TableHead>
                  <TableHead className="font-bold">Contact Person</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Phone</TableHead>
                  <TableHead className="font-bold">Credit Days</TableHead>
                  <TableHead className="font-bold">Address</TableHead>
                  <TableHead className="text-right font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSuppliers.map((supplier: Supplier) => (
                  <TableRow
                    key={supplier?.supplier_id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(supplier.supplier_id!)}
                  >
                    <TableCell className="font-medium">
                      {supplier.supplier_name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {supplier.contact_person}
                    </TableCell>
                    <TableCell className="text-blue-600 hover:underline">
                      {supplier.email}
                    </TableCell>
                    <TableCell>{supplier.phone_number}</TableCell>
                    <TableCell className="text-sm">
                      {supplier.credit_days} days
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {supplier.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer"
                          onClick={(e) => handleEdit(e, supplier.supplier_id!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={(e) =>
                            handleDelete(e, supplier.supplier_id!)
                          }
                          disabled={isDeleting}
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
        )}

        {/* Tablet View (md to lg) - Simplified Table */}
        {filteredSuppliers.length > 0 && (
          <div className="hidden md:block xl:hidden mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Supplier Info</TableHead>
                  <TableHead className="font-bold">Contact</TableHead>
                  <TableHead className="font-bold">Credit Days</TableHead>
                  <TableHead className="text-right font-bold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSuppliers.map((supplier: Supplier) => (
                  <TableRow
                    key={supplier?.supplier_id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(supplier.supplier_id!)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {supplier.supplier_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {supplier.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{supplier.contact_person}</div>
                        <div className="text-xs text-blue-600">
                          {supplier.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{supplier.credit_days} days</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 cursor-pointer"
                          onClick={(e) => handleEdit(e, supplier.supplier_id!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={(e) =>
                            handleDelete(e, supplier.supplier_id!)
                          }
                          disabled={isDeleting}
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
        )}

        {/* Mobile View - Card Layout */}
        {filteredSuppliers.length > 0 && (
          <div className="block md:hidden mt-4 space-y-4">
            {currentSuppliers.map((supplier: Supplier) => (
              <div
                key={supplier?.supplier_id}
                className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRowClick(supplier.supplier_id!)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg leading-tight mb-1">
                      {supplier.supplier_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Credit Days: {supplier.credit_days} days
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
                      onClick={(e) => handleEdit(e, supplier.supplier_id!)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      onClick={(e) => handleDelete(e, supplier.supplier_id!)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {supplier.contact_person}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-blue-600">{supplier.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {supplier.phone_number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{supplier.address}</span>
                  </div>
                </div>

                {supplier.additional_notes && (
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      {supplier.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredSuppliers.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
            <div className="text-sm text-gray-500 text-center sm:text-left w-full">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredSuppliers.length)} of{" "}
              {filteredSuppliers.length} Suppliers
            </div>

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
                  <PaginationItem key={`page-${page}-${index}`}>
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
        )}
      </div>

      <AddSupplier
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
