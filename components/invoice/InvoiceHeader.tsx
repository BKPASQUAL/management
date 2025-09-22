"use client";

import * as React from "react";
import {
  Calendar,
  ChevronsUpDown,
  Check,
  Users,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Customer } from "./types";

interface InvoiceHeaderProps {
  customers: Customer[];
  customersLoading: boolean;
  customersError: string | null;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  customerOpen: boolean;
  setCustomerOpen: (open: boolean) => void;
//   invoiceNo: string;
//   setInvoiceNo: (invoiceNo: string) => void;
  billingDate: Date;
  setBillingDate: (date: Date) => void;
  billingDateOpen: boolean;
  setBillingDateOpen: (open: boolean) => void;
  fetchCustomers: () => void;
}

export default function InvoiceHeader({
  customers,
  customersLoading,
  customersError,
  selectedCustomer,
  setSelectedCustomer,
  customerOpen,
  setCustomerOpen,
  billingDate,
  setBillingDate,
  billingDateOpen,
  setBillingDateOpen,
  fetchCustomers,
}: InvoiceHeaderProps) {
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSelectedCustomerData = () => {
    return customers.find(
      (customer) => customer.id.toString() === selectedCustomer
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Customer Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Select Customer *
          </Label>

          {customersError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{customersError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCustomers}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                Retry
              </Button>
            </div>
          )}

          <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={customerOpen}
                className="w-full justify-between h-10"
                disabled={customersLoading}
              >
                {customersLoading
                  ? "Loading customers..."
                  : selectedCustomer
                  ? (() => {
                      const customer = getSelectedCustomerData();
                      return customer
                        ? `${customer.customerName} (${customer.customerCode})`
                        : "Select customer...";
                    })()
                  : "Choose customer..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search customers..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {customersLoading
                      ? "Loading customers..."
                      : "No customer found."}
                  </CommandEmpty>
                  {!customersLoading && customers.length > 0 && (
                    <CommandGroup>
                      {customers.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.id.toString()}
                          onSelect={(currentValue) => {
                            setSelectedCustomer(
                              currentValue === selectedCustomer
                                ? ""
                                : currentValue
                            );
                            setCustomerOpen(false);
                          }}
                        >
                          <div>
                            <p className="font-medium">
                              {customer.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Code: {customer.customerCode}
                            </p>
                            <p className="text-xs text-gray-500">
                              {customer.shopName}
                            </p>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCustomer === customer.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Invoice Number */}
        {/* <div className="space-y-2">
          <Label className="text-sm font-medium">Invoice Number</Label>
          <Input
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            className="h-10"
            placeholder="INV-000001"
          />
        </div> */}

        {/* Billing Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Invoice Date
          </Label>
          <Popover open={billingDateOpen} onOpenChange={setBillingDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !billingDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(billingDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={billingDate}
                onSelect={(date) => {
                  setBillingDate(date || new Date());
                  setBillingDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}