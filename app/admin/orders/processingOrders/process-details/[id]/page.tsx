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
import { Package, Clock, CheckCircle2, Edit, ArrowRight } from "lucide-react";

const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Define TypeScript interfaces
interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  freeQty: number;
  image: string | null;
  checked: boolean;
}

interface ProcessedItem extends Item {
  processedAt: string;
}

const sampleItems: Item[] = [
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
  const [items, setItems] = useState<Item[]>(sampleItems);
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleItemCheck = (itemId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      const allChecked = updatedItems.every((item) => item.checked);
      setSelectAll(allChecked);
      return updatedItems;
    });
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: newSelectAll }))
    );
  };

  const handleProcessChecked = () => {
    const checkedItems = items.filter((item) => item.checked);
    const uncheckedItems = items.filter((item) => !item.checked);

    // Add timestamp to processed items
    const itemsWithTimestamp: ProcessedItem[] = checkedItems.map((item) => ({
      ...item,
      processedAt: new Date().toLocaleString(),
      checked: false,
    }));

    setProcessedItems((prev) => [...prev, ...itemsWithTimestamp]);
    setItems(uncheckedItems);
    setSelectAll(false);
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex flex-row justify-between sm:flex-row sm:justify-between lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">Order Checking</h1>
          <p className="text-gray-600 ">Champika Hardware - Galle</p>
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

      {/* Items to Check Table */}
      <div className="border rounded-lg mb-6">
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
              </div>
            </div>
          </div>

          <div className="p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>All items have been processed!</p>
              </div>
            ) : (
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
                    <TableHead className="w-[15%] font-bold">
                      Item Code
                    </TableHead>
                    <TableHead className="w-[35%] font-bold">
                      Item Name
                    </TableHead>
                    <TableHead className="w-[16%] font-bold text-center">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[16%] font-bold text-center">
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
            )}
          </div>

          {items.length > 0 && (
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
                    onClick={handleProcessChecked}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Process Checked ({checkedCount})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Checked Items Table */}
      {processedItems.length > 0 && (
        <div className="border rounded-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-green-50/50">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                  Checked Items
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  {processedItems.length} items checked
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%] font-bold">Image</TableHead>
                    <TableHead className="w-[15%] font-bold">
                      Item Code
                    </TableHead>
                    <TableHead className="w-[30%] font-bold">
                      Item Name
                    </TableHead>
                    <TableHead className="w-[15%] font-bold text-center">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[15%] font-bold text-center">
                      Free Qty
                    </TableHead>
                    <TableHead className="w-[15%] font-bold">
                      Checked At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      )}
                    >
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
                      <TableCell className="font-medium">
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
                      <TableCell className="text-sm text-gray-600">
                        {item.processedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
}
