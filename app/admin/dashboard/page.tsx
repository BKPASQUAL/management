"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Truck,
} from "lucide-react";

export default function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  const stats = [
    {
      title: "Total Products",
      value: "2,543",
      icon: Package,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      title: "Total Customers",
      value: "1,234",
      icon: Users,
      change: "+8.2%",
      changeType: "positive",
    },
    {
      title: "Total Orders",
      value: "892",
      icon: ShoppingCart,
      change: "+15.3%",
      changeType: "positive",
    },
    {
      title: "Revenue",
      value: "LKR 458,320",
      icon: DollarSign,
      change: "+23.1%",
      changeType: "positive",
    },
    {
      title: "Suppliers",
      value: "45",
      icon: Truck,
      change: "+2.4%",
      changeType: "positive",
    },
    {
      title: "Growth Rate",
      value: "18.5%",
      icon: TrendingUp,
      change: "+5.2%",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-blue-100">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p
                className={`text-xs mt-1 ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/products"
              className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-gray-500">Add or edit products</p>
            </a>
            <a
              href="/admin/createSupplierBill"
              className="p-4 border rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Truck className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Supplier Bill</h3>
              <p className="text-sm text-gray-500">Create new bill</p>
            </a>
            <a
              href="/admin/createCustomerBill"
              className="p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">Customer Bill</h3>
              <p className="text-sm text-gray-500">Create new invoice</p>
            </a>
            <a
              href="/admin/reports"
              className="p-4 border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold">View Reports</h3>
              <p className="text-sm text-gray-500">Analytics & insights</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}