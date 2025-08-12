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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] lg:!w-[705px] lg:!max-w-[90vw] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader className="">
          <DialogTitle className="text-lg sm:text-xl ">
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill in the details below to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <Input
                name="name"
                placeholder="Product Name *"
                value={formData.name}
                onChange={handleChange}
                className="col-span-full text-sm sm:text-base h-10 sm:h-10"
                required
              />
              <Input
                name="productCode"
                placeholder="Product Code"
                value={formData.productCode}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="supplierName"
                placeholder="Supplier Name"
                value={formData.supplierName}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-10"
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
              <Input
                name="costPrice"
                placeholder="Cost Price"
                value={formData.costPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="sellingPrice"
                placeholder="Selling Price *"
                value={formData.sellingPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                required
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="repCommission"
                placeholder="Rep Commission (%)"
                value={formData.repCommission}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="minimumSellingPrice"
                placeholder="Minimum Selling Price"
                value={formData.minimumSellingPrice}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />
            </div>
          </div>

          {/* Description and Notes */}
          <div className="space-y-3 sm:space-y-4">
            <Textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
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

          {/* Image Upload Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-sm font-medium text-gray-700">
                  Product Images
                </h3>
              </div>
              <span className="text-xs text-gray-500">{images.length}/6</span>
            </div>

            {/* Image Upload Area - Responsive Layout */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {/* Existing Images */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-20"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ))}

              {/* Upload New Image Button */}
              {images.length < 6 && (
                <div className="flex-shrink-0">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">
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

              {/* Placeholder slots to show available space - Hidden on mobile for cleaner look */}
              <div className="hidden sm:flex gap-2 sm:gap-3">
                {Array.from({ length: Math.max(0, 5 - images.length) }).map(
                  (_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed border-gray-200 bg-gray-25"
                    />
                  )
                )}
              </div>
            </div>

            {images.length >= 6 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 sm:p-3 rounded text-center sm:text-left">
                Maximum of 6 images allowed. Remove an image to add a new one.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto order-2 sm:order-1 h-10 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="w-full sm:w-auto order-1 sm:order-2 h-10 sm:h-10"
            >
              Save Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
