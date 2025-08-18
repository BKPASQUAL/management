import {
  TrendingUp,
  Crown,
  DollarSign,
  FileText,
  Clock,
  Users,
} from "lucide-react";

import React from "react";

// TypeScript interfaces
interface FinancialCard {
  title: string;
  value: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const FinancialCards: React.FC = () => {
  const financialData: FinancialCard[] = [
    {
      title: "Total Orders",
      value: "47",
      unit: "all time",
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "Change Last 3 Months",
      value: "+23.5",
      unit: "%",
      icon: TrendingUp,
      iconColor: "text-green-500",
    },
    {
      title: "Outstanding Amount",
      value: "$2,340",
      unit: "total due",
      icon: DollarSign,
      iconColor: "text-orange-500",
    },
    {
      title: "Outstanding Bills",
      value: "3",
      unit: "invoices",
      icon: FileText,
      iconColor: "text-red-500",
    },
    {
      title: "Over 45 Days Due",
      value: "$890",
      unit: "overdue",
      icon: Clock,
      iconColor: "text-red-600",
    },
    {
      title: "Profit Last Month",
      value: "$1,250",
      unit: "from customer",
      icon: Crown,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {financialData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className="border p-4 rounded-lg h-28 flex flex-col justify-between bg-white "
          >
            <div className="flex justify-between items-start">
              <h1 className="font-semibold text-gray-600 text-sm leading-tight">
                {card.title}
              </h1>
              <IconComponent
                className={`w-4 h-4 ${card.iconColor} flex-shrink-0`}
              />
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

export default FinancialCards;
