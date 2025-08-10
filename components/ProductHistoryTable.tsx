import React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";

function ProductHistoryTable() {
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  // Sample data - replace with your actual data
  const historyData = [
    {
      id: 1,
      date: "2023-10-01",
      action: "Added Stock",
      quantity: 100,
      remarks: "Initial stock added",
      userName: "Admin User",
    },
    {
      id: 2,
      date: "2023-10-05",
      action: "Sold",
      quantity: 20,
      remarks: "Sold to customer A",
      userName: "Sales Rep 1",
    },
    {
      id: 3,
      date: "2023-10-10",
      action: "Returned",
      quantity: 5,
      remarks: "Customer return",
      userName: "Store Manager",
    },
    {
      id: 4,
      date: "2023-10-15",
      action: "Sold",
      quantity: 30,
      remarks: "Bulk order",
      userName: "Sales Rep 2",
    },
    {
      id: 5,
      date: "2023-10-20",
      action: "Added Stock",
      quantity: 50,
      remarks: "Restocking",
      userName: "Inventory Manager",
    },
  ];

  // Filter data based on date range
  const filteredData = historyData.filter((item) => {
    const itemDate = new Date(item.date);

    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;

    return true;
  });

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return date.toLocaleDateString();
  };

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold">Product History</h2>

        {/* Date Filter Controls - Right Side */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Filter by date:</span>

            {/* Start Date Picker */}
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 justify-between font-normal"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(startDate)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartDateOpen(false);
                  }}
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={2030}
                />
              </PopoverContent>
            </Popover>

            <span className="text-sm text-gray-500">to</span>

            {/* End Date Picker */}
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-40 justify-between font-normal"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {formatDate(endDate)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndDateOpen(false);
                  }}
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={2030}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters Button */}
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
              className="self-end"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredData.length} of {historyData.length} records
        </p>
      </div>

      {/* Table with shadcn/ui Table components */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>User Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.date}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.action === "Added Stock"
                        ? "bg-green-100 text-green-800"
                        : item.action === "Sold"
                        ? "bg-blue-100 text-blue-800"
                        : item.action === "Returned"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.action}
                  </span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.remarks}</TableCell>
                <TableCell>{item.userName}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No records found for the selected date range
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductHistoryTable;
