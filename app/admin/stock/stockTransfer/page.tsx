"use client";

import React, { useState } from "react";
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
import { useGetStockLocationsQuery } from "@/store/services/stock";

// Define interfaces for type safety
interface Item {
  code: string;
  name: string;
  packType: string;
  availableStock: number;
}

interface AddedItem extends Item {
  quantity: string;
  id: number;
}

interface CurrentItem {
  code: string;
  name: string;
  packType: string;
  quantity: string;
}

// Stock Location interface (matching your API response)
interface StockLocation {
  location_id: number;
  location_name: string;
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
    code: "",
    name: "",
    packType: "",
    quantity: "",
  });

  // Fetch stock locations from API
  const {
    data: stockLocationsResponse,
    isLoading: locationsLoading,
    error: locationsError,
  } = useGetStockLocationsQuery();

  // Extract locations from API response
  const stockLocations = stockLocationsResponse?.data || [];

  // Sample data with proper typing (you might want to fetch this from API too)
  const items: Item[] = [
    { code: "ITM001", name: "Rice 5KG", packType: "Bag", availableStock: 150 },
    {
      code: "ITM002",
      name: "Wheat Flour",
      packType: "Pack",
      availableStock: 75,
    },
    {
      code: "ITM003",
      name: "Sugar 1KG",
      packType: "Pack",
      availableStock: 200,
    },
    {
      code: "ITM004",
      name: "Oil 500ML",
      packType: "Bottle",
      availableStock: 89,
    },
  ];

  const handleItemSelect = (itemCode: string): void => {
    const item = items.find((i) => i.code === itemCode);
    if (item) {
      setCurrentItem({
        code: item.code,
        name: item.name,
        packType: item.packType,
        quantity: "",
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

  // Handle source location change - reset destination if same as source
  const handleSourceLocationChange = (locationId: string): void => {
    setSourceLocation(locationId);
    // If destination is the same as the new source, reset destination
    if (destinationLocation === locationId) {
      setDestinationLocation("");
    }
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

  const addItem = (): void => {
    if (
      currentItem.code &&
      currentItem.quantity &&
      parseInt(currentItem.quantity) > 0
    ) {
      const selectedItemData = items.find((i) => i.code === currentItem.code);
      const newItem: AddedItem = {
        ...currentItem,
        availableStock: selectedItemData?.availableStock || 0,
        id: Date.now(),
      };
      setAddedItems([...addedItems, newItem]);
      setCurrentItem({ code: "", name: "", packType: "", quantity: "" });
      setSelectedItem("");
      setOpen(false);
    }
  };

  const removeItem = (id: number): void => {
    setAddedItems(addedItems.filter((item) => item.id !== id));
  };

  const totalItems: number = addedItems.length;
  const totalQuantity: number = addedItems.reduce(
    (sum, item) => sum + parseInt(item.quantity || "0"),
    0
  );

  // Get location name by ID
  const getLocationName = (locationId: string): string => {
    const location = stockLocations.find(
      (loc) => loc.location_id.toString() === locationId
    );
    return location?.location_name || "";
  };

  return (
    <div className="">
      <div className="max-w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add Items
          </h2>

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
                  >
                    {selectedItem || "Select item..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search items..." />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          key={item.code}
                          onSelect={() => handleItemSelect(item.code)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedItem === item.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{item.code}</span>
                            <span className="text-xs text-gray-500">
                              {item.name}
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
                value={currentItem.name}
                readOnly
                className="bg-gray-50"
              />
            </div>

            {/* Pack Type */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pack Type
              </label>
              <Input
                placeholder="Pack type"
                value={currentItem.packType}
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
                  {items.find((i) => i.code === currentItem.code)
                    ?.availableStock || 0}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, quantity: e.target.value })
                }
              />
            </div>

            {/* Add Button */}
            <div className="lg:col-span-1">
              <Button
                onClick={addItem}
                disabled={!currentItem.code || !currentItem.quantity}
                className="w-full"
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Added Items Table - Balanced Column Widths */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                    <th className="w-1/5 text-left py-3 px-4 font-medium text-gray-900">
                      Item Code
                    </th>
                    <th className="w-2/5 text-left py-3 px-4 font-medium text-gray-900">
                      Item Name
                    </th>
                    <th className="w-1/5 text-left py-3 px-4 font-medium text-gray-900">
                      Pack Type
                    </th>
                    <th className="w-1/6 text-right py-3 px-4 font-medium text-gray-900">
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
                        className="w-1/5 py-3 px-4 font-medium truncate"
                        title={item.code}
                      >
                        {item.code}
                      </td>
                      <td
                        className="w-2/5 py-3 px-4 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </td>
                      <td
                        className="w-1/5 py-3 px-4 truncate"
                        title={item.packType}
                      >
                        {item.packType}
                      </td>
                      <td className="w-1/6 py-3 px-4 text-right font-medium">
                        {item.quantity}
                      </td>
                      <td className="w-1/12 py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        <div className="bg-white rounded-lg shadow-sm p-6">
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
              <Button variant="outline" size="lg">
                Save Draft
              </Button>
              <Button
                size="lg"
                disabled={
                  addedItems.length === 0 ||
                  !sourceLocation ||
                  !destinationLocation ||
                  !date
                }
                className="px-8"
              >
                Submit Transfer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;
