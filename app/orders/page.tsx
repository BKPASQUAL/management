"use client";

import OrederCards from "@/components/orders/OrederCards";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrdersTable from "@/components/orders/OrdersTable";

export default function page() {
  const [selectedRepresentative, setSelectedRepresentative] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Sample data - replace with your actual data
  const representatives = [
    { id: "rep1", name: "John Smith" },
    { id: "rep2", name: "Sarah Johnson" },
    { id: "rep3", name: "Mike Chen" },
    { id: "rep4", name: "Emily Davis" },
    { id: "rep5", name: "David Wilson" },
  ];

  const areas = [
    { id: "area1", name: "North Region" },
    { id: "area2", name: "South Region" },
    { id: "area3", name: "East Region" },
    { id: "area4", name: "West Region" },
    { id: "area5", name: "Central Region" },
  ];

  return (
    <div>
      <div className="mb-2 sm:mb-4">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Order Management
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Efficiently manage and track customers
        </p>
      </div>

      {/* Dropdown Section */}
      <div className="mb-4 sm:mb-6 w-1/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Shade CN Representative Select */}
          <div className="space-y-2">
            {/* <label className="text-sm font-medium text-gray-700">
              Representative
            </label> */}
            <Select
              value={selectedRepresentative}
              onValueChange={setSelectedRepresentative}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select representative" />
              </SelectTrigger>
              <SelectContent>
                {representatives.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Select */}
          <div className="space-y-2">
            {/* <label className="text-sm font-medium text-gray-700">
              Area Select
            </label> */}
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <OrederCards />
      <div className="mt-4 border p-4 rounded-lg">
        <OrdersTable />
      </div>
    </div>
  );
}
