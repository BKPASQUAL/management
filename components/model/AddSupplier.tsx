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
import { useAddSupplierMutation } from "@/store/services/api";
import { toast } from "react-toastify";

interface AddSupplierProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSupplier({ open, onClose }: AddSupplierProps) {
  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    email: "",
    phone: "",
    creditDays: "",
    address: "",
    notes: "",
  });

  const [addSupplier, { isLoading, error }] = useAddSupplierMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      supplierName: "",
      contactPerson: "",
      email: "",
      phone: "",
      creditDays: "",
      address: "",
      notes: "",
    });
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.supplierName.trim()) {
      toast.error("Supplier name is required!");
      return;
    }

    if (!formData.contactPerson.trim()) {
      toast.error("Contact person is required!");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    try {
      const supplierData = {
        supplier_name: formData.supplierName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone_number: formData.phone,
        credit_days: parseInt(formData.creditDays) || 0,
        address: formData.address,
        additional_notes: formData.notes || undefined,
      };

      const result = await addSupplier(supplierData).unwrap();

      // Show success toast
      toast.success("Supplier added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      resetForm();
      onClose();
    } catch (err: any) {
      console.error("Failed to add supplier:", err);

      // Show error toast with more specific message
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to add supplier. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <Input
                name="contactPerson"
                placeholder="Contact Person *"
                value={formData.contactPerson}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-11"
                required
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
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
                name="creditDays"
                placeholder="Credit Days"
                value={formData.creditDays}
                onChange={handleChange}
                type="number"
                min="0"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-3 sm:space-y-4">
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

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md">
              Failed to add supplier. Please check your input and try again.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isLoading}
              className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              {isLoading ? "Saving..." : "Save Supplier"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
