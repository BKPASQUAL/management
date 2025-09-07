"use client";

import { Edit, Trash2, Search } from "lucide-react";
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

// Define the Stock interface based on your entity
interface Stock {
  stock_id: number;
  item_id: number;
  item: {
    item_id: number;
    item_code: string;
    item_name: string;
    supplier?: string; // Added supplier field
  };
  location: {
    location_id: number;
    location_name: string;
    location_code: string;
  };
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export default function StocksTable() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const router = useRouter();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");

  const sampleStocks: Stock[] = [
    {
      stock_id: 1,
      item_id: 101,
      item: {
        item_id: 101,
        item_code: "ITM001",
        item_name: "Dell Laptop 15.6 inch",
        supplier: "Dell Technologies",
      },
      location: {
        location_id: 1,
        location_name: "Main Warehouse",
        location_code: "WH001",
      },
      quantity: 25,
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-02-20"),
    },
    {
      stock_id: 2,
      item_id: 102,
      item: {
        item_id: 102,
        item_code: "ITM002",
        item_name: "HP Printer LaserJet",
        supplier: "HP Inc.",
      },
      location: {
        location_id: 2,
        location_name: "Store Room A",
        location_code: "SR001",
      },
      quantity: 15,
      created_at: new Date("2024-01-20"),
      updated_at: new Date("2024-02-25"),
    },
    {
      stock_id: 3,
      item_id: 103,
      item: {
        item_id: 103,
        item_code: "ITM003",
        item_name: "Wireless Mouse",
        supplier: "Logitech",
      },
      location: {
        location_id: 1,
        location_name: "Main Warehouse",
        location_code: "WH001",
      },
      quantity: 150,
      created_at: new Date("2024-01-25"),
      updated_at: new Date("2024-03-01"),
    },
    {
      stock_id: 4,
      item_id: 104,
      item: {
        item_id: 104,
        item_code: "ITM004",
        item_name: "USB-C Hub",
        supplier: "Anker",
      },
      location: {
        location_id: 3,
        location_name: "Electronics Storage",
        location_code: "ES001",
      },
      quantity: 75,
      created_at: new Date("2024-02-01"),
      updated_at: new Date("2024-03-05"),
    },
    {
      stock_id: 5,
      item_id: 105,
      item: {
        item_id: 105,
        item_code: "ITM005",
        item_name: "Monitor 24 inch LED",
        supplier: "Samsung",
      },
      location: {
        location_id: 2,
        location_name: "Store Room A",
        location_code: "SR001",
      },
      quantity: 8,
      created_at: new Date("2024-02-05"),
      updated_at: new Date("2024-03-10"),
    },
    {
      stock_id: 6,
      item_id: 106,
      item: {
        item_id: 106,
        item_code: "ITM006",
        item_name: "Keyboard Mechanical",
        supplier: "Corsair",
      },
      location: {
        location_id: 1,
        location_name: "Main Warehouse",
        location_code: "WH001",
      },
      quantity: 45,
      created_at: new Date("2024-02-10"),
      updated_at: new Date("2024-03-15"),
    },
    {
      stock_id: 7,
      item_id: 107,
      item: {
        item_id: 107,
        item_code: "ITM007",
        item_name: "Webcam HD 1080p",
        supplier: "Logitech",
      },
      location: {
        location_id: 4,
        location_name: "Accessories Wing",
        location_code: "AW001",
      },
      quantity: 30,
      created_at: new Date("2024-02-15"),
      updated_at: new Date("2024-03-20"),
    },
    {
      stock_id: 8,
      item_id: 108,
      item: {
        item_id: 108,
        item_code: "ITM008",
        item_name: "External Hard Drive 1TB",
        supplier: "Seagate",
      },
      location: {
        location_id: 1,
        location_name: "Main Warehouse",
        location_code: "WH001",
      },
      quantity: 20,
      created_at: new Date("2024-02-20"),
      updated_at: new Date("2024-03-25"),
    },
    {
      stock_id: 9,
      item_id: 109,
      item: {
        item_id: 109,
        item_code: "ITM009",
        item_name: "Router WiFi 6",
        supplier: "TP-Link",
      },
      location: {
        location_id: 3,
        location_name: "Electronics Storage",
        location_code: "ES001",
      },
      quantity: 12,
      created_at: new Date("2024-02-25"),
      updated_at: new Date("2024-03-30"),
    },
    {
      stock_id: 10,
      item_id: 110,
      item: {
        item_id: 110,
        item_code: "ITM010",
        item_name: "Power Bank 20000mAh",
        supplier: "Anker",
      },
      location: {
        location_id: 2,
        location_name: "Store Room A",
        location_code: "SR001",
      },
      quantity: 85,
      created_at: new Date("2024-03-01"),
      updated_at: new Date("2024-04-05"),
    },
    {
      stock_id: 11,
      item_id: 111,
      item: {
        item_id: 111,
        item_code: "ITM011",
        item_name: "Bluetooth Speaker",
        supplier: "JBL",
      },
      location: {
        location_id: 4,
        location_name: "Accessories Wing",
        location_code: "AW001",
      },
      quantity: 60,
      created_at: new Date("2024-03-05"),
      updated_at: new Date("2024-04-10"),
    },
    {
      stock_id: 12,
      item_id: 112,
      item: {
        item_id: 112,
        item_code: "ITM012",
        item_name: "USB Flash Drive 64GB",
        supplier: "SanDisk",
      },
      location: {
        location_id: 1,
        location_name: "Main Warehouse",
        location_code: "WH001",
      },
      quantity: 200,
      created_at: new Date("2024-03-10"),
      updated_at: new Date("2024-04-15"),
    },
  ];

  // Get unique locations and suppliers for filter options
  const uniqueLocations = useMemo(() => {
    const locations = sampleStocks.map((stock) => ({
      id: stock.location.location_id,
      name: stock.location.location_name,
      code: stock.location.location_code,
    }));
    return Array.from(new Map(locations.map((loc) => [loc.id, loc])).values());
  }, []);

  const uniqueSuppliers = useMemo(() => {
    const suppliers = sampleStocks
      .map((stock) => stock.item.supplier)
      .filter(Boolean);
    return Array.from(new Set(suppliers)).sort();
  }, []);

  // Filter and search logic
  const filteredStocks = useMemo(() => {
    return sampleStocks.filter((stock) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        stock.item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.location.location_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Location filter
      const matchesLocation =
        selectedLocation === "all" ||
        stock.location.location_id.toString() === selectedLocation;

      // Supplier filter
      const matchesSupplier =
        selectedSupplier === "all" || stock.item.supplier === selectedSupplier;

      return matchesSearch && matchesLocation && matchesSupplier;
    });
  }, [searchTerm, selectedLocation, selectedSupplier]);

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStocks = filteredStocks.slice(startIndex, endIndex);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedSupplier]);

  // Handler functions
  const handleRowClick = (stockId: number): void => {
    router.push(`/stocks/stockDetail/${stockId}`);
  };

  const handleEdit = (event: React.MouseEvent, stockId: number): void => {
    event.stopPropagation();
    console.log("Edit stock:", stockId);
    // Add your edit logic here
    // Example: router.push(`/stocks/edit/${stockId}`);
  };

  const handleDelete = (event: React.MouseEvent, stockId: number): void => {
    event.stopPropagation();
    console.log("Delete stock:", stockId);
    if (window.confirm("Are you sure you want to delete this stock entry?")) {
      console.log("Stock deleted:", stockId);
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

  // Helper function to get quantity status color
  const getQuantityStatusColor = (quantity: number): string => {
    if (quantity <= 10) return "text-red-600 bg-red-100";
    if (quantity <= 25) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  // Clear all filters
  const clearFilters = (): void => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedSupplier("all");
  };

  return (
    <div className="">
      {/* Search and Filter Controls */}
      <div className="mb-6">
        {/* Desktop and Tablet Layout */}
        <div className="hidden sm:flex gap-x-4 items-start">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/3 lg:w-1/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by item name, code, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdowns Container */}
          <div className="flex flex-col sm:flex-row gap-3 w-1/4">
            {/* Location Filter */}
            <div className="flex-1 w-full sm:min-w-[200px]">
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent className="max-w-[300px] z-50">
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id.toString()}
                    >
                      {location.name} ({location.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Supplier Filter */}
            <div className="flex-1 w-full sm:min-w-[200px]">
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by supplier" />
                </SelectTrigger>
                <SelectContent className="max-w-[300px] z-50">
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {uniqueSuppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier!}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full sm:w-auto sm:min-w-[120px] flex-shrink-0"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 gap-3 w-full">
            {/* Location Filter */}
            <div className="w-full">
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[80vw] sm:min-w-0 sm:w-auto">
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id.toString()}
                    >
                      {location.name} ({location.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Supplier Filter */}
            <div className="w-full">
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by supplier" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[80vw] sm:min-w-0 sm:w-auto">
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {uniqueSuppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier!}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {/* <div className="text-sm text-gray-600 mt-4 w-full">
          {filteredStocks.length !== sampleStocks.length && (
            <span>
              Showing {filteredStocks.length} of {sampleStocks.length} stock
              entries
              {(searchTerm ||
                selectedLocation !== "all" ||
                selectedSupplier !== "all") &&
                " (filtered)"}
            </span>
          )}
        </div> */}

        {/* Results Summary */}
        {/* <div className="text-sm text-gray-600 mt-4 w-full">
          {filteredStocks.length !== sampleStocks.length && (
            <span>
              Showing {filteredStocks.length} of {sampleStocks.length} stock
              entries
              {(searchTerm ||
                selectedLocation !== "all" ||
                selectedSupplier !== "all") &&
                " (filtered)"}
            </span>
          )}
        </div> */}

        {/* Results Summary */}
        {/* <div className="text-sm text-gray-600 mt-4">
          {filteredStocks.length !== sampleStocks.length && (
            <span>
              Showing {filteredStocks.length} of {sampleStocks.length} stock
              entries
              {(searchTerm ||
                selectedLocation !== "all" ||
                selectedSupplier !== "all") &&
                " (filtered)"}
            </span>
          )}
        </div> */}
      </div>

      {/* Desktop View (xl and above) - Full Table */}
      <div className="hidden xl:block">
        <TableComponent>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold w-1/8">Item Code</TableHead>
              <TableHead className="font-bold w-2/8">Item Name</TableHead>
              <TableHead className="font-bold w-1/8">Supplier</TableHead>
              <TableHead className="font-bold w-1/8">Location</TableHead>
              <TableHead className="font-bold w-1/8">Quantity</TableHead>
              <TableHead className="font-bold w-1/8">Last Updated</TableHead>
              <TableHead className="text-right font-bold w-1/8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStocks.map((stock) => (
              <TableRow
                key={stock.stock_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(stock.stock_id)}
              >
                <TableCell className="font-mono font-medium">
                  {stock.item.item_code}
                </TableCell>
                <TableCell className="font-medium">
                  {stock.item.item_name}
                </TableCell>
                <TableCell className="text-sm">{stock.item.supplier}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {stock.location.location_name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {stock.location.location_code}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getQuantityStatusColor(
                      stock.quantity
                    )}`}
                  >
                    {stock.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {stock.updated_at.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleEdit(e, stock.stock_id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, stock.stock_id)}
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
              <TableHead className="font-bold">Item Information</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStocks.map((stock) => (
              <TableRow
                key={stock.stock_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(stock.stock_id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{stock.item.item_name}</div>
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      Code: {stock.item.item_code}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Supplier: {stock.item.supplier}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {stock.location.location_name}
                    </div>
                    <div className="text-xs font-mono text-gray-500">
                      {stock.location.location_code}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getQuantityStatusColor(
                      stock.quantity
                    )}`}
                  >
                    {stock.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => handleEdit(e, stock.stock_id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => handleDelete(e, stock.stock_id)}
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
        {currentStocks.map((stock) => (
          <div
            key={stock.stock_id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => handleRowClick(stock.stock_id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{stock.item.item_name}</h3>
                <p className="text-sm font-mono text-gray-500">
                  {stock.item.item_code}
                </p>
                <p className="text-sm text-gray-600">
                  Supplier: {stock.item.supplier}
                </p>
              </div>
              <div className="flex gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => handleEdit(e, stock.stock_id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDelete(e, stock.stock_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Location:</span>
                <div className="text-right">
                  <div className="font-medium">
                    {stock.location.location_name}
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    {stock.location.location_code}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getQuantityStatusColor(
                    stock.quantity
                  )}`}
                >
                  {stock.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm text-gray-500">
                  {stock.updated_at.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredStocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No stock entries found matching your search criteria.</p>
          <Button variant="outline" onClick={clearFilters} className="mt-2">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredStocks.length)} of{" "}
            {filteredStocks.length} stock entries
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
