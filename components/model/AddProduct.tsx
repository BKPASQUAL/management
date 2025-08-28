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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { useGetDropdownSuppliersQuery } from "@/store/services/supplier";
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications
import { useCreateProductMutation } from "@/store/services/product";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  open,
  onClose,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    item_name: "",
    item_code: "",
    category_id: "",
    unit_type: "",
    unit_quantity: "1",
    supplier_id: "",
    supplierName: "",
    cost_price: "",
    mrp: "",
    selling_price: "",
    description: "",
    rep_commision: "",
    minimum_selling_price: "",
    additional_notes: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: suppliers, isLoading: suppliersLoading } =
    useGetDropdownSuppliersQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  // Unit types for the dropdown
  const unitTypes = [
    { value: "pcs", label: "Pieces (pcs)" },
    { value: "dz", label: "Dozen (dz)" },
    { value: "m", label: "Meters (m)" },
    { value: "pack", label: "Pack" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "cost_price",
        "selling_price",
        "minimum_selling_price",
        "rep_commision",
        "unit_quantity",
      ].includes(name)
    ) {
      const numericValue = value.replace(/[^0-9.]/g, "");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 6 - images.length;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length === 0) return;

    const newImages = [...images, ...filesToAdd];
    setImages(newImages);

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
      item_name: "",
      item_code: "",
      category_id: "",
      unit_type: "",
      unit_quantity: "1",
      supplierName: "",
      supplier_id: "",
      cost_price: "",
      mrp: "",
      selling_price: "",
      description: "",
      rep_commision: "",
      minimum_selling_price: "",
      additional_notes: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const uploadImages = async (productImages: File[]): Promise<string[]> => {
    // This is a placeholder for your image upload logic
    // You'll need to implement actual image upload to your backend/cloud storage
    // For now, returning mock image paths
    return productImages.map(
      (file, index) => `${Date.now()}-${index}-${file.name}`
    );
  };

  const handleSave = async () => {
    try {
      // Upload images first (if any)
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages(images);
      }

      // Prepare the product data according to your API interface
      const productData = {
        item_name: formData.item_name.trim(),
        item_code: formData.item_code.trim() || undefined, // Let backend auto-generate if empty
        description: formData.description.trim(),
        additional_notes: formData.additional_notes.trim(),
        mrp: formData.mrp || "0", // Keep as string
        cost_price: parseFloat(formData.cost_price) || 0,
        selling_price: parseFloat(formData.selling_price),
        rep_commision: parseFloat(formData.rep_commision) || 0,
        minimum_selling_price:
          parseFloat(formData.minimum_selling_price) ||
          parseFloat(formData.selling_price),
        unit_type: formData.unit_type,
        unit_quantity: parseInt(formData.unit_quantity) || 1,
        supplier_id: parseInt(formData.supplier_id),
        category_id: parseInt(formData.category_id) || 1, // You might want to add category selection
        images: imageUrls,
      };

      await createProduct(productData).unwrap();

      toast.success("Product created successfully!");
      resetForm();
      onClose();
      console.log("data", productData);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    formData.item_name.trim() &&
    formData.selling_price.trim() &&
    formData.supplier_id;

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] lg:!w-[705px] lg:!max-w-[705px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill in the details below to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 sm:space-y-3 ">
          {/* Basic Information */}
          <div className="space-y-3 sm:space-y-3">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              <Input
                name="item_name"
                placeholder="Product Name *"
                value={formData.item_name}
                onChange={handleChange}
                className="col-span-full text-sm sm:text-base h-10 sm:h-10"
                required
              />
              <Input
                name="item_code"
                placeholder="Product Code (auto-generated if empty)"
                value={formData.item_code}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="category_id"
                placeholder="Category ID"
                value={formData.category_id}
                onChange={handleChange}
                className="text-sm sm:text-base h-10 sm:h-10"
                type="number"
              />
              <div className="flex gap-x-2">
                <Select
                  value={formData.unit_type}
                  onValueChange={(value) =>
                    handleSelectChange("unit_type", value)
                  }
                >
                  <SelectTrigger className="text-sm sm:text-base h-10 sm:h-10 w-full">
                    <SelectValue placeholder="Select Unit Type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {unitTypes.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  name="unit_quantity"
                  placeholder="Quantity"
                  value={formData.unit_quantity}
                  onChange={handleChange}
                  className="text-sm sm:text-base h-9 sm:h-9 text-end"
                  min="1"
                />
              </div>

              <Select
                value={formData.supplier_id}
                onValueChange={(value) => {
                  const selectedSupplier = suppliers?.find(
                    (s) => s.supplier_id?.toString() === value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    supplier_id: value,
                    supplierName: selectedSupplier?.supplier_name || "",
                  }));
                }}
                required
              >
                <SelectTrigger className="text-sm sm:text-base h-10 sm:h-10 w-full">
                  <SelectValue placeholder="Select Supplier *" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {suppliersLoading && (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  )}
                  {suppliers?.map((supplier) => (
                    <SelectItem
                      key={supplier.supplier_id}
                      value={supplier.supplier_id?.toString() || ""}
                    >
                      {supplier.supplier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-3 sm:space-y-3">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <Input
                name="mrp"
                placeholder="MRP"
                value={formData.mrp}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />

              <div className="flex gap-x-2">
                <Input
                  name="cost_price"
                  placeholder="Cost Price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  type="text"
                  inputMode="decimal"
                  className="text-sm sm:text-base h-10 sm:h-10"
                />
                <Input
                  name="selling_price"
                  placeholder="Selling Price *"
                  value={formData.selling_price}
                  onChange={handleChange}
                  type="text"
                  inputMode="decimal"
                  required
                  className="text-sm sm:text-base h-10 sm:h-10"
                />
              </div>
              <Input
                name="minimum_selling_price"
                placeholder="Minimum Selling Price"
                value={formData.minimum_selling_price}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />
              <Input
                name="rep_commision"
                placeholder="Rep Commission (%)"
                value={formData.rep_commision}
                onChange={handleChange}
                type="text"
                inputMode="decimal"
                className="text-sm sm:text-base h-10 sm:h-10"
              />
            </div>
          </div>

          {/* Description and Notes */}
          <div className="space-y-3 sm:space-y-3">
            <Textarea
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none"
            />
            <Textarea
              name="additional_notes"
              placeholder="Additional Notes (optional)"
              value={formData.additional_notes}
              onChange={handleChange}
              className="min-h-[60px] sm:min-h-[80px] text-sm sm:text-base resize-none"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-sm font-medium text-gray-700">
                  Product Images
                </h3>
              </div>
              <span className="text-xs text-gray-500">{images.length}/6</span>
            </div>

            {/* Image Upload Area - Mobile Optimized */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {/* Existing Images */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 shadow-lg z-20"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                </div>
              ))}

              {/* Upload New Image Button */}
              {images.length < 6 && (
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400 mb-0.5" />
                    <span className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 text-center leading-tight">
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

              {/* Placeholder slots - Only show on larger screens */}
              <div className="hidden lg:flex gap-3">
                {Array.from({ length: Math.max(0, 5 - images.length) }).map(
                  (_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 bg-gray-25"
                    />
                  )
                )}
              </div>
            </div>

            {images.length >= 6 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 sm:p-3 rounded text-center">
                Maximum of 6 images allowed. Remove an image to add a new one.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto h-10"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || isCreating}
              className="w-full sm:w-auto h-10"
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
