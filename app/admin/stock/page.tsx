import StocksTable from "@/components/tables/StocksTable";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="mb-2 sm:mb-4">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Stock Management
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Efficiently manage and track customers
        </p>
      </div>
       <div className="border rounded-lg p-4  mt-4">
          {/* <h1 className="text-lg font-semibold mb-4">History</h1> */}
          <StocksTable />
        </div>
    </div>
  );
}
