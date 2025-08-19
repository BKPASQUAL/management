"use client";

import * as React from "react";
import { Calendar, Plus, Edit, Trash2, Save, Printer } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

// Sample items database
const itemsDatabase = [
  { code: "ITM001", name: "Laptop Computer", price: 1200 },
  { code: "ITM002", name: "Wireless Mouse", price: 25 },
  { code: "ITM003", name: "Keyboard", price: 45 },
  { code: "ITM004", name: "Monitor 24 inch", price: 300 },
  { code: "ITM005", name: "USB Cable", price: 15 },
  { code: "ITM006", name: "Printer", price: 250 },
  { code: "ITM007", name: "Headphones", price: 80 },
  { code: "ITM008", name: "Webcam", price: 60 },
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

interface NewItemRow {
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
  const [extraDiscount, setExtraDiscount] = React.useState<string>("0");
  const [editingId, setEditingId] = React.useState<number | null>(null);

  // New item row state
  const [newItem, setNewItem] = React.useState<NewItemRow>({
    itemCode: "",
    itemName: "",
    price: "",
    quantity: "",
    discount: "",
    freeItemQuantity: "",
  });

  // Dropdown states
  const [itemCodeOpen, setItemCodeOpen] = React.useState(false);
  const [itemNameOpen, setItemNameOpen] = React.useState(false);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString();
  };

  // Calculate amount when price, quantity, or discount changes
  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  // Handle item code selection
  const handleItemCodeSelect = (code: string) => {
    const selectedItem = itemsDatabase.find((item) => item.code === code);
    if (selectedItem) {
      setNewItem({
        ...newItem,
        itemCode: code,
        itemName: selectedItem.name,
        price: selectedItem.price.toString(),
      });
    }
    setItemCodeOpen(false);
  };

  // Handle item name selection
  const handleItemNameSelect = (name: string) => {
    const selectedItem = itemsDatabase.find((item) => item.name === name);
    if (selectedItem) {
      setNewItem({
        ...newItem,
        itemCode: selectedItem.code,
        itemName: name,
        price: selectedItem.price.toString(),
      });
    }
    setItemNameOpen(false);
  };

  // Handle input changes
  const handleInputChange = (field: keyof NewItemRow, value: string) => {
    setNewItem({
      ...newItem,
      [field]: value,
    });
  };

  // Handle edit input changes
  const handleEditInputChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount if price, quantity, or discount changes
          if (
            field === "price" ||
            field === "quantity" ||
            field === "discount"
          ) {
            updatedItem.amount = calculateAmount(
              field === "price" ? Number(value) : updatedItem.price,
              field === "quantity" ? Number(value) : updatedItem.quantity,
              field === "discount" ? Number(value) : updatedItem.discount
            );
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Handle Enter key navigation
  const handleKeyPress = (e: React.KeyboardEvent, nextField: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextElement = document.querySelector(
        `[data-field="${nextField}"]`
      ) as HTMLElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  // Add item to the list
  const addItem = () => {
    if (
      newItem.itemCode &&
      newItem.itemName &&
      newItem.price &&
      newItem.quantity
    ) {
      const price = parseFloat(newItem.price) || 0;
      const quantity = parseFloat(newItem.quantity) || 0;
      const discount = parseFloat(newItem.discount) || 0;
      const freeItemQuantity = parseFloat(newItem.freeItemQuantity) || 0;

      const amount = calculateAmount(price, quantity, discount);

      const item: Item = {
        id: Date.now(), // Simple ID generation
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        price,
        quantity,
        discount,
        amount,
        freeItemQuantity,
      };

      setItems([...items, item]);

      // Reset the new item row
      setNewItem({
        itemCode: "",
        itemName: "",
        price: "",
        quantity: "",
        discount: "",
        freeItemQuantity: "",
      });

      // Focus on the item code field for next entry
      setTimeout(() => {
        const itemCodeField = document.querySelector(
          '[data-field="itemCode"]'
        ) as HTMLElement;
        if (itemCodeField) {
          itemCodeField.focus();
        }
      }, 100);
    }
  };

  // Handle Enter key on the last field to add item
  const handleLastFieldEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  // Delete item
  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Start editing an item
  const startEdit = (id: number) => {
    setEditingId(id);
  };

  // Stop editing an item
  const stopEdit = () => {
    setEditingId(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="space-y-2">
          <Label>Select Supplier</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full lg:w-[350px] justify-between"
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
          {/* Billing Date */}
          <div className="w-full lg:w-[250px] space-y-2">
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
        </div>
      </div>

      {/* Item Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <div className="flex flex-col sm:flex-row gap-x-2 gap-y-2">
            <Button variant="greenOutline" className="cursor-pointer">
              <Save className="h-4 w-4" /> Save Invoice
            </Button>
            <Button variant="blackOutline" className="cursor-pointer">
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
          </div>
        </div>

        {/* Table Container with Horizontal Scroll on Tablets */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[200px] py-3 px-4 whitespace-nowrap">
                    Item Code
                  </TableHead>
                  <TableHead className="w-[300px] whitespace-nowrap">
                    Item Name
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Unit Price
                  </TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap">
                    Quantity
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Discount(%)
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Free Item Qty
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Amount
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Existing Items */}
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {editingId === item.id ? (
                        <Input
                          value={item.itemCode}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "itemCode",
                              e.target.value
                            )
                          }
                          className="h-8 min-w-[150px]"
                        />
                      ) : (
                        <div className="truncate">{item.itemCode}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={item.itemName}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "itemName",
                              e.target.value
                            )
                          }
                          className="h-8 min-w-[200px]"
                        />
                      ) : (
                        <div className="truncate">{item.itemName}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 min-w-[100px]"
                        />
                      ) : (
                        <div className="whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 min-w-[80px]"
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "discount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 min-w-[80px]"
                        />
                      ) : (
                        `${item.discount}%`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          value={item.freeItemQuantity || 0}
                          onChange={(e) =>
                            handleEditInputChange(
                              item.id,
                              "freeItemQuantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 min-w-[80px]"
                        />
                      ) : (
                        item.freeItemQuantity || 0
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="whitespace-nowrap">
                        ${item.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 whitespace-nowrap">
                        {editingId === item.id ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={stopEdit}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(item.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* New Item Row */}
                <TableRow className="bg-blue-50">
                  <TableCell className="font-medium">
                    <Popover open={itemCodeOpen} onOpenChange={setItemCodeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={itemCodeOpen}
                          className="w-full justify-between h-10 px-3 text-sm min-w-[150px]"
                          data-field="itemCode"
                          onKeyDown={(e) => handleKeyPress(e, "itemName")}
                        >
                          <span className="truncate">
                            {newItem.itemCode || "Select Code..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search item code..." />
                          <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            <CommandGroup>
                              {itemsDatabase.map((item) => (
                                <CommandItem
                                  key={item.code}
                                  value={item.code}
                                  onSelect={() =>
                                    handleItemCodeSelect(item.code)
                                  }
                                >
                                  {item.code}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      newItem.itemCode === item.code
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
                  </TableCell>
                  <TableCell>
                    <Popover open={itemNameOpen} onOpenChange={setItemNameOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={itemNameOpen}
                          className="w-full justify-between h-10 px-3 text-sm min-w-[200px]"
                          data-field="itemName"
                          onKeyDown={(e) => handleKeyPress(e, "price")}
                        >
                          <span className="truncate">
                            {newItem.itemName || "Select Item..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search item name..." />
                          <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            <CommandGroup>
                              {itemsDatabase.map((item) => (
                                <CommandItem
                                  key={item.name}
                                  value={item.name}
                                  onSelect={() =>
                                    handleItemNameSelect(item.name)
                                  }
                                >
                                  {item.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      newItem.itemName === item.name
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
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newItem.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      data-field="price"
                      onKeyDown={(e) => handleKeyPress(e, "quantity")}
                      className="h-10 min-w-[100px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      data-field="quantity"
                      onKeyDown={(e) => handleKeyPress(e, "discount")}
                      className="h-10 min-w-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.discount}
                      onChange={(e) =>
                        handleInputChange("discount", e.target.value)
                      }
                      data-field="discount"
                      onKeyDown={(e) => handleKeyPress(e, "freeItemQuantity")}
                      className="h-10 min-w-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.freeItemQuantity}
                      onChange={(e) =>
                        handleInputChange("freeItemQuantity", e.target.value)
                      }
                      data-field="freeItemQuantity"
                      onKeyDown={handleLastFieldEnter}
                      className="h-10 min-w-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      $
                      {newItem.price && newItem.quantity
                        ? calculateAmount(
                            parseFloat(newItem.price) || 0,
                            parseFloat(newItem.quantity) || 0,
                            parseFloat(newItem.discount) || 0
                          ).toFixed(2)
                        : "0.00"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addItem}
                      disabled={
                        !newItem.itemCode ||
                        !newItem.itemName ||
                        !newItem.price ||
                        !newItem.quantity
                      }
                      className="text-green-600 hover:text-green-800"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Total Section */}
        <div className="flex justify-end">
          <div className="w-full max-w-80 space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm gap-2">
              <span>Extra Discount (%):</span>
              <Input
                type="number"
                value={extraDiscount}
                onChange={(e) => setExtraDiscount(e.target.value)}
                className="w-20 h-8 flex-shrink-0"
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
