"use client";

import { Edit, Table, Trash2, Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetCustomersQuery } from "@/store/services/customer";

interface CustomerTableProps {
  searchTerm?: string;
  selectedLocation?: string;
  selectedSupplier?: string;
  customerType?: "retail" | "enterprise";
}

export default function CustomerTable({
  searchTerm = "",
  selectedLocation = "all",
  selectedSupplier = "all",
  customerType,
}: CustomerTableProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const router = useRouter();

  // Fetch customers from API
  const {
    data: customersResponse,
    error,
    isLoading,
    isError,
  } = useGetCustomersQuery();

  const customers = customersResponse?.data || [];

  // Filter customers based on search term and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        searchTerm === "" ||
        customer.customerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.customerCode
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "all" ||
        customer.area?.area_name === selectedLocation;

      const matchesSupplier =
        selectedSupplier === "all" ||
        customer.assignedRep?.username === selectedSupplier;

      const matchesCustomerType =
        !customerType || customer.customerType === customerType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSupplier &&
        matchesCustomerType
      );
    });
  }, [searchTerm, selectedLocation, selectedSupplier, customerType, customers]);

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedSupplier, customerType]);

  // Handler functions
  const handleRowClick = (customerId: number): void => {
    router.push(`/customers/customerDetail/${customerId}`);
  };

  const handleEdit = (event: React.MouseEvent, customerId: number): void => {
    event.stopPropagation();
    console.log("Edit customer:", customerId);
  };

  const handleDelete = (event: React.MouseEvent, customerId: number): void => {
    event.stopPropagation();
    console.log("Delete customer:", customerId);
    if (window.confirm("Are you sure you want to delete this customer?")) {
      console.log("Customer deleted:", customerId);
    }
  };

  // Pagination handlers
  const handlePreviousPage = (): void => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number): void => {
    setCurrentPage(page);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading customers:{" "}
          {error ? JSON.stringify(error) : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View (xl and above) - Full Table */}
      <div className="hidden xl:block">
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-1/8">Customer Code</TableHead>
              <TableHead className="font-bold w-1/8">Customer Name</TableHead>
              <TableHead className="font-bold w-1/8">Shop Name</TableHead>
              <TableHead className="font-bold w-1/8">Area</TableHead>
              <TableHead className="font-bold w-1/8">Type</TableHead>
              <TableHead className="font-bold w-1/8">Representative</TableHead>
              <TableHead className="font-bold w-1/8">Contact</TableHead>
              <TableHead className="text-right font-bold w-1/8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(customer.id)}
              >
                <TableCell className="font-mono font-medium">
                  {customer.customerCode || "-"}
                </TableCell>
                <TableCell className="font-medium">
                  {customer.customerName || "-"}
                </TableCell>
                <TableCell>{customer.shopName || "-"}</TableCell>
                <TableCell>{customer.area?.area_name || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.customerType === "retail"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {customer.customerType?.charAt(0).toUpperCase() +
                      customer.customerType?.slice(1) || "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {customer.assignedRep?.username || "-"}
                    </div>
                    {/* <div className="text-xs text-gray-500">
                      {customer.assignedRep?.role || "-"}
                    </div> */}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{customer.contactNumber || "-"}</div>
                    <div
                      className="text-gray-500 truncate max-w-[150px]"
                      title={customer.address || "-"}
                    >
                      {customer.address || "-"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleEdit(e, customer.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>

      {/* Tablet View (md to lg) - Simplified Table */}
      <div className="hidden md:block xl:hidden">
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Customer Info</TableHead>
              <TableHead className="font-bold">Area & Type</TableHead>
              <TableHead className="font-bold">Representative</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(customer.id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {customer.customerName || "-"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {customer.shopName || "-"}
                    </div>
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      {customer.customerCode || "-"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {customer.contactNumber || "-"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {customer.area?.area_name || "-"}
                    </div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.customerType === "retail"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {customer.customerType?.charAt(0).toUpperCase() +
                          customer.customerType?.slice(1) || "-"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {customer.assignedRep?.username || "-"}
                  </div>
                  
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleEdit(e, customer.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableComponent>
      </div>

      {/* Mobile View (sm and below) - Card Layout */}
      <div className="md:hidden space-y-4">
        {currentCustomers.map((customer) => (
          <div
            key={customer.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleRowClick(customer.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-lg">
                  {customer.customerName || "-"}
                </h3>
                <p className="text-sm text-gray-600">
                  {customer.shopName || "-"}
                </p>
                <p className="text-sm font-mono text-gray-500">
                  {customer.customerCode || "-"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleEdit(e, customer.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDelete(e, customer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Area:</span>
                <span className="font-medium">
                  {customer.area?.area_name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.customerType === "retail"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {customer.customerType?.charAt(0).toUpperCase() +
                    customer.customerType?.slice(1) || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Representative:</span>
                <div className="text-right">
                  <div className="font-medium">
                    {customer.assignedRep?.username || "-"}
                  </div>
                  {/* <div className="text-xs text-gray-500">
                    {customer.assignedRep?.role || "-"}
                  </div> */}
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-600">
                  {customer.contactNumber || "-"}
                </div>
                <div
                  className="text-sm text-gray-500"
                  title={customer.address || "-"}
                >
                  {customer.address || "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredCustomers.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No customers found matching your search criteria.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
