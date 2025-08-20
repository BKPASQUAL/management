"use client";
import AddCustumer from "@/components/model/AddCustumer";
import CustumerTable from "@/components/tables/CustumerTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import React, { useState } from "react";

// Type definitions
interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleButtonProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ToggleOption[];
}

type CustomerType = "retail" | "enterprise";

// Toggle Button Component using shadcn/ui style approach
const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  onValueChange,
  options,
}) => {
  return (
    <div className="inline-flex h-9 sm:h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer flex-1 sm:flex-initial ${
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "hover:bg-background/50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const CustomerManagement: React.FC = () => {
  const [customerType, setCustomerType] = useState<CustomerType>("retail");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleOptions: ToggleOption[] = [
    { value: "retail", label: "Retail" },
    { value: "enterprise", label: "Enterprise" },
  ];

  const handleCustomerTypeChange = (value: string): void => {
    setCustomerType(value as CustomerType);
  };

  const toggleFilters = (): void => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-2 sm:mb-4">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Customer Management
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Efficiently manage and track customers
        </p>
      </div>

      {/* Controls Container */}
      <div className="border rounded-md p-2 sm:p-4 lg:p-4 bg-white">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-4">
          {/* Row 1: Toggle and Add Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
            <div className="flex-1">
              <ToggleButton
                value={customerType}
                onValueChange={handleCustomerTypeChange}
                options={toggleOptions}
              />
            </div>
            <Button
              className="w-full sm:w-auto whitespace-nowrap cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Customer
            </Button>
          </div>

          {/* Row 2: Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input placeholder="Search customers..." className="pl-10 h-9" />
          </div>

          {/* Row 3: Filter Toggle Button (Mobile Only) */}
          <div className="block sm:hidden">
            <Button
              variant="outline"
              onClick={toggleFilters}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Row 4: Filters (Always visible on tablet, toggleable on mobile) */}
          <div
            className={`${
              showFilters ? "block" : "hidden sm:block"
            } space-y-3 sm:space-y-0 sm:flex sm:gap-3`}
          >
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="computing">Computing</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedSupplier}
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="colombo">Colombo</SelectItem>
                <SelectItem value="kandy">Kandy</SelectItem>
                <SelectItem value="galle">Galle</SelectItem>
                <SelectItem value="negombo">Negombo</SelectItem>
                <SelectItem value="matara">Matara</SelectItem>
                <SelectItem value="kurunegala">Kurunegala</SelectItem>
                <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                <SelectItem value="ratnapura">Ratnapura</SelectItem>
                <SelectItem value="batticaloa">Batticaloa</SelectItem>
                <SelectItem value="jaffna">Jaffna</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop Layout (Large screens) */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between gap-6">
            {/* Left Side: Controls */}
            <div className="flex items-center gap-4 flex-1">
              {/* Toggle Button */}
              <ToggleButton
                value={customerType}
                onValueChange={handleCustomerTypeChange}
                options={toggleOptions}
              />

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 h-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[160px] lg:w-[180px] h-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="computing">Computing</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <SelectTrigger className="w-[160px] lg:w-[180px] h-10">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="colombo">Colombo</SelectItem>
                    <SelectItem value="kandy">Kandy</SelectItem>
                    <SelectItem value="galle">Galle</SelectItem>
                    <SelectItem value="negombo">Negombo</SelectItem>
                    <SelectItem value="matara">Matara</SelectItem>
                    <SelectItem value="kurunegala">Kurunegala</SelectItem>
                    <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                    <SelectItem value="ratnapura">Ratnapura</SelectItem>
                    <SelectItem value="batticaloa">Batticaloa</SelectItem>
                    <SelectItem value="jaffna">Jaffna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Side: Add Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer "
            >
              Add Customer
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 sm:mt-6">
          <CustumerTable />
        </div>
      </div>
      <AddCustumer
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default CustomerManagement;
