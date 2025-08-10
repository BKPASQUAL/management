"use client";

import React from "react";
import {
  AlertTriangle,
  ClipboardList,
  Coins,
  DollarSign,
  Package,
  Tag,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StockData {
  month: string;
  stock: number;
}

interface SalesData {
  month: string;
  sales: number;
}

interface AreaData {
  area: string;
  sales: number;
}

interface RepData {
  rep: string;
  performance: number;
}

interface TrendData {
  month: string;
  trend: number;
}

interface ConversionData {
  month: string;
  rate: number;
}

// Union type for all possible chart data
type ChartData =
  | StockData
  | SalesData
  | AreaData
  | RepData
  | TrendData
  | ConversionData;
// Sample data for charts
const stockData = [
  { month: "Jan", stock: 1200 },
  { month: "Feb", stock: 1350 },
  { month: "Mar", stock: 1100 },
  { month: "Apr", stock: 1400 },
  { month: "May", stock: 1250 },
  { month: "Jun", stock: 1300 },
  { month: "Jul", stock: 1450 },
  { month: "Aug", stock: 1200 },
  { month: "Sep", stock: 1350 },
  { month: "Oct", stock: 1500 },
  { month: "Nov", stock: 1250 },
  { month: "Dec", stock: 1245 },
];

const salesData = [
  { month: "Jan", sales: 800 },
  { month: "Feb", sales: 950 },
  { month: "Mar", sales: 720 },
  { month: "Apr", sales: 1100 },
  { month: "May", sales: 850 },
  { month: "Jun", sales: 980 },
  { month: "Jul", sales: 1200 },
  { month: "Aug", sales: 900 },
  { month: "Sep", sales: 1050 },
  { month: "Oct", sales: 1300 },
  { month: "Nov", sales: 950 },
  { month: "Dec", sales: 1100 },
];

const topSellingAreasData = [
  { area: "Colombo", sales: 2500 },
  { area: "Kandy", sales: 1800 },
  { area: "Galle", sales: 1600 },
  { area: "Negombo", sales: 1400 },
  { area: "Jaffna", sales: 1200 },
  { area: "Kurunegala", sales: 1000 },
];

const topRepsData = [
  { rep: "John Silva", performance: 95 },
  { rep: "Mary Fernando", performance: 88 },
  { rep: "David Perera", performance: 82 },
];

const salesTrendData = [
  { month: "Jan", trend: 15 },
  { month: "Feb", trend: 25 },
  { month: "Mar", trend: 10 },
  { month: "Apr", trend: 35 },
  { month: "May", trend: 18 },
  { month: "Jun", trend: 28 },
  { month: "Jul", trend: 42 },
  { month: "Aug", trend: 22 },
  { month: "Sep", trend: 30 },
  { month: "Oct", trend: 45 },
  { month: "Nov", trend: 25 },
  { month: "Dec", trend: 38 },
];

const conversionData = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 72 },
  { month: "Mar", rate: 58 },
  { month: "Apr", rate: 78 },
  { month: "May", rate: 68 },
  { month: "Jun", rate: 75 },
  { month: "Jul", rate: 82 },
  { month: "Aug", rate: 70 },
  { month: "Sep", rate: 76 },
  { month: "Oct", rate: 85 },
  { month: "Nov", rate: 73 },
  { month: "Dec", rate: 80 },
];

interface ChartCardProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  xAxisKey: string;
  color: string;
  chartType?: "bar" | "line";
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  dataKey,
  xAxisKey,
  color,
  chartType = "bar",
}) => (
  <div className="border p-4 rounded-lg w-[32%] h-80">
    <h3 className="font-semibold text-gray-700 mb-4 text-center">{title}</h3>
    {chartType === "line" ? (
      <ChartContainer
        config={{
          [dataKey]: {
            label: title,
            color: color,
          },
        }}
        className="h-64 w-full"
      >
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis fontSize={10} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    ) : (
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis fontSize={10} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default function Page() {
  return (
    <div>
      <div className="flex flex-col gap-y-6">
        {/* Product Header */}
        <div className="flex flex-row gap-4 items-center">
          <Package className="w-7 h-7" />
          <div className="gap-1">
            <h1 className="font-bold text-2xl">Orange One Gan</h1>
            <p className="text-gray-500">Or10244</p>
          </div>
        </div>

        {/* Cards Row */}
        <div className="flex flex-row justify-between flex-wrap">
          {/* Available Stock */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Available Stock</h1>
              <ClipboardList className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex gap-2 items-end">
              <p className="text-xl font-bold">1245</p>
              <p>dz</p>
            </div>
          </div>

          {/* Total Value */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Total Value</h1>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,245,000</p>
          </div>

          {/* Damaged Items */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Damaged Items</h1>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xl font-bold">12</p>
          </div>

          {/* Cost Price */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Cost Price</h1>
              <Coins className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,200 / dz</p>
          </div>

          {/* Selling Price */}
          <div className="border p-4 rounded-lg w-[19%] h-28 flex flex-col justify-between">
            <div className="flex justify-between">
              <h1 className="font-semibold text-gray-600">Selling Price</h1>
              <Tag className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xl font-bold">Rs. 1,500 / dz</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex flex-col gap-6">
          {/* First Row - 3 Charts */}
          <div className="flex flex-row justify-between gap-4">
            <ChartCard
              title="Stock Levels (Last 12 Months)"
              data={stockData}
              dataKey="stock"
              xAxisKey="month"
              color="#3b82f6"
            />
            <ChartCard
              title="Sales Performance (Last 12 Months)"
              data={salesData}
              dataKey="sales"
              xAxisKey="month"
              color="#10b981"
              chartType="line"
            />
            <ChartCard
              title="Top Selling Areas (Top 6)"
              data={topSellingAreasData}
              dataKey="sales"
              xAxisKey="area"
              color="#f59e0b"
            />
          </div>

          {/* Second Row - 3 Charts */}
          <div className="flex flex-row justify-between gap-4">
            <ChartCard
              title="Conversion Rate (%)"
              data={conversionData}
              dataKey="rate"
              xAxisKey="month"
              color="#8b5cf6"
            />
            <ChartCard
              title="Top 3 Reps Performance (%)"
              data={topRepsData}
              dataKey="performance"
              xAxisKey="rep"
              color="#ef4444"
            />
            <ChartCard
              title="Sales Trend Over Time"
              data={salesTrendData}
              dataKey="trend"
              xAxisKey="month"
              color="#06b6d4"
              chartType="line"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
