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
import React, { useState, useMemo } from "react";
import { useGetCustomersQuery } from "@/store/services/customer";

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

type CustomerType = "retail" | "enterprise" | "all";

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
  const [customerType, setCustomerType] = useState<CustomerType>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedRepresentative, setSelectedRepresentative] =
    useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch customers to populate filter options
  const { data: customersResponse, isLoading } = useGetCustomersQuery();
  const customers = customersResponse?.data || [];

  // Get unique areas and representatives from API data with null safety
  const uniqueAreas = useMemo(() => {
    if (!customers || customers.length === 0) return [];

    return Array.from(
      new Set(
        customers
          .filter((customer) => customer?.area?.area_name) // Filter out null/undefined areas
          .map((customer) => customer.area.area_name)
      )
    ).sort();
  }, [customers]);

  const uniqueRepresentatives = useMemo(() => {
    if (!customers || customers.length === 0) return [];

    return Array.from(
      new Set(
        customers
          .filter((customer) => customer?.assignedRep?.username) // Filter out null/undefined reps
          .map((customer) => customer.assignedRep.username)
      )
    ).sort();
  }, [customers]);

  const toggleOptions: ToggleOption[] = [
    { value: "all", label: "All" },
    { value: "retail", label: "Retail" },
    { value: "enterprise", label: "Enterprise" },
  ];

  const handleCustomerTypeChange = (value: string): void => {
    setCustomerType(value as CustomerType);
  };

  const toggleFilters = (): void => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
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
            <Input
              placeholder="Search customers..."
              className="pl-10 h-9"
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
              value={selectedArea}
              onValueChange={setSelectedArea}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {uniqueAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedRepresentative}
              onValueChange={setSelectedRepresentative}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="All Representatives" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Representatives</SelectItem>
                {uniqueRepresentatives.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep}
                  </SelectItem>
                ))}
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
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[160px] lg:w-[180px] h-10">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {uniqueAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedRepresentative}
                  onValueChange={setSelectedRepresentative}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[160px] lg:w-[180px] h-10">
                    <SelectValue placeholder="All Representatives" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Representatives</SelectItem>
                    {uniqueRepresentatives.map((rep) => (
                      <SelectItem key={rep} value={rep}>
                        {rep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Side: Add Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer"
            >
              Add Customer
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 sm:mt-6">
          <CustumerTable
            searchTerm={searchTerm}
            selectedLocation={selectedArea}
            selectedSupplier={selectedRepresentative}
            customerType={customerType === "all" ? undefined : customerType}
          />
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
