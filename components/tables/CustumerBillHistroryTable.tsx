import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerBillHistoryTable() {
  // Sample data for demonstration
  const billHistory = [
    {
      billNumber: "INV-2024-001",
      billingDate: "2024-01-15",
      amount: "$250.00",
      user: "John Doe",
      deliveredDate: "2024-01-18",
    },
    {
      billNumber: "INV-2024-002",
      billingDate: "2024-02-10",
      amount: "$175.50",
      user: "Jane Smith",
      deliveredDate: "2024-02-12",
    },
    {
      billNumber: "INV-2024-003",
      billingDate: "2024-03-05",
      amount: "$320.75",
      user: "Mike Johnson",
      deliveredDate: "2024-03-08",
    },
    {
      billNumber: "INV-2024-004",
      billingDate: "2024-03-20",
      amount: "$145.25",
      user: "Sarah Wilson",
      deliveredDate: "2024-03-22",
    },
    {
      billNumber: "INV-2024-005",
      billingDate: "2024-04-12",
      amount: "$289.90",
      user: "David Brown",
      deliveredDate: "2024-04-15",
    },
    
  ];

  // Calculate total amount
  const totalAmount = billHistory.reduce((sum, bill) => {
    return sum + parseFloat(bill.amount.replace("$", ""));
  }, 0);

  return (
    <div className="">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Bill Number</TableHead>
            <TableHead className="w-[150px]">Billing Date</TableHead>
            <TableHead className="w-[150px]">Amount</TableHead>
            <TableHead className="w-[150px]">User</TableHead>
            <TableHead className="text-right w-[150px]">
              Delivered Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billHistory.map((bill) => (
            <TableRow key={bill.billNumber}>
              <TableCell className="font-medium">{bill.billNumber}</TableCell>
              <TableCell>{bill.billingDate}</TableCell>
              <TableCell>{bill.amount}</TableCell>
              <TableCell>{bill.user}</TableCell>
              <TableCell className="text-right">{bill.deliveredDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
