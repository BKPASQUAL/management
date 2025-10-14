"use client";

import React, { useState } from "react";
import { Search, Eye, Loader, Package } from "lucide-react";
import { useGetOrdersQuery, OrderStatus } from "@/store/services/orderApi";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProcessingOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRepresentative, setSelectedRepresentative] = useState("all");

  // Fetch only CONFIRMED orders
  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetOrdersQuery({
    order_status: OrderStatus.CONFIRMED,
  });

  const orders = ordersResponse?.data || [];

  // Get unique representatives
  const representatives = [
    "all",
    ...Array.from(new Set(orders.map((o) => o.created_by.username))),
  ];

  // Filter orders - only show CONFIRMED status
  const filteredOrders = orders.filter(
    (order) =>
      order.order_status === OrderStatus.CONFIRMED &&
      (selectedRepresentative === "all" ||
        order.created_by.username === selectedRepresentative) &&
      (order.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer.shopName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm font-medium">
              Failed to load orders. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-2 sm:mb-4">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Processing Orders
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Manage confirmed orders ({filteredOrders.length} orders)
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-4 sm:mb-6 w-full lg:w-1/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Representative Select */}
          <div className="space-y-2">
            <Select
              value={selectedRepresentative}
              onValueChange={setSelectedRepresentative}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select representative" />
              </SelectTrigger>
              <SelectContent>
                {representatives.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep === "all" ? "All Representatives" : rep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {filteredOrders.map((order) => (
          <Card
            key={order.bill_id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewOrder(order.bill_id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-blue-600 text-sm">
                    {order.invoice_no}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.billing_date)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-300"
                >
                  Confirmed
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium text-sm">
                    {order.customer.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.customer.customerCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Shop Name</p>
                  <p className="font-medium text-sm">
                    {order.customer.shopName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Representative</p>
                    <p className="font-medium text-sm">
                      {order.created_by.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-medium text-sm">{order.total_items}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold text-base">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewOrder(order.bill_id);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Mobile Empty State */}
        {filteredOrders.length === 0 && !isLoading && (
          <Card className="bg-gray-50">
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-2">
                No confirmed orders found
              </p>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedRepresentative !== "all"
                  ? "Try adjusting your filters"
                  : "No confirmed orders available"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border p-4 rounded-lg">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Invoice No</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Shop Name</TableHead>
                <TableHead className="font-semibold">Representative</TableHead>
                <TableHead className="font-semibold">Items</TableHead>
                <TableHead className="font-semibold">Total Amount</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.bill_id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewOrder(order.bill_id)}
                >
                  <TableCell className="font-medium text-blue-600">
                    {order.invoice_no}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.customer.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer.customerCode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.customer.shopName}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.created_by.username}</p>
                      <p className="text-sm text-gray-500">
                        {order.created_by.role}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{order.total_items}</p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>{formatDate(order.billing_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300"
                    >
                      Confirmed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrder(order.bill_id);
                      }}
                      className="h-8 w-8 p-0"
                      title="View Order Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Desktop Empty State */}
        {filteredOrders.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-b-lg mt-4">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">
              No confirmed orders found
            </p>
            <p className="text-sm text-gray-500">
              {searchTerm || selectedRepresentative !== "all"
                ? "Try adjusting your filters"
                : "No confirmed orders available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
