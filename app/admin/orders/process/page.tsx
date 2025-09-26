"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Clock, Edit, Eye, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Utility function for conditional class names with proper TypeScript types
const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// TypeScript interface for items
interface OrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  description: string;
  packType: string;
  unitQuantity: number;
  unitType: string;
  unitPrice: number;
  totalPrice: number;
  image: string | null;
  checked: boolean;
}

// Sample item data with checkbox state
const initialItems: OrderItem[] = [
  {
    id: "1",
    itemCode: "ITM-001",
    itemName: "Premium Steel Pipes",
    description: "High quality steel pipes for construction",
    packType: "Bundle",
    unitQuantity: 50,
    unitType: "Pieces",
    unitPrice: 125.5,
    totalPrice: 6275.0,
    image: null,
    checked: false,
  },
  {
    id: "2",
    itemCode: "ITM-002",
    itemName: "Cement Bags",
    description: "Portland cement 50kg bags",
    packType: "Bag",
    unitQuantity: 100,
    unitType: "Bags",
    unitPrice: 8.75,
    totalPrice: 875.0,
    image: null,
    checked: false,
  },
  {
    id: "3",
    itemCode: "ITM-003",
    itemName: "Wire Mesh Sheets",
    description: "Galvanized wire mesh for reinforcement",
    packType: "Sheet",
    unitQuantity: 25,
    unitType: "Sheets",
    unitPrice: 45.2,
    totalPrice: 1130.0,
    image: null,
    checked: false,
  },
];

// TypeScript interface for Checkbox props
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
  [key: string]: any;
}

// Custom Checkbox Component with black styling
export default function CompactOrderProcessing() {
  const [items, setItems] = useState<OrderItem[]>(initialItems);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  const getStockStatus = (quantity: number): string => {
    if (quantity <= 10) return "text-red-600 bg-red-100";
    if (quantity <= 30) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  // Handle individual item checkbox change
  const handleItemCheck = (itemId: string): void => {
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
  const handleSelectAll = (): void => {
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
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">Champika Hardware</h1>
          <p>Galle</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
          <div className="text-right">
            <p className="text-lg text-gray-500">Order Number</p>
            <p className="font-mono font-bold text-lg">ORD-2024-001234</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Order Items</h3>
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
                      {checkedCount} of {totalCount} selected
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden xl:block">
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
                      <TableHead className="w-[8%] font-bold">Image</TableHead>
                      <TableHead className="w-[12%] font-bold">
                        Item Code
                      </TableHead>
                      <TableHead className="w-[20%] font-bold">
                        Item Name
                      </TableHead>
                      <TableHead className="w-[12%] font-bold">
                        Pack Type
                      </TableHead>
                      <TableHead className="w-[10%] font-bold text-center">
                        Quantity
                      </TableHead>
                      <TableHead className="w-[12%] font-bold text-right">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[12%] font-bold text-right">
                        Total
                      </TableHead>
                      <TableHead className="w-[8%] font-bold text-right">
                        Actions
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
                          item.checked && "bg-gray-50/80"
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
                              aria-label={`Select ${item.itemName}`}
                              className="h-6 w-6 pointer-events-none"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {item.itemCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">
                              {item.itemName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {item.packType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                              item.unitQuantity
                            )}`}
                          >
                            {item.unitQuantity} {item.unitType}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile/Tablet Cards - Checking Process Style */}
              <div className="xl:hidden p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "border rounded-lg p-4 shadow-sm transition-all duration-200",
                      item.checked
                        ? "bg-gray-50/80 border-gray-300 shadow-md"
                        : "bg-white hover:shadow-md"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {/* Checkbox */}
                      <div
                        className="flex-shrink-0 mt-1 p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => handleItemCheck(item.id)}
                      >
                        <Checkbox
                          checked={item.checked}
                          aria-label={`Select ${item.itemName}`}
                          className="h-5 w-5 pointer-events-none"
                        />
                      </div>

                      {/* Image */}
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm pr-2">
                            {item.itemName}
                          </h4>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs bg-gray-50 flex-shrink-0"
                          >
                            {item.itemCode}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.packType}
                              </Badge>
                            </div>
                            <div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                                  item.unitQuantity
                                )}`}
                              >
                                {item.unitQuantity} {item.unitType}
                              </span>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="text-xs text-gray-500">
                              Unit: {formatCurrency(item.unitPrice)}
                            </div>
                            <div className="font-bold text-emerald-600">
                              {formatCurrency(item.totalPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table Summary */}
              <div className="p-4 border-t bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-600">
                      Total Items:{" "}
                      <span className="font-bold text-gray-900">
                        {items.length}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Selected:{" "}
                      <span className="font-bold text-gray-900">
                        {checkedCount}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Total Qty:{" "}
                      <span className="font-bold text-gray-900">
                        {items.reduce(
                          (sum, item) => sum + item.unitQuantity,
                          0
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {formatCurrency(
                        items.reduce((sum, item) => sum + item.totalPrice, 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="xl:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Package className="h-3 w-3 text-emerald-600" />
                </div>
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">Rs. 8,280.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold">Rs. 828.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">Rs. 150.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-600">Rs. 9,258.00</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Items:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      checkedCount === totalCount && checkedCount > 0
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    )}
                  >
                    {checkedCount} / {totalCount}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <Badge variant="outline" className="text-xs">
                    Credit
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="text-xs bg-emerald-50 text-emerald-700">
                    Paid
                  </Badge>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full"
                  size="sm"
                  disabled={checkedCount === 0}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Process Selected ({checkedCount})
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Order
                </Button>
                {checkedCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                    size="sm"
                    onClick={() => {
                      setItems(
                        items.map((item) => ({ ...item, checked: false }))
                      );
                      setSelectAll(false);
                    }}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
