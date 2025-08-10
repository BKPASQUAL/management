import React from "react";
import {
  AlertTriangle,
  ClipboardList,
  Coins,
  DollarSign,
  Package,
  Tag,
} from "lucide-react";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-y-6">
        {/* Product Header */}
        <div className="flex flex-row gap-4 items-center">
          <Package className="w-7 h-7" />
          <div className="gap-1">
            <h1 className="font-bold text-2xl">Orange One Gan</h1>
            <p className="text-gray-500">Or10244</p>
          </div>
        </div>

        {/* Cards Row */}
        <div className="flex flex-row justify-between flex-wrap">
          {/* Available Stock */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Available Stock</h1>
              <ClipboardList className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex gap-2 items-end">
              <p className="text-xl font-bold">1245</p>
              <p>dz</p>
            </div>
          </div>

          {/* Total Value */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Total Value</h1>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,245,000</p>
          </div>

          {/* Damaged Items */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Damaged Items</h1>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xl font-bold">12</p>
          </div>

          {/* Cost Price */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Cost Price</h1>
              <Coins className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,200 / dz</p>
          </div>

          {/* Selling Price */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Selling Price</h1>
              <Tag className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,500 / dz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
