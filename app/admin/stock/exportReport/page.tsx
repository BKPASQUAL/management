"use client";

import React, { useState, useMemo } from "react";
import { FileText, Download, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStocksQuery } from "@/store/services/stock";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// Stock interface matching your API response
interface Stock {
  stock_id: number;
  quantity: number;
  updated_at: string;
  item: {
    item_code: string;
    item_name: string;
    supplier: {
      supplier_id: number;
      supplier_name: string;
    };
  };
  location: {
    location_id: number;
    location_code: string;
    location_name: string;
  };
}

export default function ExportReportPage() {
  // State for filters
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch stocks data from API
  const { data: stocksResponse, error, isLoading } = useGetStocksQuery();
  const stocks = stocksResponse?.data || [];

  // Get unique locations and suppliers for filter options
  const uniqueLocations = useMemo(() => {
    const locations = stocks.map((stock) => ({
      id: stock.location.location_id,
      name: stock.location.location_name,
      code: stock.location.location_code,
    }));
    return Array.from(new Map(locations.map((loc) => [loc.id, loc])).values());
  }, [stocks]);

  const uniqueSuppliers = useMemo(() => {
    const suppliers = stocks
      .map((stock) => stock.item.supplier.supplier_name)
      .filter(Boolean);
    return Array.from(new Set(suppliers)).sort();
  }, [stocks]);

  // Filter logic
  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchesSearch =
        searchTerm === "" ||
        stock.item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.item.item_code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "all" ||
        stock.location.location_id.toString() === selectedLocation;

      const matchesSupplier =
        selectedSupplier === "all" ||
        stock.item.supplier.supplier_name === selectedSupplier;

      return matchesSearch && matchesLocation && matchesSupplier;
    });
  }, [stocks, searchTerm, selectedLocation, selectedSupplier]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedSupplier("all");
  };

  // Get filter summary
  const getFilterSummary = () => {
    const filters = [];
    if (selectedLocation !== "all") {
      const location = uniqueLocations.find(
        (loc) => loc.id.toString() === selectedLocation
      );
      filters.push(`Location: ${location?.name}`);
    }
    if (selectedSupplier !== "all") {
      filters.push(`Supplier: ${selectedSupplier}`);
    }
    if (searchTerm) {
      filters.push(`Search: "${searchTerm}"`);
    }
    return filters.length > 0 ? filters.join(", ") : "All items";
  };

  // Export to PDF using dynamic import
  // Export to PDF using dynamic import
  const exportToPDF = async () => {
    try {
      // Dynamic import jsPDF and autoTable
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text("Stock Report", 14, 22);

      // Filter info
      doc.setFontSize(12);
      const filterText = `Filters Applied: ${getFilterSummary()}`;
      const totalText = `Total Items: ${filteredStocks.length}`;
      const dateText = `Generated on: ${new Date().toLocaleString()}`;

      doc.text(filterText, 14, 35);
      doc.text(totalText, 14, 45);
      doc.text(dateText, 14, 55);

      // Table
      autoTable(doc, {
        startY: 65,
        head: [["Item Code", "Item Name", "Supplier", "Location", "Quantity"]],
        body: filteredStocks.map((stock) => [
          stock.item.item_code,
          stock.item.item_name,
          stock.item.supplier.supplier_name,
          `${stock.location.location_name} (${stock.location.location_code})`,
          stock.quantity.toString(),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 85, 105] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
          3: { cellWidth: 45 },
          4: { cellWidth: 20 },
        },
      });

      // Save PDF
      doc.save(`stock_report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheetData = filteredStocks.map((stock) => ({
      "Item Code": stock.item.item_code,
      "Item Name": stock.item.item_name,
      Supplier: stock.item.supplier.supplier_name,
      Location: stock.location.location_name,
      "Location Code": stock.location.location_code,
      Quantity: stock.quantity,
      "Last Updated": new Date(stock.updated_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Item Code
      { wch: 30 }, // Item Name
      { wch: 20 }, // Supplier
      { wch: 20 }, // Location
      { wch: 15 }, // Location Code
      { wch: 10 }, // Quantity
      { wch: 15 }, // Last Updated
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");
    XLSX.writeFile(
      workbook,
      `stock_report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading stocks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600">
          Error loading stocks. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Export Stock Report
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Filter and export your stock data as PDF or Excel
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Search Items
              </label>
              <Input
                type="text"
                placeholder="Search by item name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  Supplier
                </label>
                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {uniqueSuppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredStocks.length}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredStocks.reduce((sum, stock) => sum + stock.quantity, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Quantity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {
                  new Set(
                    filteredStocks.map((stock) => stock.location.location_id)
                  ).size
                }
              </div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <p className="text-sm text-gray-600">
            Current filter: {getFilterSummary()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={exportToPDF}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              disabled={filteredStocks.length === 0}
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button
              onClick={exportToExcel}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={filteredStocks.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Preview ({filteredStocks.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStocks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TableComponent>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.slice(0, 10).map((stock) => (
                    <TableRow key={stock.stock_id}>
                      <TableCell className="font-mono">
                        {stock.item.item_code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {stock.item.item_name}
                      </TableCell>
                      <TableCell>{stock.item.supplier.supplier_name}</TableCell>
                      <TableCell>
                        {stock.location.location_name} (
                        {stock.location.location_code})
                      </TableCell>
                      <TableCell className="text-right">
                        {stock.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableComponent>
              {filteredStocks.length > 10 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing first 10 items. Export will include all{" "}
                  {filteredStocks.length} filtered items.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
