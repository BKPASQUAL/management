"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings,
  Loader2,
} from "lucide-react";
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
  Order,
  OrderStatus,
  BillStatus,
} from "@/store/services/orderApi";
import { useToast } from "@/hooks/use-toast";

interface OrdersTableProps {
  representativeId?: number;
  areaId?: number;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  representativeId,
  areaId,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrdersQuery({
    representative_id: representativeId,
    area_id: areaId,
    page: currentPage,
    limit: itemsPerPage,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = ordersResponse?.data || [];
  const total = ordersResponse?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const getOrderStatusBadge = (orderStatus: OrderStatus) => {
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

    const config = statusConfig[orderStatus];
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

  const handleRowClick = (orderId: number): void => {
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  const handleViewOrder = (event: React.MouseEvent, orderId: number): void => {
    event.stopPropagation();
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  const handleEdit = (event: React.MouseEvent, orderId: number): void => {
    event.stopPropagation();
    router.push(`/admin/orders/edit/${orderId}`);
  };

  const handleDelete = async (
    event: React.MouseEvent,
    orderId: number
  ): Promise<void> => {
    event.stopPropagation();

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder({
          id: orderId,
          notes: "Cancelled by admin",
        }).unwrap();

        toast({
          title: "Success",
          description: "Order cancelled successfully",
          variant: "default",
        });

        refetch();
      } catch (err: any) {
        toast({
          title: "Error",
          description:
            err?.data?.message || "Failed to cancel order. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleManageProcess = (
    event: React.MouseEvent,
    orderId: number
  ): void => {
    event.stopPropagation();
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800 font-medium mb-2">Failed to load orders</p>
        <p className="text-sm text-red-600 mb-4">
          {(error as any)?.data?.message || "An error occurred"}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-600 font-medium mb-2">No orders found</p>
        <p className="text-sm text-gray-500">
          Orders will appear here once they are created
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Invoice No</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Representative</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Order Status</TableHead>
              <TableHead className="font-semibold">Payment Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow
                key={order.bill_id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(order.bill_id)}
              >
                <TableCell className="font-medium text-blue-600">
                  {order.invoice_no}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer.shopName}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer.customerCode}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{order.customer.address}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.created_by.username}</p>
                    <p className="text-sm text-gray-500">
                      {order.created_by.role}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(order.total_amount)}
                </TableCell>
                <TableCell>{getOrderStatusBadge(order.order_status)}</TableCell>
                <TableCell>{getBillStatusBadge(order.status)}</TableCell>
                <TableCell>{formatDate(order.billing_date)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleViewOrder(e, order.bill_id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleManageProcess(e, order.bill_id)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Process
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleEdit(e, order.bill_id)}
                        disabled={order.order_status === OrderStatus.CANCELLED}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, order.bill_id)}
                        className="text-red-600"
                        disabled={
                          order.order_status === OrderStatus.CANCELLED ||
                          order.order_status === OrderStatus.DELIVERED ||
                          isCancelling
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, total)} of {total} orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
