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
import { Upload, X, Camera } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCustomerProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCustomer({ open, onClose }: AddCustomerProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerCode: "",
    contactPerson: "",
    email: "",
    phone: "",
    area: "",
    route: "",
    representative: "",
    address: "",
    website: "",
    notes: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      area: value,
    }));
  };

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      route: value,
    }));
  };

  const handleRepresentativeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      representative: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerCode: "",
      contactPerson: "",
      email: "",
      phone: "",
      area: "",
      route: "",
      representative: "",
      address: "",
      website: "",
      notes: "",
    });
  };

  const handleSave = () => {
    const customerData = {
      ...formData,
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
    formData.contactPerson.trim() &&
    formData.email.trim() &&
    formData.area.trim() &&
    formData.representative.trim();

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-[600px] sm:max-w-[600px] lg:w-[705px] lg:max-w-[705px] max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6 mx-auto my-auto">
        <DialogHeader className="">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Customer
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill in the details below to add a new customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <Input
                name="customerName"
                placeholder="Customer Name *"
                value={formData.customerName}
                onChange={handleChange}
                className="col-span-full text-sm sm:text-base h-10 sm:h-11"
                required
              />
              <Input
                name="customerCode"
                placeholder="Customer Code"
                value={formData.customerCode}
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
              <Input
                name="website"
                placeholder="Website URL (optional)"
                value={formData.website}
                onChange={handleChange}
                type="url"
                className="col-span-full sm:col-span-2 text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-3 sm:space-y-4">
            {/* <h3 className="text-sm sm:text-base font-medium text-gray-900">Business Information</h3> */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                onValueChange={handleAreaChange}
                value={formData.area}
              >
                <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                  <SelectValue placeholder="Select Area *" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
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
                  <SelectItem value="trincomalee">Trincomalee</SelectItem>
                  <SelectItem value="badulla">Badulla</SelectItem>
                  <SelectItem value="polonnaruwa">Polonnaruwa</SelectItem>
                  <SelectItem value="hambantota">Hambantota</SelectItem>
                  <SelectItem value="kalutara">Kalutara</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={handleRouteChange}
                value={formData.route}
              >
                <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="route-a1">Route A1</SelectItem>
                  <SelectItem value="route-a2">Route A2</SelectItem>
                  <SelectItem value="route-a3">Route A3</SelectItem>
                  <SelectItem value="route-b1">Route B1</SelectItem>
                  <SelectItem value="route-b2">Route B2</SelectItem>
                  <SelectItem value="route-c1">Route C1</SelectItem>
                  <SelectItem value="route-c2">Route C2</SelectItem>
                  <SelectItem value="route-d1">Route D1</SelectItem>
                  <SelectItem value="route-e1">Route E1</SelectItem>
                  <SelectItem value="route-f1">Route F1</SelectItem>
                  <SelectItem value="route-g1">Route G1</SelectItem>
                  <SelectItem value="route-g2">Route G2</SelectItem>
                  <SelectItem value="route-h1">Route H1</SelectItem>
                  <SelectItem value="route-j1">Route J1</SelectItem>
                  <SelectItem value="route-k1">Route K1</SelectItem>
                  <SelectItem value="route-k2">Route K2</SelectItem>
                  <SelectItem value="route-ku1">Route KU1</SelectItem>
                  <SelectItem value="route-m1">Route M1</SelectItem>
                  <SelectItem value="route-n1">Route N1</SelectItem>
                  <SelectItem value="route-n3">Route N3</SelectItem>
                  <SelectItem value="route-r1">Route R1</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={handleRepresentativeChange}
                value={formData.representative}
              >
                <SelectTrigger className="text-sm sm:text-base h-10 sm:h-11 w-full">
                  <SelectValue placeholder="Assign Representative *" />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  <SelectItem value="john-silva">John Silva</SelectItem>
                  <SelectItem value="mary-fernando">Mary Fernando</SelectItem>
                  <SelectItem value="david-perera">David Perera</SelectItem>
                  <SelectItem value="sarah-desilva">Sarah De Silva</SelectItem>
                  <SelectItem value="michael-jayawardena">Michael Jayawardena</SelectItem>
                  <SelectItem value="priya-wijesinghe">Priya Wijesinghe</SelectItem>
                  <SelectItem value="kevin-rajapakse">Kevin Rajapakse</SelectItem>
                  <SelectItem value="nimal-gunasekara">Nimal Gunasekara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-3 sm:space-y-4">
            {/* <h3 className="text-sm sm:text-base font-medium text-gray-900">Address Information</h3> */}
            <Textarea
              name="address"
              placeholder="Full Business Address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
            />
            <Textarea
              name="notes"
              placeholder="Additional Notes (Business requirements, special instructions, etc.)"
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
              Add Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}