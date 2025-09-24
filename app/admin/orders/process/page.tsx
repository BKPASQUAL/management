import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  ChevronRight,
  Eye,
  Edit3,
  CheckCircle2,
} from "lucide-react";

// TypeScript interfaces
interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  sku: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  orderDate: string;
  estimatedDelivery: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  customer: CustomerInfo;
  items: OrderItem[];
}

// Sample data - replace with your actual data source
const sampleOrderData: OrderDetails = {
  orderId: "order_1234567890",
  orderNumber: "ORD-2024-001234",
  status: "pending",
  orderDate: "2024-03-15T10:30:00Z",
  estimatedDelivery: "2024-03-22T17:00:00Z",
  subtotal: 299.97,
  tax: 24.0,
  shipping: 15.0,
  total: 338.97,
  paymentMethod: "Credit Card",
  paymentStatus: "paid",
  customer: {
    name: "John Anderson",
    email: "john.anderson@email.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  },
  items: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling headphones with 30hr battery",
      quantity: 1,
      unitPrice: 149.99,
      totalPrice: 149.99,
      sku: "WBH-001",
      image: "/api/placeholder/100/100",
    },
    {
      id: "2",
      name: "USB-C Fast Charging Cable",
      description: "3ft braided USB-C to USB-A cable, 60W fast charging",
      quantity: 2,
      unitPrice: 24.99,
      totalPrice: 49.98,
      sku: "USC-002",
    },
    {
      id: "3",
      name: "Wireless Phone Charger",
      description: "15W Qi-compatible wireless charging pad",
      quantity: 1,
      unitPrice: 99.99,
      totalPrice: 99.99,
      sku: "WPC-003",
    },
  ],
};

// Step indicator component
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  const steps = [
    {
      number: 1,
      title: "Order Details",
      description: "Review order information",
      icon: Eye,
    },
    {
      number: 2,
      title: "Check Orders",
      description: "Verify order accuracy",
      icon: CheckCircle2,
    },
    {
      number: 3,
      title: "Loading",
      description: "Add lorry & person",
      icon: Package,
    },
    {
      number: 4,
      title: "Delivered",
      description: "Mark as completed",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <nav aria-label="Order processing steps">
        <ol className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <li key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold relative
                        ${
                          step.number === currentStep
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : step.number < currentStep
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }
                      `}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          step.number <= currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-4 flex-shrink-0" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

// Main component
const OrderProcessingStep1: React.FC = () => {
  const order = sampleOrderData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="">
      {/* Step Indicator */}
      <StepIndicator currentStep={1} totalSteps={4} />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order Processing
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Step 1: Review and verify order information before processing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  order.status
                )}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Order Number
                </p>
                <p className="font-mono font-bold text-lg text-gray-900">
                  {order.orderNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-full">
          {/* Order Items Section - Takes 3 columns */}
          <div className="xl:col-span-3 space-y-6">
            {/* Order Items Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="text-lg font-semibold">Order Items</span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {order.items.length} items
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead className="w-[120px]">Item Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead className="w-[100px] text-center">
                        Unit Type
                      </TableHead>
                      <TableHead className="w-[80px] text-center">
                        Qty
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        Unit Price
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        Total Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-center">
                            {item.sku}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            Each
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-8 bg-blue-50 border border-blue-200 rounded text-sm font-semibold text-blue-900">
                            {item.quantity}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Table Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        Total Items:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.items.length}
                        </span>
                      </span>
                      <span>
                        Total Quantity:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar - 1 column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card className="shadow-sm sticky top-6">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-lg font-semibold">Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {formatCurrency(order.shipping)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge
                      variant={
                        order.paymentStatus === "paid" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            {/* <Card className="shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                  <span className="text-lg font-semibold">Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Order Date
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Estimated Delivery
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Proceed to Check Orders
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Edit Order Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingStep1;
