"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart,
  Package,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Phone,
  Building2,
  Calendar,
} from "lucide-react";

// Types
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  representative: string;
  area: string;
}

interface OrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

type OrderStatus =
  | "make_order"
  | "prepare_order"
  | "checking_order"
  | "loading"
  | "delivered";

// Step configuration
const STEPS = [
  {
    id: 1,
    key: "make_order" as const,
    title: "Order Created",
    description: "Order placed",
    icon: ShoppingCart,
    color: "bg-blue-500",
  },
  {
    id: 2,
    key: "prepare_order" as const,
    title: "Preparing",
    description: "Items being packed",
    icon: Package,
    color: "bg-amber-500",
  },
  {
    id: 3,
    key: "checking_order" as const,
    title: "Quality Check",
    description: "Verifying items",
    icon: CheckCircle2,
    color: "bg-purple-500",
  },
  {
    id: 4,
    key: "loading" as const,
    title: "Out for Delivery",
    description: "On the way",
    icon: Truck,
    color: "bg-orange-500",
  },
  {
    id: 5,
    key: "delivered" as const,
    title: "Delivered",
    description: "Completed",
    icon: CheckCircle2,
    color: "bg-green-500",
  },
];

const OrderProcessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockOrder: Order = {
        id: orderId || "ORD001",
        orderNumber: "ORD-2024-001",
        customerName: "Acme Electronics Ltd",
        customerPhone: "+94 11 2345678",
        customerAddress: "123 Main Street, Colombo 03",
        representative: "John Silva",
        area: "Colombo",
        items: [
          {
            id: "1",
            itemCode: "WH001",
            itemName: "Wireless Headphones",
            quantity: 2,
            price: 15000,
            total: 30000,
          },
          {
            id: "2",
            itemCode: "BS002",
            itemName: "Bluetooth Speaker",
            quantity: 1,
            price: 8500,
            total: 8500,
          },
          {
            id: "3",
            itemCode: "PC003",
            itemName: "Phone Case",
            quantity: 3,
            price: 2500,
            total: 7500,
          },
        ],
        totalAmount: 46000,
        status: "prepare_order",
        createdAt: "2024-01-15T10:30:00Z",
      };

      setOrder(mockOrder);
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
      console.log(`Order ${order.id} status updated to: ${newStatus}`);
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return STEPS.findIndex((step) => step.key === order.status);
  };

  const getNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex < STEPS.length - 1 ? STEPS[currentIndex + 1] : null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">Order not found</p>
            <Button onClick={() => router.push("/admin/orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();
  const nextStep = getNextStep();
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Order Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Monitor order progress
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {order.orderNumber}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order Progress</CardTitle>
                  <CardDescription>
                    {STEPS[currentStepIndex]?.title} • {Math.round(progressPercentage)}% Complete
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{currentStepIndex + 1}</div>
                  <div className="text-xs text-muted-foreground">of {STEPS.length}</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-4" />
            </CardHeader>
          </Card>

          {/* Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {STEPS.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isUpcoming = index > currentStepIndex;

                  return (
                    <div key={step.id} className="flex items-center gap-4">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                          ${isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isCurrent
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted border-muted-foreground/20 text-muted-foreground"
                          }
                        `}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          React.createElement(step.icon, { className: "h-4 w-4" })
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-green-600" : "text-muted-foreground"}`}>
                              {step.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          {isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                          {isCompleted && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Complete
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {nextStep && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusUpdate(nextStep.key)}
                    className="w-full"
                    size="lg"
                  >
                    Move to {nextStep.title}
                  </Button>
                </div>
              )}

              {currentStepIndex === STEPS.length - 1 && (
                <div className="mt-6 pt-4 border-t text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="font-semibold text-green-600 mb-2">
                    Order Delivered Successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This order has been completed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">
                    {order.customerName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {order.area}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-xs leading-relaxed">{order.customerAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.representative}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-medium truncate">{item.itemName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.itemCode} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium whitespace-nowrap">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created</span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Time</span>
                </div>
                <span className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessPage;