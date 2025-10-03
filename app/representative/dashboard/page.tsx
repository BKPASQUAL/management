"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  ShoppingCart,
  Receipt,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RepresentativeDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const stats = [
    {
      title: "My Customers",
      value: "87",
      icon: Users,
      change: "+5 this week",
      changeType: "positive",
    },
    {
      title: "Orders Today",
      value: "12",
      icon: ShoppingCart,
      change: "3 pending",
      changeType: "neutral",
    },
    {
      title: "Total Sales",
      value: "LKR 45,230",
      icon: TrendingUp,
      change: "+18.2% this week",
      changeType: "positive",
    },
    {
      title: "Completed",
      value: "234",
      icon: CheckCircle,
      change: "This month",
      changeType: "positive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Hello, {user?.username}!
        </h1>
        <p className="text-green-100">
          Ready to make some sales today? Here&apos;s your performance overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-xs mt-1 text-gray-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/representative/createCustomerBill")}
              className="w-full justify-start"
              size="lg"
            >
              <Receipt className="mr-2 h-5 w-5" />
              Create Customer Bill
            </Button>
            <Button
              onClick={() => router.push("/representative/products")}
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <Package className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
            <Button
              onClick={() => router.push("/representative/customers")}
              variant="outline"
              className="w-full justify-start"
              size="lg"
            >
              <Users className="mr-2 h-5 w-5" />
              View My Customers
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Follow up with ABC Store</p>
                  <p className="text-sm text-gray-500">Due: 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Process pending orders</p>
                  <p className="text-sm text-gray-500">3 orders waiting</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Visit new customer</p>
                  <p className="text-sm text-gray-500">XYZ Hardware</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}