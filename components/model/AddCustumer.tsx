"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddCustomerProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCustomer({ open, onClose }: AddCustomerProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    shopName: "",
    customerType: "ENTERPRISE", // Default to retail as per DTO
    areaId: "",
    address: "",
    contactNumber: "",
    assignedRepId: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      areaId: value,
    }));
  };

  const handleRepChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedRepId: value,
    }));
  };

  const handleCustomerTypeChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      customerType: checked ? "ENTERPRISE" : "RETAIL",
      // Reset area and rep when switching to retail
      ...(checked ? {} : { areaId: "", assignedRepId: "" }),
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      shopName: "",
      customerType: "ENTERPRISE", // Reset to default
      areaId: "",
      address: "",
      contactNumber: "",
      assignedRepId: "",
      notes: "",
    });
  };

  const handleSave = () => {
    const customerData = {
      customerName: formData.customerName,
      shopName: formData.shopName,
      customerType: formData.customerType,
      contactNumber: formData.contactNumber,
      address: formData.address || undefined,
      notes: formData.notes || undefined,
      // Only include areaId and assignedRepId for enterprise customers
      ...(formData.customerType === "ENTERPRISE" && {
        areaId: formData.areaId ? parseInt(formData.areaId) : undefined,
        assignedRepId: parseInt(formData.assignedRepId),
      }),
    };
    console.log("Customer added:", customerData);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    formData.customerName.trim() &&
    formData.shopName.trim() &&
    formData.contactNumber.trim() &&
    (formData.customerType === "RETAIL" ||
      (formData.customerType === "ENTERPRISE" &&
        formData.assignedRepId.trim()));

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[600px] sm:max-w-[600px] lg:w-[705px] lg:max-w-[705px] max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6 mx-auto my-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Customer
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill in the details below to add a new customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Customer Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <Input
                name="customerName"
                placeholder="Customer Name *"
                value={formData.customerName}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-11"
                required
              />
              <Input
                name="shopName"
                placeholder="Shop Name *"
                value={formData.shopName}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-11"
                required
              />
              <Input
                name="contactNumber"
                placeholder="Contact Number *"
                value={formData.contactNumber}
                onChange={handleChange}
                type="tel"
                className="text-sm sm:text-base h-10 sm:h-11"
                required
              />
            </div>
          </div>

          {/* Customer Type */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customerType"
                checked={formData.customerType === "ENTERPRISE"}
                onCheckedChange={handleCustomerTypeChange}
                className="h-4 w-4 sm:h-5 sm:w-5"
              />
              <Label
                htmlFor="customerType"
                className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enterprise Customer
              </Label>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {formData.customerType === "ENTERPRISE"
                ? "Enterprise customer selected"
                : "Retail customer selected"}
            </p>
          </div>

          {/* Area and Assigned Rep - Only show for Enterprise customers */}
          {formData.customerType === "ENTERPRISE" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <Select
                  onValueChange={handleAreaChange}
                  value={formData.areaId}
                >
                  <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    <SelectItem value="1">Colombo</SelectItem>
                    <SelectItem value="2">Kandy</SelectItem>
                    <SelectItem value="3">Galle</SelectItem>
                    <SelectItem value="4">Negombo</SelectItem>
                    <SelectItem value="5">Matara</SelectItem>
                    <SelectItem value="6">Kurunegala</SelectItem>
                    <SelectItem value="7">Anuradhapura</SelectItem>
                    <SelectItem value="8">Ratnapura</SelectItem>
                    <SelectItem value="9">Batticaloa</SelectItem>
                    <SelectItem value="10">Jaffna</SelectItem>
                    <SelectItem value="11">Trincomalee</SelectItem>
                    <SelectItem value="12">Badulla</SelectItem>
                    <SelectItem value="13">Polonnaruwa</SelectItem>
                    <SelectItem value="14">Hambantota</SelectItem>
                    <SelectItem value="15">Kalutara</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={handleRepChange}
                  value={formData.assignedRepId}
                >
                  <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                    <SelectValue placeholder="Assign Rep *" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    <SelectItem value="1">John Silva</SelectItem>
                    <SelectItem value="2">Mary Fernando</SelectItem>
                    <SelectItem value="3">David Perera</SelectItem>
                    <SelectItem value="4">Sarah De Silva</SelectItem>
                    <SelectItem value="5">Michael Jayawardena</SelectItem>
                    <SelectItem value="6">Priya Wijesinghe</SelectItem>
                    <SelectItem value="7">Kevin Rajapakse</SelectItem>
                    <SelectItem value="8">Nimal Gunasekara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Address and Notes */}
          <div className="space-y-3 sm:space-y-4">
            <Textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
            />
            <Textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[60px] sm:min-h-[80px] text-sm sm:text-base resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base cursor-pointer "
            >
              Add Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
