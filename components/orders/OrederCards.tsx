import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  AlertCircle,
} from "lucide-react";
import React from "react";

// TypeScript interfaces
interface OrderCard {
  title: string;
  value: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
}

const OrderCards: React.FC = () => {
  const orderData: OrderCard[] = [
    {
      title: "Total Orders",
      value: "1,247",
      unit: "all time",
      icon: ShoppingCart,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: "23",
      unit: "awaiting",
      icon: Clock,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Processing Orders",
      value: "15",
      unit: "in progress",
      icon: Package,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completed Orders",
      value: "1,209",
      unit: "delivered",
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Shipped Orders",
      value: "47",
      unit: "in transit",
      icon: Truck,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Cancelled Orders",
      value: "8",
      unit: "this month",
      icon: AlertCircle,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {orderData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded-lg h-32 flex flex-col justify-between bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-700 text-sm leading-tight">
                {card.title}
              </h3>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <IconComponent
                  className={`w-4 h-4 ${card.iconColor}`}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </p>
              {card.unit && (
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {card.unit}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderCards;