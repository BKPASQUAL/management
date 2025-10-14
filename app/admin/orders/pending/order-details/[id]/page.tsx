import React from "react";
import { DollarSign, FileText, AlertCircle, Calendar, User, CreditCard } from "lucide-react";
import PendingDetailsItemtable from "@/components/orders/PendingDetailsItemtable";

export default function Page() {
  return (
    <div className="">
      <div>
        <div></div>
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800 ">
          Champika Hardware
        </h1>
        <p>No. 45, Main Street, Galle, Sri Lanka</p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Due Amount Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Due Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  Rs 45,000
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  OUTSTANDING
                </p>
              </div>
              <div className="bg-red-50 p-2 rounded-full">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>

          {/* Pending Bills Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Pending Bills
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">6</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  AWAITING
                </p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-full">
                <FileText className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Over 45 Days Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Over 45 Days Amount
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  Rs 30,000
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  IN PROGRESS
                </p>
              </div>
              <div className="bg-orange-50 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Last Billing Date Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-medium mb-2">
                  Last Billing Date
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">Oct 10</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  THIS MONTH
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-3 mt-6">
        {/* <h2 className="font-bold text-lg text-gray-800 mb-4">Order Details</h2> */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
          {/* Invoice Number */}
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg mt-1">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Invoice Number
              </p>
              <p className="text-base font-semibold text-gray-900">
                INV-108287
              </p>
            </div>
          </div>

          {/* Billing Date */}
          <div className="flex items-start gap-3">
            <div className="bg-purple-50 p-2 rounded-lg mt-1">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Billing Date
              </p>
              <p className="text-base font-semibold text-gray-900">
                October 10, 2025
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start gap-3">
            <div className="bg-green-50 p-2 rounded-lg mt-1">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Payment Method
              </p>
              <p className="text-base font-semibold text-gray-900">
                Credit - 30 Days
              </p>
            </div>
          </div>

          {/* Representative Name */}
          <div className="flex  items-start gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg mt-1">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Representative Name
              </p>
              <p className="text-base font-semibold text-gray-900">
                Kasun Perera
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="flex items-start gap-3">
            <div className="bg-yellow-50 p-2 rounded-lg mt-1">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Order Status
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Pending Payment
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-start gap-3">
            <div className="bg-red-50 p-2 rounded-lg mt-1">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Due Date</p>
              <p className="text-base font-semibold text-red-600">
                November 09, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <PendingDetailsItemtable/>
      </div>
    </div>
  );
}
