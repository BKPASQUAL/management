"use client";

import * as React from "react";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

interface Item {
  id: number;
  itemCode: string;
  itemName: string;
  price: number;
  quantity: number;
  discount: number;
  amount: number;
  freeItemQuantity?: number;
}

interface ItemFormData {
  itemCode: string;
  itemName: string;
  price: string;
  quantity: string;
  discount: string;
  freeItemQuantity: string;
}

export default function DatePickerPage() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [billNo, setBillNo] = React.useState<string>("");
  const [billingDate, setBillingDate] = React.useState<Date | undefined>();
  const [receivedDate, setReceivedDate] = React.useState<Date | undefined>();
  const [billingDateOpen, setBillingDateOpen] = React.useState<boolean>(false);
  const [receivedDateOpen, setReceivedDateOpen] =
    React.useState<boolean>(false);

  // Item table state
  const [items, setItems] = React.useState<Item[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Item | null>(null);
  const [extraDiscount, setExtraDiscount] = React.useState<string>("0");

  const [itemForm, setItemForm] = React.useState<ItemFormData>({
    itemCode: "",
    itemName: "",
    price: "",
    quantity: "1",
    discount: "",
    freeItemQuantity: "",
  });

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString();
  };

  const handleItemFormChange = (field: keyof ItemFormData, value: string) => {
    setItemForm((prev) => ({ ...prev, [field]: value }));
  };

  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    return subtotal - (subtotal * discount) / 100;
  };

  const handleAddItem = () => {
    if (
      !itemForm.itemCode ||
      !itemForm.itemName ||
      !itemForm.price ||
      !itemForm.quantity
    ) {
      return;
    }

    const price = parseFloat(itemForm.price) || 0;
    const quantity = parseFloat(itemForm.quantity) || 1;
    const discount = parseFloat(itemForm.discount) || 0;
    const freeItemQuantity = parseFloat(itemForm.freeItemQuantity) || 0;
    const amount = calculateAmount(price, quantity, discount);

    const newItem: Item = {
      id: editingItem ? editingItem.id : Date.now(),
      itemCode: itemForm.itemCode,
      itemName: itemForm.itemName,
      price: price,
      quantity: quantity,
      discount: discount,
      amount: amount,
      freeItemQuantity: freeItemQuantity > 0 ? freeItemQuantity : undefined,
    };

    if (editingItem) {
      setItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? newItem : item))
      );
    } else {
      setItems((prev) => [...prev, newItem]);
    }

    // Reset form
    setItemForm({
      itemCode: "",
      itemName: "",
      price: "",
      quantity: "1",
      discount: "",
      freeItemQuantity: "",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setItemForm({
      itemCode: item.itemCode,
      itemName: item.itemName,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      discount: item.discount.toString(),
      freeItemQuantity: item.freeItemQuantity?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <Label>Select Supplier</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[350px] justify-between"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue: string) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-x-4">
          {/* Bill Number Input */}
          <div className="w-[250px] space-y-2">
            <Label htmlFor="billNo">Bill Number</Label>
            <Input
              id="billNo"
              type="text"
              placeholder="Enter bill number"
              value={billNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBillNo(e.target.value)
              }
              className="w-full"
            />
          </div>
          {/* Billing Date */}
          <div className="w-[250px] space-y-2">
            <Label>Billing Date</Label>
            <Popover open={billingDateOpen} onOpenChange={setBillingDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !billingDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(billingDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={billingDate}
                  onSelect={(date: Date | undefined) => {
                    setBillingDate(date);
                    setBillingDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Received Date */}
          <div className="w-[250px] space-y-2">
            <Label>Received Date</Label>
            <Popover open={receivedDateOpen} onOpenChange={setReceivedDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !receivedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(receivedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={receivedDate}
                  onSelect={(date: Date | undefined) => {
                    setReceivedDate(date);
                    setReceivedDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Item Table Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Items</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setItemForm({
                    itemCode: "",
                    itemName: "",
                    price: "",
                    quantity: "1",
                    discount: "",
                    freeItemQuantity: "",
                  });
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Item" : "Add New Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemCode">Item Code *</Label>
                    <Input
                      id="itemCode"
                      value={itemForm.itemCode}
                      onChange={(e) =>
                        handleItemFormChange("itemCode", e.target.value)
                      }
                      placeholder="Enter item code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name *</Label>
                    <Input
                      id="itemName"
                      value={itemForm.itemName}
                      onChange={(e) =>
                        handleItemFormChange("itemName", e.target.value)
                      }
                      placeholder="Enter item name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={itemForm.price}
                      onChange={(e) =>
                        handleItemFormChange("price", e.target.value)
                      }
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={itemForm.quantity}
                      onChange={(e) =>
                        handleItemFormChange("quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={itemForm.discount}
                      onChange={(e) =>
                        handleItemFormChange("discount", e.target.value)
                      }
                      placeholder="Enter discount percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeItemQuantity">Free Item Qty</Label>
                    <Input
                      id="freeItemQuantity"
                      type="number"
                      value={itemForm.freeItemQuantity}
                      onChange={(e) =>
                        handleItemFormChange("freeItemQuantity", e.target.value)
                      }
                      placeholder="Enter free quantity"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>
                    {editingItem ? "Update" : "Add"} Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Item Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Item Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Discount (%)
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Free Qty
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  Amount
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No items added yet. Click "Add Item" to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.itemCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.itemName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.discount}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {item.freeItemQuantity || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="flex justify-end">
          <div className="w-80 space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Extra Discount (%):</span>
              <Input
                type="number"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(e.target.value)}
                className="w-20 h-8 text-right"
                placeholder="0"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount Amount:</span>
              <span>-${extraDiscountAmount.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Final Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}