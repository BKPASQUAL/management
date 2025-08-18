import { Users, UserPlus, TrendingUp, Crown } from "lucide-react";
import React from "react";

// TypeScript interfaces
interface CustomerCard {
  title: string;
  value: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const CustomerCards: React.FC = () => {
  const customerData: CustomerCard[] = [
    {
      title: "Total Customers",
      value: "1,245",
      unit: "",
      icon: Users,
      iconColor: "text-blue-500"
    },
    {
      title: "New Customers",
      value: "89",
      unit: "this month",
      icon: UserPlus,
      iconColor: "text-green-500"
    },
    {
      title: "Customer Growth",
      value: "12.5",
      unit: "%",
      icon: TrendingUp,
      iconColor: "text-purple-500"
    },
    {
      title: "VIP Customers",
      value: "156",
      unit: "premium",
      icon: Crown,
      iconColor: "text-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {customerData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="border p-4 rounded-lg h-28 flex flex-col justify-between bg-white hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <h1 className="font-semibold text-gray-600 text-sm leading-tight">
                {card.title}
              </h1>
              <IconComponent className={`w-4 h-4 ${card.iconColor} flex-shrink-0`} />
            </div>
            <div className="flex gap-2 items-end">
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              {card.unit && (
                <p className="text-sm text-gray-500 mb-0.5">{card.unit}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerCards;