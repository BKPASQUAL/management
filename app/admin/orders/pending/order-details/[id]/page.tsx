// app/admin/orders/pending/order-details/[id]/page.tsx
"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  DollarSign,
  FileText,
  AlertCircle,
  Calendar,
  User,
  CreditCard,
  Loader2,
} from "lucide-react";
import PendingDetailsItemtable from "@/components/orders/PendingDetailsItemtable";
import {
  useGetOrderByIdQuery,
  Order,
  OrderStatus,
  BillStatus,
} from "@/store/services/orderApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Helper function moved outside component
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Page() {
  const params = useParams();
  const orderId = Number(params.id);

  const {
    data: orderResponse,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(orderId);

  const orderData: Order | undefined = orderResponse?.data;

  // ✅ Move ALL hooks to the top, before any conditional returns
  const dueDate = useMemo(() => {
    if (!orderData?.billing_date) return "N/A";
    const billingDate = new Date(orderData.billing_date);
    billingDate.setDate(billingDate.getDate() + 30);
    return formatDate(billingDate.toISOString());
  }, [orderData]);

  const mappedItems = useMemo(() => {
    if (!orderData?.items) return [];
    return orderData.items.map((item) => ({
      id: item.bill_item_id,
      itemCode: item.item_code,
      itemName: item.item_name,
      quantity: parseFloat(item.quantity),
      unit: item.unit_type,
      unitPrice: parseFloat(item.unit_price),
      discount: parseFloat(item.discount_percentage),
      total: parseFloat(item.total_amount),
    }));
  }, [orderData]);

  const getOrderStatusBadge = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        );
      case OrderStatus.CONFIRMED:
        return (
          <Badge className="bg-teal-100 text-teal-800 border-teal-300">
            Confirmed
          </Badge>
        );
      case OrderStatus.PROCESSING:
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-300">
            Processing
          </Badge>
        );
      case OrderStatus.CHECKING:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Checking
          </Badge>
        );
      case OrderStatus.DELIVERED:
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Delivered
          </Badge>
        );
      case OrderStatus.CANCELLED:
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (paymentMethod: any) => {
    switch (paymentMethod) {
      case "cash":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "credit_card":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  // ✅ NOW conditional returns are safe - all hooks are already called
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }

  if (isError || !orderData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600">
          Error loading order details: {JSON.stringify(error)}
        </div>
      </div>
    );
  }

  // Extract customerSummary with fallback values
  const customerSummary = orderData.customerSummary || {
    dueAmount: 0,
    pendingBillsCount: 0,
    over45DaysAmount: 0,
    lastBillingDate: null,
  };

  return (
    <div className="">
      <div>
        <div></div>
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800">
          {orderData.customer.shopName}
        </h1>
        <p className="mb-3">{orderData.customer.address}</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Due Amount Card - NOW USING customerSummary.dueAmount */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Due Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(customerSummary.dueAmount)}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  OUTSTANDING
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-full">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>

          {/* Pending Bills Card - NOW USING customerSummary.pendingBillsCount */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Pending Bills
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {customerSummary.pendingBillsCount}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  AWAITING
                </p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-full">
                <FileText className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Over 45 Days Card - NOW USING customerSummary.over45DaysAmount */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Over 45 Days Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {customerSummary.over45DaysAmount > 0
                    ? formatCurrency(customerSummary.over45DaysAmount)
                    : "Rs 0"}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  {customerSummary.over45DaysAmount > 0 ? "OVERDUE" : "N/A"}
                </p>
              </div>
              <div className="bg-orange-50 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Last Billing Date Card - NOW USING customerSummary.lastBillingDate */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Last Billing Date
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {customerSummary.lastBillingDate || "N/A"}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  LAST ORDER
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3 mt-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
          {/* Invoice Number */}
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg mt-1">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Invoice Number
              </p>
              <p className="text-base font-semibold text-gray-900">
                {orderData.invoice_no}
              </p>
            </div>
          </div>

          {/* Billing Date */}
          <div className="flex items-start gap-3">
            <div className="bg-purple-50 p-2 rounded-lg mt-1">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Billing Date
              </p>
              <p className="text-base font-semibold text-gray-900">
                {formatDate(orderData.billing_date)}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded-lg mt-1">
              {getPaymentMethodIcon(orderData.payment_method)}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Payment Method
              </p>
              <p className="text-base font-semibold text-gray-900">
                {orderData.payment_method
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
          </div>

          {/* Representative Name */}
          <div className="flex items-start gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg mt-1">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Representative Name
              </p>
              <p className="text-base font-semibold text-gray-900">
                {orderData.created_by.username}
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="flex items-start gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg mt-1">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Order Status
              </p>
              {getOrderStatusBadge(orderData.order_status)}
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="bg-red-50 p-2 rounded-lg mt-1">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Due Date</p>
              <p className="text-base font-semibold text-red-600">{dueDate}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <PendingDetailsItemtable initialOrderItems={mappedItems} />
      </div>
    </div>
  );
}
