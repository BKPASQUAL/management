"use client";

import * as React from "react";
import { Plus, Search, AlertCircle, CheckCircle, Package2 } from "lucide-react";
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
import {
  useGetStocksDropdownQuery,
  StockDropdownItem,
} from "@/store/services/stock";
import { NewItemRow, Item } from "./types";

interface AddItemFormProps {
  newItem: NewItemRow;
  setNewItem: (item: NewItemRow) => void;
  itemCodeOpen: boolean;
  setItemCodeOpen: (open: boolean) => void;
  itemNameOpen: boolean;
  setItemNameOpen: (open: boolean) => void;
  onAddItem: (item: Item) => void;
  existingItems?: Item[]; // Track already added items
}

export default function AddItemForm({
  newItem,
  setNewItem,
  itemCodeOpen,
  setItemCodeOpen,
  itemNameOpen,
  setItemNameOpen,
  onAddItem,
  existingItems = [],
}: AddItemFormProps) {
  // Fetch stocks using the new dropdown API
  const {
    data: stocksResponse,
    error: stocksError,
    isLoading: stocksLoading,
    refetch: refetchStocks,
  } = useGetStocksDropdownQuery();

  // Extract stocks from API response
  const stocks = stocksResponse?.data || [];

  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Convert stock item to internal item format
  const convertStockToItem = (stock: StockDropdownItem) => ({
    item_id: stock.item_id,
    code: stock.item_code,
    name: stock.item_name,
    unit_price: stock.unit_price,
    selling_price: stock.selling_price,
    mrp: stock.mrp,
    supplier_name: stock.supplier_name,
    total_stock: stock.total_stock,
    locations: stock.locations,
    location_count: stock.location_count,
  });

  // Check if an item is already added
  const isItemAlreadyAdded = (itemCode: string): boolean => {
    return existingItems.some((item) => item.itemCode === itemCode);
  };

  // Get available quantity for the selected item
  const getAvailableQuantity = (): number => {
    if (!newItem.itemCode) return 0;

    const selectedStock = stocks.find(
      (stock) => stock.item_code === newItem.itemCode
    );

    return selectedStock ? selectedStock.total_stock : 0;
  };

  // Get selected stock details for display
  const getSelectedStockDetails = (): StockDropdownItem | null => {
    if (!newItem.itemCode) return null;

    return stocks.find((stock) => stock.item_code === newItem.itemCode) || null;
  };

  // Filter stocks to exclude already added items
  const availableStocks = stocks.filter(
    (stock) => !isItemAlreadyAdded(stock.item_code) && stock.total_stock > 0
  );

  const handleItemCodeSelect = (code: string) => {
    const selectedStock = stocks.find((stock) => stock.item_code === code);
    if (selectedStock) {
      const item = convertStockToItem(selectedStock);
      setNewItem({
        ...newItem,
        itemCode: code,
        itemName: item.name,
        price: item.selling_price.toString(), // Use selling price as default
        unit: "pcs", // Default unit, you might want to get this from your items table
      });
    }
    setItemCodeOpen(false);
  };

  const handleItemNameSelect = (name: string) => {
    const selectedStock = stocks.find((stock) => stock.item_name === name);
    if (selectedStock) {
      const item = convertStockToItem(selectedStock);
      setNewItem({
        ...newItem,
        itemCode: item.code,
        itemName: name,
        price: item.selling_price.toString(),
        unit: "pcs",
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
      // Check if item is already added
      if (isItemAlreadyAdded(newItem.itemCode)) {
        alert("This item has already been added to the invoice!");
        return;
      }

      const price = parseFloat(newItem.price) || 0;
      const quantity = parseFloat(newItem.quantity) || 0;
      const discount = parseFloat(newItem.discount) || 0;
      const freeItemQuantity = parseFloat(newItem.freeItemQuantity) || 0;

      // Check available quantity
      const availableQty = getAvailableQuantity();
      if (quantity > availableQty) {
        alert(`Insufficient stock! Available quantity: ${availableQty}`);
        return;
      }

      const selectedStock = stocks.find(
        (stock) => stock.item_code === newItem.itemCode
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
        category: "Stock Item", // You might want to add category to your stock API
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

  const selectedStockDetails = getSelectedStockDetails();

  return (
    <div>
      {/* Stock API Error Display */}
      {stocksError && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load stock data from API</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refetchStocks}
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
            Add New Item from Stock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Item Code</Label>
              <Popover open={itemCodeOpen} onOpenChange={setItemCodeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-10"
                    disabled={stocksLoading}
                  >
                    <span className="truncate">
                      {newItem.itemCode ||
                        (stocksLoading ? "Loading..." : "Select code...")}
                    </span>
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search by item code..." />
                    <CommandList>
                      <CommandEmpty>
                        {stocksLoading
                          ? "Loading stock data..."
                          : availableStocks.length === 0
                          ? "No items with stock available"
                          : "No item found."}
                      </CommandEmpty>
                      {!stocksLoading && availableStocks.length > 0 && (
                        <CommandGroup>
                          {availableStocks.map((stock) => (
                            <CommandItem
                              key={stock.item_id}
                              value={stock.item_code}
                              onSelect={() =>
                                handleItemCodeSelect(stock.item_code)
                              }
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">
                                    {stock.item_code}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-green-600"
                                  >
                                    Stock: {stock.total_stock}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">
                                  {stock.item_name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-600 font-medium">
                                    ${stock.selling_price.toFixed(2)}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {stock.supplier_name}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {stock.location_count} locations
                                  </Badge>
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
                    disabled={stocksLoading}
                  >
                    <span className="truncate">
                      {newItem.itemName ||
                        (stocksLoading ? "Loading..." : "Select item...")}
                    </span>
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Search by item name..." />
                    <CommandList>
                      <CommandEmpty>
                        {stocksLoading
                          ? "Loading stock data..."
                          : availableStocks.length === 0
                          ? "No items with stock available"
                          : "No item found."}
                      </CommandEmpty>
                      {!stocksLoading && availableStocks.length > 0 && (
                        <CommandGroup>
                          {availableStocks.map((stock) => (
                            <CommandItem
                              key={stock.item_id}
                              value={stock.item_name}
                              onSelect={() =>
                                handleItemNameSelect(stock.item_name)
                              }
                            >
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">
                                    {stock.item_name}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-green-600"
                                  >
                                    Stock: {stock.total_stock}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">
                                  {stock.item_code}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-600 font-medium">
                                    ${stock.selling_price.toFixed(2)}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {stock.supplier_name}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {stock.location_count} locations
                                  </Badge>
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
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Available Stock</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-gray-100 flex items-center font-medium text-blue-600 border-blue-200">
                <Package2 className="h-4 w-4 mr-2 text-green-500" />
                {getAvailableQuantity() || 0}
                {selectedStockDetails &&
                  selectedStockDetails.location_count > 1 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {selectedStockDetails.location_count} locations
                    </Badge>
                  )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Quantity</Label>
              <Input
                type="number"
                placeholder="1"
                value={newItem.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="h-10"
                min="1"
                max={getAvailableQuantity()}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Unit</Label>
              <Input
                value={newItem.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className="h-10"
                placeholder="Unit type (e.g., pcs, kg)"
              />
            </div>
          </div>

          {/* Stock Location Details
          {selectedStockDetails && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Package2 className="h-4 w-4 text-blue-600" />
                <Label className="text-sm font-medium text-blue-800">
                  Stock Location Details
                </Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Supplier:</span>
                  <p className="font-medium">
                    {selectedStockDetails.supplier_name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Unit Price:</span>
                  <p className="font-medium">
                    ${selectedStockDetails.unit_price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">MRP:</span>
                  <p className="font-medium">
                    ${selectedStockDetails.mrp.toFixed(2)}
                  </p>
                </div>
              </div>
              {selectedStockDetails.locations.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-600 text-xs">Locations:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStockDetails.locations.map((location, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {location.location_name}: {location.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )} */}

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Discount (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.discount}
                onChange={(e) => handleInputChange("discount", e.target.value)}
                className="h-10"
                min="0"
                max="100"
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
                min="0"
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
                  stocksLoading ||
                  isItemAlreadyAdded(newItem.itemCode) ||
                  parseFloat(newItem.quantity) > getAvailableQuantity()
                }
                className="w-full bg-blue-600 hover:bg-blue-700 h-10"
              >
                <Plus className="h-4 w-4 " />
                {isItemAlreadyAdded(newItem.itemCode)
                  ? "Already Added"
                  : "Add Item"}
              </Button>
            </div>
          </div>

          {/* Validation Messages */}
          {newItem.itemCode && isItemAlreadyAdded(newItem.itemCode) && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span>This item has already been added to the invoice</span>
            </div>
          )}

          {newItem.quantity &&
            parseFloat(newItem.quantity) > getAvailableQuantity() && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Quantity exceeds available stock ({getAvailableQuantity()}{" "}
                  available)
                </span>
              </div>
            )}

          {getAvailableQuantity() === 0 && newItem.itemCode && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>This item is out of stock</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
