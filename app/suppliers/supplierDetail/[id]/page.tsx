import {
  AlertTriangle,
  Calendar,
  DollarSign,
  X,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div>
      <h1>Orange</h1>
      {/* Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Last 90 Days Bills */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Last 90 Days Bills
            </h1>
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
          </div>
          <div className="flex gap-2 items-end">
            <p className="text-xl font-bold">Rs. 2,450,000</p>
          </div>
        </div>

        {/* Outstanding Bills */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Outstanding Bills
            </h1>
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-xl font-bold">Rs. 845,000</p>
        </div>

        {/* Total Stock Value */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Total Stock Value
            </h1>
            <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-xl font-bold">Rs. 1,245,000</p>
        </div>

        {/* Damage Item Value */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Damage Item Value
            </h1>
            <X className="w-4 h-4 text-red-500 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-red-600">
            Rs. 18,000
          </p>
        </div>

        {/* Total Credit in Market */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Total Credit in Market
            </h1>
            <CreditCard className="w-4 h-4 text-orange-500 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-xl font-bold">Rs. 3,250,000</p>
        </div>

        {/* Financial Impact */}
        <div className="border p-4 rounded-lg h-28 flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="font-semibold text-gray-600 text-sm">
              Financial Impact (last 30 days)
            </h1>
            <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-600">
            +Rs. 450,000
          </p>
        </div>
      </div>
    </div>
  );
}
