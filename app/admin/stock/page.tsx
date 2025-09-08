import StocksTable from "@/components/tables/StocksTable";
import { Button } from "@/components/ui/button";
import React from "react";
import { FileText, Package, ArrowRightLeft, ClipboardList } from "lucide-react";

export default function page() {
  return (
    <div>
      {/* Header Section - Responsive flex layout */}
      <div className="mb-4 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
            Stock Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Efficiently manage and track inventory
          </p>
        </div>

        {/* Buttons - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer w-full sm:w-auto"
          >
            <FileText className="w-4 h-4" />
            <span className="sm:inline">Export Report</span>
          </Button>

          <Button
            variant="outline"
            className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="sm:inline">Transfer</span>
          </Button>

          <Button
            className=" border-blue-600  hover:bg-blue-50 text-blue-600 cursor-pointer w-full sm:w-auto justify-center"
            variant="outline"
          >
            <ClipboardList className="w-4 h-4" />
            <span className="sm:inline">Stock Audit</span>
          </Button>

          <Button
            variant="outline"
            className="border-black text-black  cursor-pointer w-full sm:w-auto justify-center"
          >
            <Package className="w-4 h-4" />
            <span className="sm:inline">Stock Balance</span>
          </Button>
        </div>
      </div>

      {/* Table Container - Responsive padding */}
      <div className="border rounded-lg p-2 sm:p-4 mt-4 overflow-x-auto">
        <StocksTable />
      </div>
    </div>
  );
}
