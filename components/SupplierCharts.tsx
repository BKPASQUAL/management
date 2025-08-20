import React from "react";
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

// Sample data for Sales & Bills Trend (Last 90 days)
const salesTrendData = [
  { day: "Day 1", amount: 45000 },
  { day: "Day 10", amount: 52000 },
  { day: "Day 20", amount: 48000 },
  { day: "Day 30", amount: 65000 },
  { day: "Day 40", amount: 58000 },
  { day: "Day 50", amount: 72000 },
  { day: "Day 60", amount: 68000 },
  { day: "Day 70", amount: 75000 },
  { day: "Day 80", amount: 82000 },
  { day: "Day 90", amount: 89000 }
];

// Sample data for Stock Distribution
const stockDistributionData = [
  { category: "Cement", value: 450000, percentage: 36.1 },
  { category: "Wires", value: 285000, percentage: 22.9 },
  { category: "Paints", value: 195000, percentage: 15.7 },
  { category: "Tools", value: 165000, percentage: 13.3 },
  { category: "Hardware", value: 150000, percentage: 12.0 }
];

// Sample data for Credit vs Cash Flow (Monthly)
const creditCashFlowData = [
  { month: "Jan", creditInMarket: 2800000, paidBills: 2200000 },
  { month: "Feb", creditInMarket: 3000000, paidBills: 2400000 },
  { month: "Mar", creditInMarket: 3100000, paidBills: 2600000 },
  { month: "Apr", creditInMarket: 3250000, paidBills: 2450000 },
  { month: "May", creditInMarket: 3200000, paidBills: 2750000 },
  { month: "Jun", creditInMarket: 3250000, paidBills: 2850000 }
];

// Colors for pie chart

export default function SupplierCharts() {
  return (
    <div className="w-full ">
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Bills Trend Chart */}
        <div className="border rounded-lg p-6 bg-white ">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales & Bills Trend (Last 90 Days)</h2>
            <p className="text-sm text-gray-600">Track your billing patterns over time</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Bill Amount"]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Distribution - Bar Chart */}
        <div className="border rounded-lg p-6 bg-white ">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Stock Distribution (Bar Chart)</h2>
            <p className="text-sm text-gray-600">Value of stock items per category</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6B7280"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Stock Value"]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credit vs Cash Flow Chart */}
        <div className="border rounded-lg p-6 bg-white ">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Credit vs Cash Flow (Monthly)</h2>
            <p className="text-sm text-gray-600">Compare credit in market vs paid bills over time</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditCashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `Rs. ${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `Rs. ${value.toLocaleString()}`, 
                    name === 'creditInMarket' ? 'Credit in Market' : 'Paid Bills'
                  ]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="creditInMarket" fill="#F59E0B" name="creditInMarket" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paidBills" fill="#10B981" name="paidBills" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Credit in Market</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Paid Bills</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}