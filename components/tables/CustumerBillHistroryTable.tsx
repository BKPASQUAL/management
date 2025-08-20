import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Type definitions
interface BillHistory {
  billNumber: string;
  billingDate: string;
  amount: string;
  user: string;
  deliveredDate: string;
  paymentStatus: "paid" | "due";
  transactionType: "selling" | "return";
}

type PaymentStatus = "paid" | "due";
type TransactionType = "selling" | "return";

const CustomerBillHistoryTable: React.FC = () => {
  // Sample data for demonstration with proper typing
  const billHistory: BillHistory[] = [
    {
      billNumber: "INV-2024-001",
      billingDate: "2024-01-15",
      amount: "250.00",
      user: "John Doe",
      deliveredDate: "2024-01-18",
      paymentStatus: "paid",
      transactionType: "selling",
    },
    {
      billNumber: "INV-2024-002",
      billingDate: "2024-02-10",
      amount: "175.50",
      user: "Jane Smith",
      deliveredDate: "2024-02-12",
      paymentStatus: "due",
      transactionType: "selling",
    },
    {
      billNumber: "INV-2024-003",
      billingDate: "2024-03-05",
      amount: "320.75",
      user: "Mike Johnson",
      deliveredDate: "2024-03-08",
      paymentStatus: "paid",
      transactionType: "return",
    },
    {
      billNumber: "INV-2024-004",
      billingDate: "2024-03-20",
      amount: "145.25",
      user: "Sarah Wilson",
      deliveredDate: "2024-03-22",
      paymentStatus: "due",
      transactionType: "selling",
    },
    {
      billNumber: "INV-2024-005",
      billingDate: "2024-04-12",
      amount: "289.90",
      user: "David Brown",
      deliveredDate: "2024-04-15",
      paymentStatus: "paid",
      transactionType: "selling",
    },
  ];

  const getPaymentStatusBadge = (status: PaymentStatus): string => {
    const baseClasses: string = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === "paid") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const getTransactionTypeBadge = (type: TransactionType): string => {
    const baseClasses: string = "px-2 py-1 rounded-full text-xs font-medium";
    if (type === "selling") {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    } else {
      return `${baseClasses} bg-orange-100 text-orange-800`;
    }
  };



  return (
    <div className="w-full">
      {/* Desktop/Tablet Table View - Hidden on mobile */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Bill Number</TableHead>
              <TableHead className="w-[120px]">Billing Date</TableHead>
              <TableHead className="w-[100px]">Amount</TableHead>
              <TableHead className="w-[120px]">User</TableHead>
              <TableHead className="w-[120px]">Delivered Date</TableHead>
              <TableHead className="w-[100px]">Payment</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billHistory.map((bill: BillHistory) => (
              <TableRow key={bill.billNumber}>
                <TableCell className="font-medium">{bill.billNumber}</TableCell>
                <TableCell>{bill.billingDate}</TableCell>
                <TableCell className="font-semibold">{bill.amount}</TableCell>
                <TableCell>{bill.user}</TableCell>
                <TableCell>{bill.deliveredDate}</TableCell>
                <TableCell>
                  <span className={getPaymentStatusBadge(bill.paymentStatus)}>
                    {bill.paymentStatus.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={getTransactionTypeBadge(bill.transactionType)}
                  >
                    {bill.transactionType.toUpperCase()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="lg:hidden space-y-4">
        {billHistory.map((bill: BillHistory) => (
          <div
            key={bill.billNumber}
            className="bg-white rounded-lg border shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold text-lg">{bill.billNumber}</span>
              <span className="font-bold text-green-600">{bill.amount}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Date:</span>
                <span className="font-medium">{bill.billingDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">User:</span>
                <span className="font-medium">{bill.user}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivered:</span>
                <span className="font-medium">{bill.deliveredDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={getPaymentStatusBadge(bill.paymentStatus)}>
                  {bill.paymentStatus.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Transaction Type:</span>
                <span className={getTransactionTypeBadge(bill.transactionType)}>
                  {bill.transactionType.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet-specific optimizations - Show simplified table */}
      <div className="hidden md:block lg:hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billHistory.map((bill: BillHistory) => (
              <TableRow key={bill.billNumber}>
                <TableCell className="font-medium text-xs">
                  {bill.billNumber}
                </TableCell>
                <TableCell className="text-xs">{bill.billingDate}</TableCell>
                <TableCell className="text-xs font-semibold">
                  {bill.amount}
                </TableCell>
                <TableCell className="text-xs">{bill.user}</TableCell>
                <TableCell className="text-xs">
                  <span className={getPaymentStatusBadge(bill.paymentStatus)}>
                    {bill.paymentStatus === "paid" ? "PAID" : "DUE"}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <span
                    className={getTransactionTypeBadge(bill.transactionType)}
                  >
                    {bill.transactionType === "selling" ? "SELL" : "RET"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerBillHistoryTable;
