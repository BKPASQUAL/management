"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Clock,
  Eye,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  PackageCheck,
  ClipboardCheck,
} from "lucide-react";
import {
  useGetOrderByIdQuery,
  useMoveToProcessingMutation,
  useMoveToCheckingMutation,
  OrderStatus,
  BillStatus,
  type OrderItem,
} from "@/store/services/orderApi";
import { useToast } from "@/hooks/use-toast";

const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(" ");
};

interface ProcessOrderItem extends OrderItem {
  checked: boolean;
  processed: boolean;
}

export default function OrderProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { toast } = useToast();

  const [items, setItems] = useState<ProcessOrderItem[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const {
    data: orderResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderByIdQuery(Number(orderId), {
    skip: !orderId || isNaN(Number(orderId)),
  });

  const [moveToProcessing, { isLoading: isMovingToProcessing }] =
    useMoveToProcessingMutation();
  const [moveToChecking, { isLoading: isMovingToChecking }] =
    useMoveToCheckingMutation();

  const order = orderResponse?.data;

  React.useEffect(() => {
    if (order?.items) {
      setItems(
        order.items.map((item) => ({
          ...item,
          checked: false,
          processed: false,
        }))
      );
    }
  }, [order]);

  // Redirect if order is in CHECKING, DELIVERED, or CANCELLED status
  React.useEffect(() => {
    if (order && order.order_status === OrderStatus.CHECKING) {
      router.push(`/admin/orders/checking?orderId=${orderId}`);
    }
  }, [order, orderId, router]);

  const checkedCount = items.filter((item) => item.checked).length;
  const processedCount = items.filter((item) => item.processed).length;
  const totalCount = items.length;
  const allItemsProcessed = processedCount === totalCount && totalCount > 0;

  const formatCurrency = (amount: string | number): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `Rs. ${numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  };

  const getStockStatus = (quantity: string | number): string => {
    const qty = typeof quantity === "string" ? parseFloat(quantity) : quantity;
    if (qty <= 10) return "text-red-600 bg-red-100";
    if (qty <= 30) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<
      OrderStatus,
      { label: string; className: string }
    > = {
      [OrderStatus.PENDING]: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      [OrderStatus.PROCESSING]: {
        label: "Processing",
        className: "bg-purple-100 text-purple-800 border-purple-300",
      },
      [OrderStatus.CHECKING]: {
        label: "Checking",
        className: "bg-blue-100 text-blue-800 border-blue-300",
      },
      [OrderStatus.DELIVERED]: {
        label: "Delivered",
        className: "bg-green-100 text-green-800 border-green-300",
      },
      [OrderStatus.CONFIRMED]: {
        label: "Confirmed",
        className: "bg-teal-100 text-teal-800 border-teal-300",
      },
      [OrderStatus.CANCELLED]: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getBillStatusBadge = (status: BillStatus) => {
    const statusConfig: Record<
      BillStatus,
      { label: string; className: string }
    > = {
      [BillStatus.DRAFT]: {
        label: "Draft",
        className: "bg-gray-100 text-gray-800 border-gray-300",
      },
      [BillStatus.PAID]: {
        label: "Paid",
        className: "bg-green-100 text-green-800 border-green-300",
      },
      [BillStatus.CANCELLED]: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-300",
      },
      [BillStatus.PARTIALLY_PAID]: {
        label: "Partially Paid",
        className: "bg-orange-100 text-orange-800 border-orange-300",
      },
      [BillStatus.PENDING]: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleItemCheck = (itemId: number): void => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.bill_item_id === itemId
          ? { ...item, checked: !item.checked }
          : item
      );
      const allChecked = updatedItems.every((item) => item.checked);
      setSelectAll(allChecked);
      return updatedItems;
    });
  };

  const handleSelectAll = (): void => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: newSelectAll }))
    );
  };

  const handleClearSelection = (): void => {
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: false }))
    );
    setSelectAll(false);
  };

  const handleMoveToProcessing = async (): Promise<void> => {
    if (!orderId) return;

    try {
      setProcessingAction("processing");
      await moveToProcessing(Number(orderId)).unwrap();

      toast({
        title: "Success",
        description: "Order moved to PROCESSING status",
        variant: "default",
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleProcessSelected = (): void => {
    if (checkedCount === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item to process",
        variant: "destructive",
      });
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.checked ? { ...item, processed: true, checked: false } : item
      )
    );
    setSelectAll(false);

    toast({
      title: "Items Processed",
      description: `${checkedCount} item(s) have been marked as processed`,
      variant: "default",
    });
  };

  const handleMoveToChecking = async (): Promise<void> => {
    if (!orderId) return;

    if (!allItemsProcessed) {
      toast({
        title: "Cannot Move to Checking",
        description: "Please process all items before moving to checking stage",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingAction("checking");
      await moveToChecking(Number(orderId)).unwrap();

      toast({
        title: "Success",
        description:
          "Order moved to CHECKING status. Redirecting to checking page...",
        variant: "default",
      });

      // Navigate to the checking page after successful status update
      setTimeout(() => {
        router.push(`/admin/orders/checking?orderId=${orderId}`);
      }, 1000);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || "Failed to update status. Please try again.",
        variant: "destructive",
      });
      setProcessingAction(null);
    }
  };

  if (!orderId || isNaN(Number(orderId))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Invalid Order ID
          </h2>
          <p className="text-gray-600">Please provide a valid order ID</p>
          <Button onClick={() => router.push("/admin/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">
            Failed to Load Order
          </h2>
          <p className="text-gray-600">
            {(error as any)?.data?.message ||
              (error as any)?.message ||
              "Order not found"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/admin/orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Only show PENDING and PROCESSING orders on this page
  if (
    order.order_status !== OrderStatus.PENDING &&
    order.order_status !== OrderStatus.PROCESSING
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Redirecting...</span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:justify-between lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-xl lg:text-2xl">
            {order.customer.shopName}
          </h1>
          <p>{order.customer.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            {getOrderStatusBadge(order.order_status)}
          </Badge>
          <div className="text-right">
            <p className="text-lg text-gray-500">Order Number</p>
            <p className="font-mono font-bold text-lg">{order.invoice_no}</p>
          </div>
        </div>
      </div>

      {order.order_status === OrderStatus.PROCESSING && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900">Processing Progress</h3>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              {processedCount} / {totalCount} Items Processed
            </Badge>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(processedCount / totalCount) * 100}%` }}
            />
          </div>
          {allItemsProcessed && (
            <p className="text-sm text-blue-700 mt-2 font-medium">
              ✓ All items processed! Ready to move to checking stage.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <div className="border rounded-lg">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Order Items</h3>

                  {order.order_status === OrderStatus.PENDING && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-50 text-yellow-700"
                    >
                      Pending Review
                    </Badge>
                  )}

                  {order.order_status === OrderStatus.PROCESSING && (
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
                  )}
                </div>
              </div>

              <div className="hidden xl:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {order.order_status === OrderStatus.PROCESSING && (
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
                      )}
                      <TableHead className="w-[8%] font-bold">Image</TableHead>
                      <TableHead className="w-[12%] font-bold">
                        Item Code
                      </TableHead>
                      <TableHead className="w-[22%] font-bold">
                        Item Name
                      </TableHead>
                      <TableHead className="w-[12%] font-bold">
                        Pack Type
                      </TableHead>
                      <TableHead className="w-[12%] font-bold text-center">
                        Quantity
                      </TableHead>
                      <TableHead className="w-[6%] font-bold text-center">
                        Free Qty
                      </TableHead>
                      <TableHead className="w-[10%] font-bold text-right">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[12%] font-bold text-right">
                        Total
                      </TableHead>
                      <TableHead className="w-[8%] font-bold text-center">
                        {order.order_status === OrderStatus.PROCESSING
                          ? "Status"
                          : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow
                        key={item.bill_item_id}
                        className={cn(
                          "transition-colors group",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                          item.checked && "bg-blue-50/80",
                          item.processed && "bg-green-50/50"
                        )}
                      >
                        {order.order_status === OrderStatus.PROCESSING && (
                          <TableCell className="text-center">
                            {!item.processed ? (
                              <div
                                className="flex items-center justify-center p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemCheck(item.bill_item_id);
                                }}
                              >
                                <Checkbox
                                  checked={item.checked}
                                  aria-label={`Select ${item.item_name}`}
                                  className="h-6 w-6 pointer-events-none"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                            )}
                          </TableCell>
                        )}
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
                            {item.item_code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">
                            {item.item_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {item.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(
                              item.quantity
                            )}`}
                          >
                            {item.quantity} {item.unit_type}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {parseFloat(item.free_quantity.toString()) > 0 ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              {item.free_quantity}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          {formatCurrency(item.total_amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.processed ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              <PackageCheck className="h-3 w-3 mr-1" />
                              Processed
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 border-t bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6 text-sm flex-wrap">
                    <span className="text-gray-600">
                      Total Items:{" "}
                      <span className="font-bold text-gray-900">
                        {totalCount}
                      </span>
                    </span>
                    {order.order_status === OrderStatus.PROCESSING && (
                      <>
                        <span className="text-gray-600">
                          Processed:{" "}
                          <span className="font-bold text-green-600">
                            {processedCount}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Selected:{" "}
                          <span className="font-bold text-blue-600">
                            {checkedCount}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {formatCurrency(
                        items.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.total_amount.toString()),
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="border rounded-lg">
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
                  <span className="font-semibold">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {parseFloat(order.discount_amount.toString()) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Discount ({order.discount_percentage}%):
                    </span>
                    <span className="font-semibold">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-emerald-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <Badge variant="outline" className="text-xs">
                    {totalCount}
                  </Badge>
                </div>
                {order.order_status === OrderStatus.PROCESSING && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        allItemsProcessed
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {processedCount} / {totalCount}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <Badge variant="outline" className="text-xs">
                    {order.payment_method}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {getBillStatusBadge(order.status)}
                </div>
              </div>

              <Separator />

              <div className="pt-2 space-y-2">
                {order.order_status === OrderStatus.PENDING && (
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="sm"
                    onClick={handleMoveToProcessing}
                    disabled={isMovingToProcessing || processingAction !== null}
                  >
                    {isMovingToProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Moving to Processing...
                      </>
                    ) : (
                      <>
                        <PackageCheck className="h-4 w-4 mr-1" />
                        Move to Processing
                      </>
                    )}
                  </Button>
                )}

                {order.order_status === OrderStatus.PROCESSING && (
                  <>
                    <Button
                      className="w-full"
                      size="sm"
                      variant={checkedCount > 0 ? "default" : "outline"}
                      disabled={checkedCount === 0}
                      onClick={handleProcessSelected}
                    >
                      <PackageCheck className="h-4 w-4 mr-1" />
                      Process Selected ({checkedCount})
                    </Button>

                    {checkedCount > 0 && (
                      <Button
                        variant="outline"
                        className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        size="sm"
                        onClick={handleClearSelection}
                      >
                        Clear Selection
                      </Button>
                    )}

                    {allItemsProcessed && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        onClick={handleMoveToChecking}
                        disabled={
                          isMovingToChecking || processingAction !== null
                        }
                      >
                        {isMovingToChecking ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Moving to Checking...
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            Move to Checking
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => router.push("/admin/orders")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Orders
                </Button>
              </div>
            </CardContent>
          </div>

          {order.order_status === OrderStatus.PENDING && (
            <div className="border rounded-lg mt-4 bg-yellow-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3 text-yellow-900">
                  Pending Order
                </h4>
                <div className="space-y-2 text-xs text-yellow-800">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Review order details
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Verify items and quantities
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Click "Move to Processing" to start
                  </p>
                </div>
              </CardContent>
            </div>
          )}

          {order.order_status === OrderStatus.PROCESSING && (
            <div className="border rounded-lg mt-4 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3 text-blue-900">
                  Processing Steps
                </h4>
                <ol className="space-y-2 text-xs text-blue-800">
                  <li className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                        processedCount > 0
                          ? "bg-green-500 text-white"
                          : "bg-blue-200 text-blue-700"
                      )}
                    >
                      1
                    </span>
                    <span>Select items to process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                        processedCount > 0
                          ? "bg-green-500 text-white"
                          : "bg-blue-200 text-blue-700"
                      )}
                    >
                      2
                    </span>
                    <span>Click "Process Selected" button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                        allItemsProcessed
                          ? "bg-green-500 text-white"
                          : "bg-blue-200 text-blue-700"
                      )}
                    >
                      3
                    </span>
                    <span>Click "Move to Checking" when ready</span>
                  </li>
                </ol>
              </CardContent>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
