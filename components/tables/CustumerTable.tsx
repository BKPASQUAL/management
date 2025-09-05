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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Define the Customer interface
interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  area: string;
  route: string;
  representative: string;
  phone?: string;
  email?: string;
}

export default function CustomerTable() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  
  const router = useRouter();

  const sampleCustomers: Customer[] = [
    {
      id: 1,
      customerCode: "CUST001",
      customerName: "ABC Electronics Ltd",
      area: "Colombo",
      route: "Route A1",
      representative: "John Silva",
      phone: "+94 11 2345678",
      email: "contact@abcelectronics.lk",
    },
    {
      id: 2,
      customerCode: "CUST002",
      customerName: "Tech Solutions Pvt Ltd",
      area: "Kandy",
      route: "Route K2",
      representative: "Mary Fernando",
      phone: "+94 81 2234567",
      email: "info@techsolutions.lk",
    },
    {
      id: 3,
      customerCode: "CUST003",
      customerName: "Digital World",
      area: "Galle",
      route: "Route G1",
      representative: "David Perera",
      phone: "+94 91 2345678",
    },
    {
      id: 4,
      customerCode: "CUST004",
      customerName: "Modern Computers",
      area: "Negombo",
      route: "Route N3",
      representative: "Sarah De Silva",
      phone: "+94 31 2234567",
      email: "info@moderncomputers.lk",
    },
    {
      id: 5,
      customerCode: "CUST005",
      customerName: "Smart Systems",
      area: "Matara",
      route: "Route M1",
      representative: "John Silva",
      phone: "+94 41 2345678",
    },
    {
      id: 6,
      customerCode: "CUST006",
      customerName: "Future Tech",
      area: "Colombo",
      route: "Route A2",
      representative: "Mary Fernando",
      phone: "+94 11 2234567",
      email: "sales@futuretech.lk",
    },
    {
      id: 7,
      customerCode: "CUST007",
      customerName: "Innovation Hub",
      area: "Kandy",
      route: "Route K1",
      representative: "David Perera",
      phone: "+94 81 2345678",
      email: "info@innovationhub.lk",
    },
    {
      id: 8,
      customerCode: "CUST008",
      customerName: "Cyber Solutions",
      area: "Kurunegala",
      route: "Route KU1",
      representative: "Sarah De Silva",
      phone: "+94 37 2234567",
      email: "contact@cybersolutions.lk",
    },
    {
      id: 9,
      customerCode: "CUST009",
      customerName: "Elite Technologies",
      area: "Anuradhapura",
      route: "Route A3",
      representative: "John Silva",
      phone: "+94 25 2345678",
      email: "info@elitetech.lk",
    },
    {
      id: 10,
      customerCode: "CUST010",
      customerName: "Prime Electronics",
      area: "Ratnapura",
      route: "Route R1",
      representative: "Mary Fernando",
      phone: "+94 45 2234567",
      email: "sales@primeelectronics.lk",
    },
    {
      id: 11,
      customerCode: "CUST011",
      customerName: "Next Gen Systems",
      area: "Batticaloa",
      route: "Route B1",
      representative: "David Perera",
      phone: "+94 65 2345678",
      email: "info@nextgensystems.lk",
    },
    {
      id: 12,
      customerCode: "CUST012",
      customerName: "Advanced Solutions",
      area: "Jaffna",
      route: "Route J1",
      representative: "Sarah De Silva",
      phone: "+94 21 2234567",
      email: "contact@advancedsolutions.lk",
    },
    {
      id: 13,
      customerCode: "CUST013",
      customerName: "Global Tech Partners",
      area: "Colombo",
      route: "Route A3",
      representative: "John Silva",
      phone: "+94 11 2345679",
    },
    {
      id: 14,
      customerCode: "CUST014",
      customerName: "Innovative Systems",
      area: "Galle",
      route: "Route G2",
      representative: "Mary Fernando",
      phone: "+94 91 2234568",
      email: "sales@innovativesystems.lk",
    },
  ];

  // Get unique locations and representatives for filter dropdowns
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(sampleCustomers.map(customer => customer.area))).sort();
  }, [sampleCustomers]);

  const uniqueSuppliers = useMemo(() => {
    return Array.from(new Set(sampleCustomers.map(customer => customer.representative))).sort();
  }, [sampleCustomers]);

  // Filter customers based on search term and filters
  const filteredCustomers = useMemo(() => {
    return sampleCustomers.filter(customer => {
      const matchesSearch = searchTerm === "" || 
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = selectedLocation === "all" || customer.area === selectedLocation;
      const matchesSupplier = selectedSupplier === "all" || customer.representative === selectedSupplier;

      return matchesSearch && matchesLocation && matchesSupplier;
    });
  }, [searchTerm, selectedLocation, selectedSupplier, sampleCustomers]);

  // Calculate pagination for filtered results
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedSupplier]);

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

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Representative" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Representatives</SelectItem>
              {uniqueSuppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      {(searchTerm || selectedLocation !== "all" || selectedSupplier !== "all") && (
        <div className="text-sm text-gray-600 px-1">
          Showing {filteredCustomers.length} of {sampleCustomers.length} customers
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedLocation !== "all" && ` in ${selectedLocation}`}
          {selectedSupplier !== "all" && ` with ${selectedSupplier}`}
        </div>
      )}

      {/* Desktop View (xl and above) - Full Table */}
      <div className="hidden xl:block">
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-1/9">Customer Code</TableHead>
              <TableHead className="font-bold w-1/9">Customer Name</TableHead>
              <TableHead className="font-bold w-1/9">Area</TableHead>
              <TableHead className="font-bold w-1/9">Route</TableHead>
              <TableHead className="font-bold w-1/9">Representative</TableHead>
              <TableHead className="font-bold w-1/9">Contact</TableHead>
              <TableHead className="text-right font-bold w-1/9">Actions</TableHead>
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
                  {customer.customerCode}
                </TableCell>
                <TableCell className="font-medium">
                  {customer.customerName}
                </TableCell>
                <TableCell>{customer.area}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {customer.route}
                  </span>
                </TableCell>
                <TableCell>{customer.representative}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{customer.phone}</div>
                    <div className="text-gray-500">{customer.email}</div>
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
              <TableHead className="font-bold">Area & Route</TableHead>
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
                    <div className="font-medium">{customer.customerName}</div>
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      Code: {customer.customerCode}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{customer.area}</div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {customer.route}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{customer.representative}</div>
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
                <h3 className="font-medium text-lg">{customer.customerName}</h3>
                <p className="text-sm font-mono text-gray-500">
                  {customer.customerCode}
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
                <span className="font-medium">{customer.area}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Route:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {customer.route}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Representative:</span>
                <span className="font-medium">{customer.representative}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-600">{customer.phone}</div>
                <div className="text-sm text-gray-500">{customer.email}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredCustomers.length === 0 && (
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