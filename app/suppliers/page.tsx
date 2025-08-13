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
import AddSupplier from "@/components/model/AddSupplier";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sampleSuppliers = [
    {
      id: 1,
      supplierName: "TechPro Electronics Ltd",
      contactPerson: "John Smith",
      email: "john.smith@techpro.com",
      phone: "+1-555-0101",
      supplierCode: "SUP001",
      category: "Electronics",
      location: "New York, USA",
    },
    {
      id: 2,
      supplierName: "Global Components Inc",
      contactPerson: "Sarah Johnson",
      email: "s.johnson@globalcomp.com",
      phone: "+1-555-0102",
      supplierCode: "SUP002",
      category: "Components",
      location: "California, USA",
    },
    {
      id: 3,
      supplierName: "AudioMax Solutions",
      contactPerson: "Michael Chen",
      email: "m.chen@audiomax.com",
      phone: "+1-555-0103",
      supplierCode: "SUP003",
      category: "Audio Equipment",
      location: "Texas, USA",
    },
    {
      id: 4,
      supplierName: "Cable Connect Corp",
      contactPerson: "Emily Davis",
      email: "e.davis@cableconnect.com",
      phone: "+1-555-0104",
      supplierCode: "SUP004",
      category: "Cables & Accessories",
      location: "Florida, USA",
    },
    {
      id: 5,
      supplierName: "Peripheral Plus",
      contactPerson: "David Wilson",
      email: "d.wilson@peripheralplus.com",
      phone: "+1-555-0105",
      supplierCode: "SUP005",
      category: "Computer Peripherals",
      location: "Illinois, USA",
    },
    {
      id: 6,
      supplierName: "Gaming Gear Ltd",
      contactPerson: "Lisa Anderson",
      email: "l.anderson@gaminggear.com",
      phone: "+1-555-0106",
      supplierCode: "SUP006",
      category: "Gaming Equipment",
      location: "Washington, USA",
    },
    {
      id: 7,
      supplierName: "Display Technologies",
      contactPerson: "Robert Miller",
      email: "r.miller@displaytech.com",
      phone: "+1-555-0107",
      supplierCode: "SUP007",
      category: "Display & Monitors",
      location: "Oregon, USA",
    },
    {
      id: 8,
      supplierName: "Vision Systems Pro",
      contactPerson: "Amanda Taylor",
      email: "a.taylor@visionsys.com",
      phone: "+1-555-0108",
      supplierCode: "SUP008",
      category: "Cameras & Vision",
      location: "Nevada, USA",
    },
    {
      id: 9,
      supplierName: "Power Solutions Inc",
      contactPerson: "James Brown",
      email: "j.brown@powersolutions.com",
      phone: "+1-555-0109",
      supplierCode: "SUP009",
      category: "Power & Charging",
      location: "Arizona, USA",
    },
    {
      id: 10,
      supplierName: "Mobile Accessories Co",
      contactPerson: "Jennifer White",
      email: "j.white@mobileacc.com",
      phone: "+1-555-0110",
      supplierCode: "SUP010",
      category: "Mobile Accessories",
      location: "Colorado, USA",
    },
    {
      id: 11,
      supplierName: "Stand & Mount Systems",
      contactPerson: "Kevin Garcia",
      email: "k.garcia@standmount.com",
      phone: "+1-555-0111",
      supplierCode: "SUP011",
      category: "Stands & Mounts",
      location: "Utah, USA",
    },
    {
      id: 12,
      supplierName: "Hub Technologies",
      contactPerson: "Maria Rodriguez",
      email: "m.rodriguez@hubtech.com",
      phone: "+1-555-0112",
      supplierCode: "SUP012",
      category: "Connectivity",
      location: "Georgia, USA",
    },
    {
      id: 13,
      supplierName: "Premium Stands Ltd",
      contactPerson: "Daniel Lee",
      email: "d.lee@premiumstands.com",
      phone: "+1-555-0113",
      supplierCode: "SUP013",
      category: "Stands & Mounts",
      location: "Michigan, USA",
    },
    {
      id: 14,
      supplierName: "Universal Hubs Inc",
      contactPerson: "Carol Martinez",
      email: "c.martinez@universalhubs.com",
      phone: "+1-555-0114",
      supplierCode: "SUP014",
      category: "Connectivity",
      location: "Virginia, USA",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(sampleSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = sampleSuppliers.slice(startIndex, endIndex);

  const handleRowClick = (supplierId: number) => {
    router.push(`/suppliers/supplierDetail/${supplierId}`);
  };

  const handleEdit = (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation();
    console.log("Edit supplier:", supplierId);
  };

  const handleDelete = (e: React.MouseEvent, supplierId: number) => {
    e.stopPropagation();
    console.log("Delete supplier:", supplierId);
  };

  const handleAddSupplier = () => {
    console.log("Add new supplier");
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
    <div className="p-4 lg:p-6">
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
            Total Suppliers: {sampleSuppliers.length}
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
              <Input placeholder="Search Suppliers..." className="pl-10 h-9" />
            </div>

            {/* Category Filter */}
            <Select>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <SelectValue placeholder="Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="audio">Audio Equipment</SelectItem>
                <SelectItem value="gaming">Gaming Equipment</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Desktop Table View (hidden on mobile/tablet) */}
        <div className="hidden xl:block mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Supplier Name</TableHead>
                <TableHead className="font-bold">Contact Person</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Supplier Code</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(supplier.id)}
                >
                  <TableCell className="font-medium">
                    {supplier.supplierName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {supplier.contactPerson}
                  </TableCell>
                  <TableCell className="text-blue-600 hover:underline">
                    {supplier.email}
                  </TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className="text-sm">
                    {supplier.supplierCode}
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, supplier.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, supplier.id)}
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
                <TableHead className="font-bold">Supplier Info</TableHead>
                <TableHead className="font-bold">Contact</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(supplier.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.supplierName}</div>
                      <div className="text-sm text-gray-500">
                        {supplier.supplierCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{supplier.contactPerson}</div>
                      <div className="text-xs text-blue-600">
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{supplier.category}</div>
                      <div className="text-xs text-gray-500">
                        {supplier.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={(e) => handleEdit(e, supplier.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={(e) => handleDelete(e, supplier.id)}
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
          {currentSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRowClick(supplier.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-lg leading-tight mb-1">
                    {supplier.supplierName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Code: {supplier.supplierCode}
                  </p>
                </div>
                <div className="flex gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    onClick={(e) => handleEdit(e, supplier.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                    onClick={(e) => handleDelete(e, supplier.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {supplier.contactPerson}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-blue-600">{supplier.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{supplier.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{supplier.location}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {supplier.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, sampleSuppliers.length)} of{" "}
            {sampleSuppliers.length} Suppliers
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

      <AddSupplier
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
