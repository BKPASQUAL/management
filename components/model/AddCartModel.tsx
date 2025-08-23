import React, { useState, useEffect } from "react";

// TypeScript interfaces
interface Product {
  id: number;
  name: string;
  price: string;
  packSize: string;
  remainingQty: number;
  image: string;
}

interface PackSize {
  size: string;
  basePrice: number;
  multiplier: number;
}

interface AddCartModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus, ShoppingCart } from "lucide-react";

// Sample pack sizes with different prices
const packSizes: PackSize[] = [
  { size: "200g", basePrice: 15.75, multiplier: 1 },
  { size: "250g", basePrice: 18.5, multiplier: 1.2 },
  { size: "500g", basePrice: 24.99, multiplier: 1.6 },
  { size: "750g", basePrice: 28.99, multiplier: 1.8 },
  { size: "1kg", basePrice: 32.0, multiplier: 2.0 },
];

export default function AddCartModal({
  open,
  onClose,
  product,
}: AddCartModalProps) {
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Reset state when modal opens with new product
  useEffect(() => {
    if (open && product) {
      setSelectedPackSize("");
      setQuantity(1);
      setTotalPrice(0);
    }
  }, [open, product]);

  // Calculate total price when pack size or quantity changes
  useEffect(() => {
    if (selectedPackSize) {
      const selectedPack = packSizes.find(
        (pack) => pack.size === selectedPackSize
      );
      if (selectedPack) {
        setTotalPrice(selectedPack.basePrice * quantity);
      }
    }
  }, [selectedPackSize, quantity]);

  const handleQuantityChange = (value: string) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    setQuantity(newQuantity);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (!selectedPackSize) {
      alert("Please select a pack size");
      return;
    }

    // Here you would typically add the item to your cart state/context
    const cartItem = {
      productId: product?.id,
      productName: product?.name,
      packSize: selectedPackSize,
      quantity: quantity,
      unitPrice: packSizes.find((pack) => pack.size === selectedPackSize)
        ?.basePrice,
      totalPrice: totalPrice,
      image: product?.image,
    };

    console.log("Adding to cart:", cartItem);

    // Close modal and reset
    onClose();

    // You could show a success message here
    alert(`Added ${quantity}x ${product?.name} (${selectedPackSize}) to cart!`);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add to Cart
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-start space-x-3 sm:space-x-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-tight">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Available: {product.remainingQty} units
              </p>
            </div>
          </div>

          {/* Pack Size Selection */}
          <div className="space-y-2">
            <Label htmlFor="pack-size" className="text-sm font-medium">
              Pack Size
            </Label>
            <Select
              value={selectedPackSize}
              onValueChange={setSelectedPackSize}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pack size" />
              </SelectTrigger>
              <SelectContent>
                {packSizes.map((pack) => (
                  <SelectItem key={pack.size} value={pack.size}>
                    <div className="flex justify-between items-center w-full">
                      <span>{pack.size}</span>
                      <span className="ml-4 text-sm text-gray-500">
                        Rs {pack.basePrice.toFixed(2)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity Selection */}
          <div className="flex justify-end">
            <div className="space-y-2 ">
              <Label htmlFor="quantity" className="text-sm font-medium flex justify-end">
                Quantity
              </Label>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-20 text-center"
                  min="1"
                  max={product.remainingQty}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.remainingQty}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Display */}
          {selectedPackSize && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Unit Price:</span>
                <span className="text-sm">
                  Rs{" "}
                  {packSizes
                    .find((pack) => pack.size === selectedPackSize)
                    ?.basePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Quantity:</span>
                <span className="text-sm">{quantity}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Price:</span>
                  <span className="font-semibold text-lg text-green-600">
                    Rs {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedPackSize}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
