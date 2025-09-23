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
} from "lucide-react";

// Types
interface Order {
  id: string;
  orderNumber: string;
  customerCode: string;
  customerName: string;
  area: string;
  route: string;
  representative: string;
  phone: string;
  totalAmount: number;
  status:
    | "make_order"
    | "prepare_order"
    | "checking_order"
    | "loading"
    | "delivered";
  orderDate: string;
}

const OrdersTable: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Sample orders data - replace with your actual API data
  const sampleOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerCode: "CUST001",
      customerName: "Tech Solutions Ltd",
      area: "Colombo",
      route: "Route A1",
      representative: "John Silva",
      phone: "+94 11 2345678",
      totalAmount: 125000,
      status: "make_order",
      orderDate: "2024-01-15",
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerCode: "CUST002",
      customerName: "Digital Systems Inc",
      area: "Kandy",
      route: "Route K1",
      representative: "Mary Fernando",
      phone: "+94 81 2234567",
      totalAmount: 87500,
      status: "prepare_order",
      orderDate: "2024-01-14",
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerCode: "CUST003",
      customerName: "Smart Electronics",
      area: "Galle",
      route: "Route G1",
      representative: "David Perera",
      phone: "+94 91 2345678",
      totalAmount: 156000,
      status: "checking_order",
      orderDate: "2024-01-13",
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      customerCode: "CUST004",
      customerName: "Future Tech Corp",
      area: "Negombo",
      route: "Route N1",
      representative: "Sarah De Silva",
      phone: "+94 31 2234567",
      totalAmount: 98000,
      status: "loading",
      orderDate: "2024-01-12",
    },
    {
      id: "5",
      orderNumber: "ORD-2024-005",
      customerCode: "CUST005",
      customerName: "Innovation Hub",
      area: "Matara",
      route: "Route M1",
      representative: "John Silva",
      phone: "+94 41 2345678",
      totalAmount: 234000,
      status: "delivered",
      orderDate: "2024-01-11",
    },
    {
      id: "6",
      orderNumber: "ORD-2024-006",
      customerCode: "CUST006",
      customerName: "Prime Electronics",
      area: "Kurunegala",
      route: "Route KU1",
      representative: "Mary Fernando",
      phone: "+94 37 2234567",
      totalAmount: 67500,
      status: "make_order",
      orderDate: "2024-01-10",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(sampleOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = sampleOrders.slice(startIndex, endIndex);

  // Status badge styling
  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      make_order: { label: "Make Order", variant: "default" as const },
      prepare_order: { label: "Preparing", variant: "secondary" as const },
      checking_order: { label: "Checking", variant: "outline" as const },
      loading: { label: "Loading", variant: "secondary" as const },
      delivered: { label: "Delivered", variant: "default" as const },
    };

    const config = statusConfig[status];
    return (
      <Badge
        variant={config.variant}
        className={
          status === "delivered"
            ? "bg-green-100 text-green-800 border-green-300"
            : status === "loading"
            ? "bg-blue-100 text-blue-800 border-blue-300"
            : status === "checking_order"
            ? "bg-purple-100 text-purple-800 border-purple-300"
            : status === "prepare_order"
            ? "bg-orange-100 text-orange-800 border-orange-300"
            : "bg-gray-100 text-gray-800 border-gray-300"
        }
      >
        {config.label}
      </Badge>
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  // Handler functions
  const handleRowClick = (orderId: string): void => {
    // Navigate to order process page
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  const handleViewOrder = (event: React.MouseEvent, orderId: string): void => {
    event.stopPropagation();
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  const handleEdit = (event: React.MouseEvent, orderId: string): void => {
    event.stopPropagation();
    console.log("Edit order:", orderId);
    // Add your edit logic here
  };

  const handleDelete = (event: React.MouseEvent, orderId: string): void => {
    event.stopPropagation();
    console.log("Delete order:", orderId);
    // Add your delete logic here
    if (window.confirm("Are you sure you want to delete this order?")) {
      // Delete logic here
    }
  };

  const handleManageProcess = (
    event: React.MouseEvent,
    orderId: string
  ): void => {
    event.stopPropagation();
    router.push(`/admin/orders/process?orderId=${orderId}`);
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Order #</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Representative</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Order Date</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow
                key={order.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleRowClick(order.id)}
              >
                <TableCell className="font-medium text-blue-600">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">
                      {order.customerCode}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.area}</p>
                    <p className="text-sm text-gray-500">{order.route}</p>
                  </div>
                </TableCell>
                <TableCell>{order.representative}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
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
                        onClick={(e) => handleViewOrder(e, order.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Order
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleManageProcess(e, order.id)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Process
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleEdit(e, order.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, order.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, sampleOrders.length)} of {sampleOrders.length}{" "}
            orders
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
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
