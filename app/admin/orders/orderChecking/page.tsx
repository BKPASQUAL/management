"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Clock, CheckCircle2, Edit } from "lucide-react";
// Utility function for conditional class names
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Sample items data for order checking
const sampleItems = [
  {
    id: "1",
    itemCode: "ITM-001",
    itemName: "Premium Steel Pipes",
    quantity: 50,
    freeQty: 5,
    image: null,
    checked: false,
  },
  {
    id: "2",
    itemCode: "ITM-002",
    itemName: "Cement Bags",
    quantity: 100,
    freeQty: 10,
    image: null,
    checked: false,
  },
  {
    id: "3",
    itemCode: "ITM-003",
    itemName: "Wire Mesh Sheets",
    quantity: 25,
    freeQty: 2,
    image: null,
    checked: false,
  },
  {
    id: "4",
    itemCode: "ITM-004",
    itemName: "Construction Nails",
    quantity: 200,
    freeQty: 0,
    image: null,
    checked: false,
  },
  {
    id: "5",
    itemCode: "ITM-005",
    itemName: "Paint Brushes",
    quantity: 15,
    freeQty: 3,
    image: null,
    checked: false,
  },
];

export default function OrderChecking() {
  const [items, setItems] = useState(sampleItems);
  const [selectAll, setSelectAll] = useState(false);

  // Handle individual item checkbox change
  const handleItemCheck = (itemId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );

      // Update select all state
      const allChecked = updatedItems.every((item) => item.checked);
      setSelectAll(allChecked);

      return updatedItems;
    });
  };

  // Handle select all checkbox change
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: newSelectAll }))
    );
  };

  // Get checked items count
  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex flex-row justify-between sm:flex-row sm:justify-between lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">Order Checking</h1>
          <p className="text-gray-600">Champika Hardware - Galle</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
            <Clock className="h-3 w-3 mr-1" />
            Checking Order
          </Badge>
          <div className="text-right">
            <p className="text-lg text-gray-500">Order Number</p>
            <p className="font-mono font-bold text-lg">ORD-2024-001234</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-gray-50/50">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Items to Check</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "bg-blue-50 text-blue-700",
                    checkedCount === totalCount &&
                      checkedCount > 0 &&
                      "bg-green-50 text-green-700"
                  )}
                >
                  {checkedCount} of {totalCount} checked
                </Badge>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[8%] font-bold">
                    <div
                      className="flex items-center justify-center p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95 select-none"
                      onClick={handleSelectAll}
                    >
                      <Checkbox
                        checked={selectAll}
                        aria-label="Select all items"
                        className="h-6 w-6 pointer-events-none"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[10%] font-bold">Image</TableHead>
                  <TableHead className="w-[15%] font-bold">Item Code</TableHead>
                  <TableHead className="w-[50%] font-bold">Item Name</TableHead>
                  <TableHead className="w-[20%] font-bold text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="w-[20%] font-bold text-center">
                    Free Qty
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      "transition-colors group",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                      item.checked && "bg-blue-50/50"
                    )}
                  >
                    <TableCell className="text-center">
                      <div
                        className="flex items-center justify-center p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemCheck(item.id);
                        }}
                      >
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => handleItemCheck(item.id)}
                          aria-label={`Select ${item.itemName}`}
                        className="h-6 w-6 pointer-events-none"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono text-xs bg-gray-50"
                      >
                        {item.itemCode}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleItemCheck(item.id)}
                    >
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.freeQty > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {item.freeQty}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          0
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {checkedCount === totalCount && totalCount > 0 ? (
                  <span className="text-green-600 font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    All items checked
                  </span>
                ) : (
                  <span>
                    {checkedCount} of {totalCount} items checked
                  </span>
                )}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectAll(false);
                    setItems((prevItems) =>
                      prevItems.map((item) => ({ ...item, checked: false }))
                    );
                  }}
                >
                  Reset Checks
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  disabled={checkedCount === 0}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Complete Check ({checkedCount})
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
