import CustomerCards from "@/components/customers/CustumerCards";
import CustumerBillHistroryTable from "@/components/tables/CustumerBillHistroryTable";
import { Package } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div>
      <div>
        <div className="flex flex-row gap-4 items-center mb-4">
          <Package className="w-6 h-6 sm:w-7 sm:h-7" />
          <div className="gap-1">
            <h1 className="font-bold text-xl sm:text-2xl">
              Dishan Electricals
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">Or10244</p>
          </div>
        </div>
        <CustomerCards />
        <div className="border rounded-lg p-4  mt-4">
          <h1 className="text-lg font-semibold mb-4">History</h1>
          <CustumerBillHistroryTable />
        </div>
      </div>
    </div>
  );
}
