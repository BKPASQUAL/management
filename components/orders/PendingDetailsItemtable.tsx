// components/orders/PendingDetailsItemtable.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Edit,
  Trash2,
  Check,
  X,
  Pencil,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Order, useConfirmOrderMutation } from "@/store/services/orderApi";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  total: number;
}

interface PendingDetailsItemtableProps {
  initialOrderItems: OrderItem[];
  orderData: Order;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  icon: React.ReactNode;
  confirmText: string;
  cancelText: string;
  confirmColor: "green" | "red";
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  isOpen,
  title,
  message,
  icon,
  confirmText,
  cancelText,
  confirmColor,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const confirmColorClasses =
    confirmColor === "green"
      ? "bg-green-600 hover:bg-green-700 text-white"
      : "bg-red-600 hover:bg-red-700 text-white";

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                confirmColor === "green" ? "bg-green-100" : "bg-red-100"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6",
                  confirmColor === "green" ? "text-green-600" : "text-red-600"
                )}
              >
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 font-medium"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(confirmColorClasses, "px-4 py-2 font-medium")}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PendingDetailsItemtable: React.FC<PendingDetailsItemtableProps> = ({
  initialOrderItems,
  orderData,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    quantity: number;
    unitPrice: number;
    discount: number;
  }>({
    quantity: 0,
    unitPrice: 0,
    discount: 0,
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const router = useRouter();

  // Modal states
  const [confirmOrderModal, setConfirmOrderModal] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // State for summary values
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(
    parseFloat(orderData.discount_percentage)
  );
  const [tempDiscountPercentage, setTempDiscountPercentage] =
    useState(discountPercentage);

  // Calculate subtotal from order items
  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return sum + itemSubtotal;
    }, 0);
  };

  // Calculate values based on current state
  const subtotal = calculateSubtotal();
  const totalDiscount = (subtotal * discountPercentage) / 100;
  const grandTotal = subtotal - totalDiscount;
  const [confirmOrder, { isLoading }] = useConfirmOrderMutation();

  const handleConfirmOrder = async () => {
    setModalLoading(true);

    if (!orderData.bill_id) {
      console.error("Order ID is missing from orderData.");
      alert("❌ Failed to confirm order: Order ID not found.");
      setModalLoading(false);
      return;
    }

    try {
      const orderId = orderData.bill_id;
      await confirmOrder(orderId).unwrap();

      console.log(`✅ Order ${orderId} confirmed successfully!`);

      // Close modal and navigate
      setConfirmOrderModal(false);
      router.push("/admin/orders/pending");
    } catch (error) {
      console.error("Confirm order failed:", error);
      alert("❌ Failed to confirm order");
      setModalLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setModalLoading(true);

    // Simulate cancel order API call
    try {
      // Replace this with your actual cancel order API call
      // await cancelOrder(orderData.bill_id).unwrap();

      console.log(`✅ Order ${orderData.bill_id} cancelled successfully!`);

      // Close modal and navigate
      setCancelOrderModal(false);
      router.push("/admin/orders/pending");
    } catch (error) {
      console.error("Cancel order failed:", error);
      alert("❌ Failed to cancel order");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditItem = (item: OrderItem) => {
    setEditingItemId(item.id);
    setEditValues({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
    });
  };

  const handleSaveEdit = () => {
    if (editingItemId !== null) {
      setOrderItems(
        orderItems.map((item) => {
          if (item.id === editingItemId) {
            const newTotal =
              editValues.quantity *
              editValues.unitPrice *
              (1 - editValues.discount / 100);
            return {
              ...item,
              quantity: editValues.quantity,
              unitPrice: editValues.unitPrice,
              discount: editValues.discount,
              total: newTotal,
            };
          }
          return item;
        })
      );
      setEditingItemId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleDeleteItem = (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setOrderItems(orderItems.filter((item) => item.id !== itemId));
    }
  };

  // Handlers for discount editing
  const handleEditDiscount = () => {
    setIsEditingDiscount(true);
    setTempDiscountPercentage(discountPercentage);
  };

  const handleSaveDiscount = () => {
    setDiscountPercentage(tempDiscountPercentage);
    setIsEditingDiscount(false);
  };

  const handleCancelDiscount = () => {
    setTempDiscountPercentage(discountPercentage);
    setIsEditingDiscount(false);
  };

  const renderActions = (item: OrderItem) => (
    <div className="flex items-center justify-center gap-2">
      {editingItemId === item.id ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-green-50 hover:border-green-300"
            onClick={handleSaveEdit}
          >
            <Check className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100 hover:border-gray-300"
            onClick={handleCancelEdit}
          >
            <X className="h-3 w-3 text-gray-600" />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => handleEditItem(item)}
          >
            <Edit className="h-3 w-3 text-blue-600" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-300"
            onClick={() => handleDeleteItem(item.id)}
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmOrderModal}
        title="Confirm Order"
        message={`Are you sure you want to confirm this order? The total amount is Rs ${grandTotal
          .toFixed(2)
          .toLocaleString()}.`}
        icon={<CheckCircle className="w-6 h-6" />}
        confirmText="Yes, Confirm"
        cancelText="No, Cancel"
        confirmColor="green"
        isLoading={modalLoading}
        onConfirm={handleConfirmOrder}
        onCancel={() => setConfirmOrderModal(false)}
      />

      <ConfirmationModal
        isOpen={cancelOrderModal}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        icon={<AlertCircle className="w-6 h-6" />}
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep It"
        confirmColor="red"
        isLoading={modalLoading}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelOrderModal(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section - Left Side (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-black" />
                  <h2 className="font-bold text-lg text-black">Order Items</h2>
                </div>
                <Badge variant="secondary" className="text-sm text-black">
                  {orderItems.length} items
                </Badge>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[8%] font-bold text-black">
                      Image
                    </TableHead>
                    <TableHead className="w-[15%] font-bold text-black">
                      Item Code
                    </TableHead>
                    <TableHead className="w-[20%] font-bold text-black">
                      Item Name
                    </TableHead>
                    <TableHead className="w-[12%] font-bold text-center text-black">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[12%] font-bold text-right text-black">
                      Unit Price
                    </TableHead>
                    <TableHead className="w-[10%] font-bold text-right text-black">
                      Discount
                    </TableHead>
                    <TableHead className="w-[13%] font-bold text-right text-black">
                      Total
                    </TableHead>
                    <TableHead className="w-[10%] font-bold text-center text-black">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                        editingItemId === item.id && "bg-blue-50/50"
                      )}
                    >
                      <TableCell>
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs text-black"
                        >
                          {item.itemCode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm text-black">
                          {item.itemName}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-center">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.quantity}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="w-20 h-7 text-right text-sm px-2 text-black"
                              min="0"
                            />
                          ) : (
                            <span className="font-bold text-sm text-black text-right">
                              {item.quantity} {item.unit}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.unitPrice}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  unitPrice: Number(e.target.value),
                                })
                              }
                              className="w-28 h-7 text-right text-sm px-2 text-black"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <span className="font-semibold text-black">
                              Rs {item.unitPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.discount}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  discount: Number(e.target.value),
                                })
                              }
                              className="w-16 h-7 text-right text-sm px-2 text-black"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          ) : item.discount > 0 ? (
                            <span className="text-black font-medium text-sm">
                              {item.discount}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-black">
                        Rs {item.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderActions(item)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="block lg:hidden p-4 space-y-4">
              {orderItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base">
                            {item.itemName}
                          </h3>
                          <p className="font-mono text-xs text-gray-500">
                            {item.itemCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">{renderActions(item)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Quantity:</span>
                        <div className="font-bold text-sm">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.quantity}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  quantity: Number(e.target.value),
                                })
                              }
                              className="w-20 h-7 text-sm px-2 mt-1"
                              min="0"
                            />
                          ) : (
                            <span>
                              {item.quantity} {item.unit}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600">Unit Price:</span>
                        <div className="font-semibold text-sm">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.unitPrice}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  unitPrice: Number(e.target.value),
                                })
                              }
                              className="w-24 h-7 text-sm px-2 mt-1 ml-auto"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <span>Rs {item.unitPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Discount:</span>
                        <div className="font-medium text-sm">
                          {editingItemId === item.id ? (
                            <Input
                              type="number"
                              value={editValues.discount}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  discount: Number(e.target.value),
                                })
                              }
                              className="w-16 h-7 text-sm px-2 mt-1"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          ) : item.discount > 0 ? (
                            <span>{item.discount}%</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">Total:</span>
                        <div className="font-bold text-lg text-emerald-600">
                          Rs {item.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section - Right Side (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm lg:sticky lg:top-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-bold text-lg text-gray-800">Order Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  Rs {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Extra Discount:</span>
                <div className="flex items-center gap-2">
                  {isEditingDiscount ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={tempDiscountPercentage}
                        onChange={(e) =>
                          setTempDiscountPercentage(Number(e.target.value))
                        }
                        className="w-16 h-7 text-right text-sm px-2 text-black"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="text-sm">%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 ml-1 hover:bg-green-50 hover:border-green-300"
                        onClick={handleSaveDiscount}
                      >
                        <Check className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100 hover:border-gray-300"
                        onClick={handleCancelDiscount}
                      >
                        <X className="h-3 w-3 text-gray-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {discountPercentage.toFixed(2)}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-blue-50 hover:border-blue-300"
                        onClick={handleEditDiscount}
                      >
                        <Pencil className="h-3 w-3 text-blue-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Discount Amount:</span>
                <span className="font-semibold text-green-600">
                  - Rs {totalDiscount.toFixed(2).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-2xl text-emerald-600">
                  Rs {grandTotal.toFixed(2).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Total Items
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {orderItems.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 space-y-3">
              <Button
                onClick={() => setConfirmOrderModal(true)}
                disabled={isLoading || modalLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Order
              </Button>
              <Button
                onClick={() => setCancelOrderModal(true)}
                disabled={isLoading || modalLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-base font-semibold"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingDetailsItemtable;
