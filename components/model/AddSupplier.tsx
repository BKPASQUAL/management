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

interface AddSupplierProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSupplier({ open, onClose }: AddSupplierProps) {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierCode: "",
    contactPerson: "",
    email: "",
    phone: "",
    category: "",
    location: "",
    address: "",
    website: "",
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      supplierName: "",
      supplierCode: "",
      contactPerson: "",
      email: "",
      phone: "",
      category: "",
      location: "",
      address: "",
      website: "",
      notes: "",
    });
  };

  const handleSave = () => {
    const supplierData = {
      ...formData,
    };
    console.log("Supplier added:", supplierData);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    formData.supplierName.trim() &&
    formData.contactPerson.trim() &&
    formData.email.trim();

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[600px] sm:max-w-[600px] lg:w-[705px] lg:max-w-[705px] max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6 mx-auto my-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Supplier
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill in the details below to add a new supplier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <Input
                name="supplierName"
                placeholder="Supplier Name *"
                value={formData.supplierName}
                onChange={handleChange}
                className="col-span-full text-sm sm:text-base h-10 sm:h-11"
                required
              />
              <Input
                name="supplierCode"
                placeholder="Supplier Code"
                value={formData.supplierCode}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-11"
              />
              <Input
                name="contactPerson"
                placeholder="Contact Person *"
                value={formData.contactPerson}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-11"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <Input
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="text-sm sm:text-base h-10 sm:h-11"
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
              <Select
                onValueChange={handleSelectChange}
                value={formData.category}
              >
                <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="audio">Audio Equipment</SelectItem>
                  <SelectItem value="cables">Cables & Accessories</SelectItem>
                  <SelectItem value="peripherals">
                    Computer Peripherals
                  </SelectItem>
                  <SelectItem value="gaming">Gaming Equipment</SelectItem>
                  <SelectItem value="display">Display & Monitors</SelectItem>
                  <SelectItem value="cameras">Cameras & Vision</SelectItem>
                  <SelectItem value="power">Power & Charging</SelectItem>
                  <SelectItem value="mobile">Mobile Accessories</SelectItem>
                  <SelectItem value="stands">Stands & Mounts</SelectItem>
                  <SelectItem value="connectivity">Connectivity</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="website"
                placeholder="Website URL (optional)"
                value={formData.website}
                onChange={handleChange}
                type="url"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-3 sm:space-y-4">
            <Input
              name="location"
              placeholder="Location (City, State/Country)"
              value={formData.location}
              onChange={handleChange}
              className="text-sm sm:text-base h-10 sm:h-11"
            />
            <Textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
            />
            <Textarea
              name="notes"
              placeholder="Additional Notes (optional)"
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
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Save Supplier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
