"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MoreVertical,
  Trash2,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
  OrderStatus,
} from "@/store/services/orderApi";
import { useToast } from "@/hooks/use-toast";

export default function PendingOrdersPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRepresentative, setSelectedRepresentative] =
    useState<string>("all");
  const { toast } = useToast();

  // Fetch pending orders
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery({
    order_status: OrderStatus.PENDING,
  });

  const orders = ordersResponse?.data || [];

  // Filter to ensure only pending orders are shown (additional safeguard)
  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.order_status.toLowerCase() === "pending"
    );
  }, [orders]);

  // Mutations
  const [cancelOrder] = useCancelOrderMutation();

  // Get unique representatives for filter
  const uniqueRepresentatives = useMemo(() => {
    const reps = pendingOrders
      .map((order) => ({
        id: order.created_by.user_id,
        name: order.created_by.username,
      }))
      .filter(Boolean);
    return Array.from(new Map(reps.map((rep) => [rep.id, rep])).values());
  }, [pendingOrders]);

  // Filter orders based on search and representative
  const filteredOrders = useMemo(() => {
    return pendingOrders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer.shopName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRepresentative =
        selectedRepresentative === "all" ||
        order.created_by.user_id.toString() === selectedRepresentative;

      return matchesSearch && matchesRepresentative;
    });
  }, [pendingOrders, searchTerm, selectedRepresentative]);

  // Action handlers
  const handleConfirmOrder = async (orderId: number, invoiceNo: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
        }customer-bills/${orderId}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to confirm order");
      }

      toast({
        title: "Success",
        description: `Order ${invoiceNo} confirmed successfully`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to confirm order",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async (orderId: number, invoiceNo: string) => {
    try {
      await cancelOrder({
        id: orderId,
        notes: "Order cancelled by admin",
      }).unwrap();
      toast({
        title: "Success",
        description: `Order ${invoiceNo} cancelled successfully`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: number, invoiceNo: string) => {
    if (!confirm(`Are you sure you want to delete order ${invoiceNo}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/"
        }customer-bills/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete order");
      }

      toast({
        title: "Success",
        description: `Order ${invoiceNo} deleted successfully`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg">Loading pending orders...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600">
          Error loading orders. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-4 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
            Pending Orders
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Review and manage pending customer orders
          </p>
        </div>

        {/* Results Count - Desktop */}
        <div className="hidden lg:block border p-3 rounded-lg text-sm">
          Showing {filteredOrders.length} of {pendingOrders.length} orders
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-lg p-2 sm:p-4 mt-4">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by invoice, customer, or shop name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Representative Filter */}
            <div className="w-full sm:w-64">
              <Select
                value={selectedRepresentative}
                onValueChange={setSelectedRepresentative}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by representative" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Representatives</SelectItem>
                  {uniqueRepresentatives.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id.toString()}>
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count - Mobile */}
          <div className="mt-4 lg:hidden">
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {pendingOrders.length} orders
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Shop Name</TableHead>
                <TableHead>Representative</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.bill_id}>
                    <TableCell className="font-medium">
                      {order.invoice_no}
                    </TableCell>
                    <TableCell>{order.customer.customerName}</TableCell>
                    <TableCell>{order.customer.shopName}</TableCell>
                    <TableCell>{order.created_by.username}</TableCell>
                    <TableCell>{order.total_items}</TableCell>
                    <TableCell>
                      Rs. {parseFloat(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {order.order_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleConfirmOrder(
                                order.bill_id,
                                order.invoice_no
                              )
                            }
                            className="cursor-pointer"
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span>Confirm Order</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleCancelOrder(order.bill_id, order.invoice_no)
                            }
                            className="cursor-pointer"
                          >
                            <XCircle className="mr-2 h-4 w-4 text-orange-600" />
                            <span>Cancel Order</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteOrder(order.bill_id, order.invoice_no)
                            }
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Order</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm || selectedRepresentative !== "all"
                        ? "No orders found matching your filters"
                        : "No pending orders"}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
