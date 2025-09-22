"use client";

import * as React from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { BillProduct } from "@/store/services/product";
import { NewItemRow, Item } from "./types";

interface AddItemFormProps {
  products: BillProduct[];
  productsLoading: boolean;
  productsError: any;
  refetchProducts: () => void;
  newItem: NewItemRow;
  setNewItem: (item: NewItemRow) => void;
  itemCodeOpen: boolean;
  setItemCodeOpen: (open: boolean) => void;
  itemNameOpen: boolean;
  setItemNameOpen: (open: boolean) => void;
  onAddItem: (item: Item) => void;
}

export default function AddItemForm({
  products,
  productsLoading,
  productsError,
  refetchProducts,
  newItem,
  setNewItem,
  itemCodeOpen,
  setItemCodeOpen,
  itemNameOpen,
  setItemNameOpen,
  onAddItem,
}: AddItemFormProps) {
  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const convertProductToItem = (product: BillProduct) => ({
    code: product.item_code,
    name: product.item_name,
    price: parseFloat(product.selling_price),
    category: product.category_name,
    unit: product.unit_type,
    description: product.description,
    mrp: product.mrp,
  });

  const handleItemCodeSelect = (code: string) => {
    const selectedProduct = products.find(
      (product) => product.item_code === code
    );
    if (selectedProduct) {
      const item = convertProductToItem(selectedProduct);
      setNewItem({
        ...newItem,
        itemCode: code,
        itemName: item.name,
        price: item.price.toString(),
        unit: item.unit,
      });
    }
    setItemCodeOpen(false);
  };

  const handleItemNameSelect = (name: string) => {
    const selectedProduct = products.find(
      (product) => product.item_name === name
    );
    if (selectedProduct) {
      const item = convertProductToItem(selectedProduct);
      setNewItem({
        ...newItem,
        itemCode: item.code,
        itemName: name,
        price: item.price.toString(),
        unit: item.unit,
      });
    }
    setItemNameOpen(false);
  };

  const handleInputChange = (field: keyof NewItemRow, value: string) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const addItem = () => {
    if (
      newItem.itemCode &&
      newItem.itemName &&
      newItem.price &&
      newItem.quantity &&
      newItem.unit
    ) {
      const price = parseFloat(newItem.price) || 0;
      const quantity = parseFloat(newItem.quantity) || 0;
      const discount = parseFloat(newItem.discount) || 0;
      const freeItemQuantity = parseFloat(newItem.freeItemQuantity) || 0;

      const selectedProduct = products.find(
        (product) => product.item_code === newItem.itemCode
      );

      const item: Item = {
        id: Date.now(),
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        price,
        quantity,
        unit: newItem.unit,
        discount,
        amount: calculateAmount(price, quantity, discount),
        freeItemQuantity,
        category: selectedProduct?.category_name || "Other",
      };

      onAddItem(item);
      setNewItem({
        itemCode: "",
        itemName: "",
        price: "",
        quantity: "",
        unit: "",
        discount: "",
        freeItemQuantity: "",
      });
    }
  };

  return (
    <div>
      {/* Products API Error Display */}
      {productsError && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load products from API</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetchProducts}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Add New Item Form */}
      <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Item Code</Label>
              <Popover open={itemCodeOpen} onOpenChange={setItemCodeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-10"
                    disabled={productsLoading}
                  >
                    <span className="truncate">
                      {newItem.itemCode ||
                        (productsLoading ? "Loading..." : "Select code...")}
                    </span>
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                      <CommandEmpty>
                        {productsLoading
                          ? "Loading products..."
                          : "No item found."}
                      </CommandEmpty>
                      {!productsLoading && products.length > 0 && (
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.item_uuid}
                              value={product.item_code}
                              onSelect={() =>
                                handleItemCodeSelect(product.item_code)
                              }
                            >
                              <div className="flex-1">
                                <p className="font-medium">
                                  {product.item_code}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.item_name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {product.category_name}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {product.unit_type}
                                  </Badge>
                                  <span className="text-xs text-green-600 font-medium">
                                    $
                                    {parseFloat(
                                      product.selling_price
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Item Name</Label>
              <Popover open={itemNameOpen} onOpenChange={setItemNameOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-10"
                    disabled={productsLoading}
                  >
                    <span className="truncate">
                      {newItem.itemName ||
                        (productsLoading ? "Loading..." : "Select item...")}
                    </span>
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandList>
                      <CommandEmpty>
                        {productsLoading
                          ? "Loading products..."
                          : "No item found."}
                      </CommandEmpty>
                      {!productsLoading && products.length > 0 && (
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.item_uuid}
                              value={product.item_name}
                              onSelect={() =>
                                handleItemNameSelect(product.item_name)
                              }
                            >
                              <div className="flex-1">
                                <p className="font-medium">
                                  {product.item_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.item_code}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {product.category_name}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {product.unit_type}
                                  </Badge>
                                  <span className="text-xs text-green-600 font-medium">
                                    $
                                    {parseFloat(
                                      product.selling_price
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Unit Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newItem.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Quantity</Label>
              <Input
                type="number"
                placeholder="1"
                value={newItem.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", e.target.value)
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Unit</Label>
              <Input
                value={newItem.unit}
                className="h-10 bg-gray-50"
                placeholder="Unit type"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Discount (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.discount}
                onChange={(e) =>
                  handleInputChange("discount", e.target.value)
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Free Items</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.freeItemQuantity}
                onChange={(e) =>
                  handleInputChange("freeItemQuantity", e.target.value)
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Amount</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center font-medium text-green-600">
                $
                {newItem.price && newItem.quantity
                  ? calculateAmount(
                      parseFloat(newItem.price) || 0,
                      parseFloat(newItem.quantity) || 0,
                      parseFloat(newItem.discount) || 0
                    ).toFixed(2)
                  : "0.00"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Actions</Label>
              <Button
                onClick={addItem}
                disabled={
                  !newItem.itemCode ||
                  !newItem.itemName ||
                  !newItem.price ||
                  !newItem.quantity ||
                  !newItem.unit ||
                  productsLoading
                }
                className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}