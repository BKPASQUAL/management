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

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  open,
  onClose,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    supplierName: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
    repCommission: "",
    minimumSellingPrice: "",
    notes: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (
      [
        "costPrice",
        "sellingPrice",
        "minimumSellingPrice",
        "repCommission",
      ].includes(name)
    ) {
      // Allow only numbers and decimal point
      const numericValue = value.replace(/[^0-9.]/g, "");
      // Prevent multiple decimal points
      const decimalCount = (numericValue.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding new images would exceed the limit of 6
    const availableSlots = 6 - images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length === 0) return;

    // Add new images to existing ones
    const newImages = [...images, ...filesToAdd];
    setImages(newImages);

    // Create previews for new images
    const newPreviews = [...imagePreviews];
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newPreviews.push(result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      productCode: "",
      supplierName: "",
      costPrice: "",
      sellingPrice: "",
      description: "",
      repCommission: "",
      minimumSellingPrice: "",
      notes: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleSave = () => {
    const productData = {
      ...formData,
      images: images,
    };
    console.log("Product added:", productData);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid = formData.name.trim() && formData.sellingPrice.trim();

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="!w-[700px] !max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            {/* <h3 className="text-sm font-medium text-gray-700">
              Basic Information
            </h3> */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Input
                name="name"
                placeholder="Product Name *"
                value={formData.name}
                onChange={handleChange}
                className="col-span-full"
                required
              />
              <Input
                name="productCode"
                placeholder="Product Code"
                value={formData.productCode}
                onChange={handleChange}
              />
              <Input
                name="supplierName"
                placeholder="Supplier Name"
                value={formData.supplierName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            {/* <h3 className="text-sm font-medium text-gray-700">
              Pricing Information
            </h3> */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Input
                name="costPrice"
                placeholder="Cost Price"
                value={formData.costPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
              />
              <Input
                name="sellingPrice"
                placeholder="Selling Price *"
                value={formData.sellingPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                required
              />
              <Input
                name="repCommission"
                placeholder="Rep Commission (%)"
                value={formData.repCommission}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
              />
              <Input
                name="minimumSellingPrice"
                placeholder="Minimum Selling Price"
                value={formData.minimumSellingPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Description and Notes */}
          <div className="space-y-4">
            {/* <h3 className="text-sm font-medium text-gray-700">
              Additional Details
            </h3> */}
            <Textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px]"
            />
            <Textarea
              name="notes"
              placeholder="Additional Notes (optional)"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[80px]"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <h3 className="text-sm font-medium text-gray-700">
                  Product Images
                </h3>
              </div>
              <span className="text-xs text-gray-500">{images.length}/6</span>
            </div>

            {/* Image Upload Area - Horizontal Layout */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {/* Existing Images */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 group">
                  <div className="w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Upload New Image Button */}
              {images.length < 6 && (
                <div className="flex-shrink-0">
                  <div
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500 text-center leading-tight">
                      Add
                      <br />
                      Image
                    </span>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                </div>
              )}

              {/* Placeholder slots to show available space */}
              {Array.from({ length: Math.max(0, 5 - images.length) }).map(
                (_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 bg-gray-25"
                  />
                )
              )}
            </div>

            {images.length >= 6 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                Maximum of 6 images allowed. Remove an image to add a new one.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              Save Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
