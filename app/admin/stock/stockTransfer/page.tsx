"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronsUpDown,
  MoveRight,
  Trash2,
  Package,
  Loader2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  useGetStockLocationsQuery,
  useGetStocksQuery,
  useCreateStockTransferMutation,
} from "@/store/services/stock";
import { toast } from "sonner";

// Updated interfaces to match your API response
interface Item {
  stock_id: number;
  item_code: string;
  item_name: string;
  quantity: number;
  location_id: number;
  supplier_name: string;
  item_id: number; // This should be the actual item_id from the items table
}

interface AddedItem extends Item {
  transfer_quantity: string;
  id: number;
}

interface CurrentItem {
  stock_id: number;
  item_code: string;
  item_name: string;
  quantity: number;
  location_id: number;
  supplier_name: string;
  transfer_quantity: string;
  item_id: number;
}

// Stock Location interface (matching your API response)
interface StockLocation {
  location_id: number;
  location_name: string;
}

// Transfer payload interface
interface StockTransferPayload {
  source_location_id: number;
  destination_location_id: number;
  transfer_date: string;
  items: {
    item_id: number;
    item_code: string;
    item_name: string;
    supplier_name: string;
    requested_quantity: number;
    unit_cost?: number;
    notes?: string;
  }[];
}

const StockTransfer: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [sourceLocation, setSourceLocation] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<string>("");
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    stock_id: 0,
    item_code: "",
    item_name: "",
    quantity: 0,
    location_id: 0,
    supplier_name: "",
    transfer_quantity: "",
    item_id: 0,
  });

  // Fetch stock locations from API
  const {
    data: stockLocationsResponse,
    isLoading: locationsLoading,
    error: locationsError,
  } = useGetStockLocationsQuery();

  // Fetch stocks from API
  const {
    data: stocksResponse,
    isLoading: stocksLoading,
    error: stocksError,
  } = useGetStocksQuery();

  // Create stock transfer mutation
  const [createStockTransfer, { isLoading: isSubmitting }] =
    useCreateStockTransferMutation();

  // Extract locations from API response
  const stockLocations = stockLocationsResponse?.data || [];

  // Extract and transform stocks from API response
  const allStocks = stocksResponse?.data || [];

  // Get items available in the selected source location only (excluding already added items)
  const availableItems: Item[] = useMemo(() => {
    if (!sourceLocation) return [];

    const addedItemCodes = addedItems.map((item) => item.item_code);

    return allStocks
      .filter(
        (stock) => stock.location.location_id.toString() === sourceLocation
      )
      .map((stock) => {
        console.log('Processing stock record:', stock); // Debug log
        return {
          stock_id: stock.stock_id,
          item_code: stock.item.item_code,
          item_name: stock.item.item_name,
          quantity: stock.quantity,
          location_id: stock.location.location_id,
          supplier_name: stock.item.supplier.supplier_name,
          // FIXED: Use the actual item_id from the stock record, not stock_id
          item_id: stock.item_id, // This should be the actual item_id from your database
        };
      })
      .filter((item) => !addedItemCodes.includes(item.item_code)); // Exclude already added items
  }, [allStocks, sourceLocation, addedItems]);

  const handleItemSelect = (itemCode: string): void => {
    const item = availableItems.find((i) => i.item_code === itemCode);
    console.log("Selected Item Code:", itemCode);
    console.log("Item Full Data:", item);

    if (item) {
      setCurrentItem({
        stock_id: item.stock_id,
        item_code: item.item_code,
        item_name: item.item_name,
        quantity: item.quantity,
        location_id: item.location_id,
        supplier_name: item.supplier_name,
        transfer_quantity: "",
        item_id: item.item_id, // Use the actual item_id
      });
      setSelectedItem(itemCode);
    }
  };

  // Updated date select handler to close the popover
  const handleDateSelect = (selectedDate: Date | undefined): void => {
    if (selectedDate) {
      setDate(selectedDate);
      setDatePickerOpen(false);
    }
  };

  // Handle source location change - reset destination and clear items
  const handleSourceLocationChange = (locationId: string): void => {
    console.log("Selected Source Location ID:", locationId);

    const selectedLocation = stockLocations.find(
      (loc) => loc.location_id.toString() === locationId
    );
    console.log("Source Location Data:", selectedLocation);

    setSourceLocation(locationId);

    if (destinationLocation === locationId) {
      setDestinationLocation("");
    }

    setCurrentItem({
      stock_id: 0,
      item_code: "",
      item_name: "",
      quantity: 0,
      location_id: 0,
      supplier_name: "",
      transfer_quantity: "",
      item_id: 0,
    });
    setSelectedItem("");
    setAddedItems([]);
    setOpen(false);
  };

  // Handle destination location change - reset source if same as destination
  const handleDestinationLocationChange = (locationId: string): void => {
    setDestinationLocation(locationId);
    // If source is the same as the new destination, reset source
    if (sourceLocation === locationId) {
      setSourceLocation("");
    }
  };

  // Get available locations for destination (exclude source location)
  const getAvailableDestinationLocations = (): StockLocation[] => {
    return stockLocations.filter(
      (location) => location.location_id.toString() !== sourceLocation
    );
  };

  // Get available locations for source (exclude destination location)
  const getAvailableSourceLocations = (): StockLocation[] => {
    return stockLocations.filter(
      (location) => location.location_id.toString() !== destinationLocation
    );
  };

  // Check if item is already added
  const isItemAlreadyAdded = (itemCode: string): boolean => {
    return addedItems.some((item) => item.item_code === itemCode);
  };

  const addItem = (): void => {
    if (
      currentItem.item_code &&
      currentItem.transfer_quantity &&
      parseInt(currentItem.transfer_quantity) > 0 &&
      parseInt(currentItem.transfer_quantity) <= currentItem.quantity &&
      !isItemAlreadyAdded(currentItem.item_code) // Additional check
    ) {
      const newItem: AddedItem = {
        ...currentItem,
        id: Date.now(),
      };
      setAddedItems([...addedItems, newItem]);
      setCurrentItem({
        stock_id: 0,
        item_code: "",
        item_name: "",
        quantity: 0,
        location_id: 0,
        supplier_name: "",
        transfer_quantity: "",
        item_id: 0,
      });
      setSelectedItem("");
      setOpen(false);
    }
  };

  const removeItem = (id: number): void => {
    setAddedItems(addedItems.filter((item) => item.id !== id));
  };

  const totalItems: number = addedItems.length;
  const totalQuantity: number = addedItems.reduce(
    (sum, item) => sum + parseInt(item.transfer_quantity || "0"),
    0
  );

  // Get location name by ID
  const getLocationName = (locationId: string): string => {
    const location = stockLocations.find(
      (loc) => loc.location_id.toString() === locationId
    );
    return location?.location_name || "";
  };

  // Check if transfer quantity is valid
  const isTransferQuantityValid = (): boolean => {
    const transferQty = parseInt(currentItem.transfer_quantity || "0");
    return transferQty > 0 && transferQty <= currentItem.quantity;
  };

  // Handle form submission
  const handleSubmitTransfer = async (): Promise<void> => {
    try {
      if (
        !date ||
        !sourceLocation ||
        !destinationLocation ||
        addedItems.length === 0
      ) {
        toast.error(
          "Please fill in all required fields and add at least one item"
        );
        return;
      }

      const payload: StockTransferPayload = {
        source_location_id: parseInt(sourceLocation),
        destination_location_id: parseInt(destinationLocation),
        transfer_date: date.toISOString(),
        items: addedItems.map((item) => ({
          // FIXED: Use the actual item_id, not stock_id
          item_id: item.item_id, // This is now the correct item_id from the items table
          item_code: item.item_code,
          item_name: item.item_name,
          supplier_name: item.supplier_name,
          requested_quantity: parseInt(item.transfer_quantity),
          unit_cost: 0, // You may want to add unit_cost field to the form
          notes: "", // You may want to add notes field to the form
        })),
      };
      console.log("Submitting Transfer Payload:", payload);

      const result = await createStockTransfer(payload).unwrap();

      toast.success("Stock transfer submitted successfully!");

      // Reset form
      setSourceLocation("");
      setDestinationLocation("");
      setDate(undefined);
      setAddedItems([]);
      setCurrentItem({
        stock_id: 0,
        item_code: "",
        item_name: "",
        quantity: 0,
        location_id: 0,
        supplier_name: "",
        transfer_quantity: "",
        item_id: 0,
      });
      setSelectedItem("");
    } catch (error: any) {
      console.error("Transfer submission failed:", error);
      toast.error(error?.data?.message || "Failed to submit transfer");
    }
  };

  // Handle save as draft (you can implement this based on your requirements)
  const handleSaveDraft = (): void => {
    // Implement draft saving logic here
    toast.info("Draft saved locally");
  };

  return (
    <div className="">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Stock Transfer
          </h1>

          {/* Transfer Details Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Source Location */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Location
              </label>
              <Select
                value={sourceLocation}
                onValueChange={handleSourceLocationChange}
                disabled={locationsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      locationsLoading ? "Loading..." : "Select source"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locationsError ? (
                    <SelectItem value="" disabled>
                      Error loading locations
                    </SelectItem>
                  ) : (
                    getAvailableSourceLocations().map((location) => (
                      <SelectItem
                        key={location.location_id}
                        value={location.location_id.toString()}
                      >
                        {location.location_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Arrow */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <MoveRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            {/* Destination Location */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Location
              </label>
              <Select
                value={destinationLocation}
                onValueChange={handleDestinationLocationChange}
                disabled={locationsLoading || !sourceLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      locationsLoading
                        ? "Loading..."
                        : !sourceLocation
                        ? "Select source first"
                        : "Select destination"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locationsError ? (
                    <SelectItem value="" disabled>
                      Error loading locations
                    </SelectItem>
                  ) : (
                    getAvailableDestinationLocations().map((location) => (
                      <SelectItem
                        key={location.location_id}
                        value={location.location_id.toString()}
                      >
                        {location.location_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Transfer Date - Fixed auto-close */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Date
              </label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status Indicator */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Draft</span>
              </div>
            </div>
          </div>

          {/* Transfer Route Display */}
          {sourceLocation && destinationLocation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="font-medium text-blue-900">
                  {getLocationName(sourceLocation)}
                </span>
                <MoveRight className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {getLocationName(destinationLocation)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Add Items Section */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add Items
          </h2>

          {!sourceLocation && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>
                Please select a source location first to view available items
              </p>
            </div>
          )}

          {sourceLocation && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Item Code/Search */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={stocksLoading || availableItems.length === 0}
                    >
                      {selectedItem ||
                        (stocksLoading
                          ? "Loading..."
                          : availableItems.length === 0
                          ? "No items available"
                          : "Select item...")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search items..." />
                      <CommandEmpty>
                        {stocksError
                          ? "Error loading items"
                          : "No items found or all items already added."}
                      </CommandEmpty>
                      <CommandGroup>
                        {availableItems.map((item) => (
                          <CommandItem
                            key={item.stock_id}
                            onSelect={() => handleItemSelect(item.item_code)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedItem === item.item_code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.item_code}
                              </span>
                              <span className="text-xs text-gray-500">
                                {item.item_name}
                              </span>
                              <span className="text-xs text-green-600">
                                Available: {item.quantity}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Item Name */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <Input
                  placeholder="Item name"
                  value={currentItem.item_name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Supplier */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <Input
                  placeholder="Supplier"
                  value={currentItem.supplier_name}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Available Stock */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available
                </label>
                <div className="flex items-center h-10 px-3 bg-green-50 border rounded-md">
                  <span className="text-sm font-medium text-green-700">
                    {currentItem.quantity || 0}
                  </span>
                </div>
              </div>

              {/* Transfer Quantity */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer Quantity
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max={currentItem.quantity}
                  value={currentItem.transfer_quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      transfer_quantity: e.target.value,
                    })
                  }
                  className={
                    currentItem.transfer_quantity && !isTransferQuantityValid()
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {currentItem.transfer_quantity &&
                  !isTransferQuantityValid() && (
                    <p className="text-xs text-red-500 mt-1">
                      Quantity must be between 1 and {currentItem.quantity}
                    </p>
                  )}
              </div>

              {/* Add Button */}
              <div className="lg:col-span-1">
                <Button
                  onClick={addItem}
                  disabled={
                    !currentItem.item_code ||
                    !currentItem.transfer_quantity ||
                    !isTransferQuantityValid() ||
                    isItemAlreadyAdded(currentItem.item_code)
                  }
                  className="w-full"
                >
                  Add Item
                </Button>
              </div>
            </div>
          )}

          {/* Show message when no items are available */}
          {sourceLocation && availableItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No items available in selected location</p>
              <p className="text-sm">
                {addedItems.length > 0
                  ? "All available items have been added to the transfer"
                  : "The selected location has no stock items"}
              </p>
            </div>
          )}
        </div>

        {/* Added Items Table */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Transfer Items
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Total Items: <span className="font-medium">{totalItems}</span>
              </span>
              <span>
                Total Quantity:{" "}
                <span className="font-medium">{totalQuantity}</span>
              </span>
            </div>
          </div>

          {addedItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No items added yet</p>
              <p className="text-sm">
                Use the form above to add items to transfer
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="w-1/6 text-left py-3 px-4 font-medium text-gray-900">
                      Item Code
                    </th>
                    <th className="w-2/6 text-left py-3 px-4 font-medium text-gray-900">
                      Item Name
                    </th>
                    <th className="w-1/6 text-left py-3 px-4 font-medium text-gray-900">
                      Supplier
                    </th>
                    <th className="w-1/8 text-right py-3 px-4 font-medium text-gray-900">
                      Available
                    </th>
                    <th className="w-1/8 text-right py-3 px-4 font-medium text-gray-900">
                      Transfer Qty
                    </th>
                    <th className="w-1/12 text-center py-3 px-4 font-medium text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {addedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td
                        className="w-1/6 py-3 px-4 font-medium truncate"
                        title={item.item_code}
                      >
                        {item.item_code}
                      </td>
                      <td
                        className="w-2/6 py-3 px-4 truncate"
                        title={item.item_name}
                      >
                        {item.item_name}
                      </td>
                      <td
                        className="w-1/6 py-3 px-4 truncate"
                        title={item.supplier_name}
                      >
                        {item.supplier_name}
                      </td>
                      <td className="w-1/8 py-3 px-4 text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="w-1/8 py-3 px-4 text-right font-medium">
                        {item.transfer_quantity}
                      </td>
                      <td className="w-1/12 py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary and Submit */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {totalItems}
                </div>
                <div className="text-sm text-gray-600">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {totalQuantity}
                </div>
                <div className="text-sm text-gray-600">Total Quantity</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              <Button
                size="lg"
                disabled={
                  addedItems.length === 0 ||
                  !sourceLocation ||
                  !destinationLocation ||
                  !date ||
                  isSubmitting
                }
                className="px-8"
                onClick={handleSubmitTransfer}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Transfer"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;