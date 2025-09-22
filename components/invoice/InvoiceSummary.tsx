"use client";

import * as React from "react";
import { DollarSign, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { paymentMethods, PaymentMethod } from "./types";

interface InvoiceSummaryProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentMethodOpen: boolean;
  setPaymentMethodOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
  extraDiscount: string;
  setExtraDiscount: (discount: string) => void;
  extraDiscountAmount: number;
  finalTotal: number;
}

export default function InvoiceSummary({
  paymentMethod,
  setPaymentMethod,
  paymentMethodOpen,
  setPaymentMethodOpen,
  subtotal,
  totalItems,
  extraDiscount,
  setExtraDiscount,
  extraDiscountAmount,
  finalTotal,
}: InvoiceSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Method *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Popover
            open={paymentMethodOpen}
            onOpenChange={setPaymentMethodOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={paymentMethodOpen}
                className="w-full justify-between h-12"
              >
                <div className="flex items-center gap-2">
                  {paymentMethod && (
                    <span className="text-lg">
                      {
                        paymentMethods.find(
                          (method) => method.value === paymentMethod
                        )?.icon
                      }
                    </span>
                  )}
                  <span>
                    {paymentMethod
                      ? paymentMethods.find(
                          (method) => method.value === paymentMethod
                        )?.label
                      : "Select payment method..."}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search payment methods..." />
                <CommandList>
                  <CommandEmpty>No payment method found.</CommandEmpty>
                  <CommandGroup>
                    {paymentMethods.map((method) => (
                      <CommandItem
                        key={method.value}
                        value={method.value}
                        onSelect={(currentValue) => {
                          setPaymentMethod(
                            currentValue === paymentMethod
                              ? ""
                              : currentValue
                          );
                          setPaymentMethodOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{method.icon}</span>
                          <span>{method.label}</span>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            paymentMethod === method.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({totalItems} items):</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Extra Discount:</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(e.target.value)}
                className="w-20 h-8 text-right"
                placeholder="0"
                min="0"
                max="100"
              />
              <span>%</span>
            </div>
          </div>

          <div className="flex justify-between text-sm text-red-600">
            <span>Discount Amount:</span>
            <span>-${extraDiscountAmount.toFixed(2)}</span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold text-green-600">
              <span>Final Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {finalTotal > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                Invoice ready for processing!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}