"use client";

import * as React from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  Printer,
  X,
  Search,
  DollarSign,
  Package,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const suppliers = [
  { value: "acme-corp", label: "ACME Corporation", contact: "John Smith" },
  {
    value: "tech-solutions",
    label: "Tech Solutions Ltd",
    contact: "Sarah Johnson",
  },
  {
    value: "global-imports",
    label: "Global Imports Co",
    contact: "Mike Wilson",
  },
  {
    value: "office-supplies",
    label: "Office Supplies Inc",
    contact: "Lisa Brown",
  },
  { value: "digital-world", label: "Digital World", contact: "David Lee" },
];

const paymentMethods = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "check", label: "Check", icon: "📝" },
  { value: "credit", label: "Credit Card", icon: "💳" },
  { value: "bank-transfer", label: "Bank Transfer", icon: "🏦" },
];

const itemsDatabase = [
  {
    code: "ITM001",
    name: "MacBook Pro 16-inch",
    price: 2499,
    category: "Electronics",
  },
  {
    code: "ITM002",
    name: "Wireless Magic Mouse",
    price: 79,
    category: "Accessories",
  },
  {
    code: "ITM003",
    name: "Magic Keyboard",
    price: 199,
    category: "Accessories",
  },
  {
    code: "ITM004",
    name: "Studio Display 27-inch",
    price: 1599,
    category: "Electronics",
  },
  { code: "ITM005", name: "USB-C Cable 2m", price: 29, category: "Cables" },
  {
    code: "ITM006",
    name: "LaserJet Printer",
    price: 299,
    category: "Office Equipment",
  },
  { code: "ITM007", name: "AirPods Pro", price: 249, category: "Audio" },
  { code: "ITM008", name: "HD Webcam", price: 129, category: "Electronics" },
  {
    code: "ITM009",
    name: "Ergonomic Office Chair",
    price: 399,
    category: "Furniture",
  },
  { code: "ITM010", name: "Standing Desk", price: 599, category: "Furniture" },
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
  category?: string;
}

interface NewItemRow {
  itemCode: string;
  itemName: string;
  price: string;
  quantity: string;
  discount: string;
  freeItemQuantity: string;
}

export default function ResponsiveInvoiceApp() {
  // State management
  const [supplierOpen, setSupplierOpen] = React.useState(false);
  const [selectedSupplier, setSelectedSupplier] = React.useState("");
  const [invoiceNo, setInvoiceNo] = React.useState(
    () => `INV-${Date.now().toString().slice(-6)}`
  );
  const [billingDate, setBillingDate] = React.useState<Date>(new Date());
  const [billingDateOpen, setBillingDateOpen] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [paymentMethodOpen, setPaymentMethodOpen] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>([]);
  const [extraDiscount, setExtraDiscount] = React.useState("0");
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // New item state
  const [newItem, setNewItem] = React.useState<NewItemRow>({
    itemCode: "",
    itemName: "",
    price: "",
    quantity: "",
    discount: "",
    freeItemQuantity: "",
  });
  const [itemCodeOpen, setItemCodeOpen] = React.useState(false);
  const [itemNameOpen, setItemNameOpen] = React.useState(false);

  // Check screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

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

  const handleInputChange = (field: keyof NewItemRow, value: string) => {
    setNewItem({ ...newItem, [field]: value });
  };

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

      const selectedDbItem = itemsDatabase.find(
        (item) => item.code === newItem.itemCode
      );

      const item: Item = {
        id: Date.now(),
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        price,
        quantity,
        discount,
        amount: calculateAmount(price, quantity, discount),
        freeItemQuantity,
        category: selectedDbItem?.category || "Other",
      };

      setItems([...items, item]);
      setNewItem({
        itemCode: "",
        itemName: "",
        price: "",
        quantity: "",
        discount: "",
        freeItemQuantity: "",
      });
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const startEdit = (id: number) => {
    setEditingId(id);
  };

  const stopEdit = () => {
    setEditingId(null);
  };

  const handleEditInputChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
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

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Mobile item card component
  const MobileItemCard = ({ item }: { item: Item }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-sm">{item.itemName}</h4>
            <p className="text-xs text-gray-500">{item.itemCode}</p>
            {item.category && (
              <Badge variant="secondary" className="text-xs mt-1">
                {item.category}
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editingId === item.id ? stopEdit() : startEdit(item.id)
              }
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              {editingId === item.id ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteItem(item.id)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Label className="text-xs text-gray-500">Unit Price</Label>
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
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">${item.price.toFixed(2)}</p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Quantity</Label>
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
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">{item.quantity}</p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Discount (%)</Label>
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
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">{item.discount}%</p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Amount</Label>
            <p className="font-bold text-green-600">
              ${item.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {item.freeItemQuantity && item.freeItemQuantity > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded">
            <p className="text-xs text-green-700">
              <strong>Free Items:</strong> {item.freeItemQuantity}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                Invoice Manager
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create and manage your invoices efficiently
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200"
              >
                #{invoiceNo}
              </Badge>
              <Badge variant="secondary">{formatDate(billingDate)}</Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Items
                  </p>
                  <p className="text-lg sm:text-2xl font-bold">{totalItems}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Products</p>
                  <p className="text-lg sm:text-2xl font-bold">
                    {items.length}
                  </p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Amount
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">
                    ${finalTotal.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Supplier Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Supplier
              </Label>
              <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={supplierOpen}
                    className="w-full justify-between h-10"
                  >
                    {selectedSupplier
                      ? suppliers.find(
                          (supplier) => supplier.value === selectedSupplier
                        )?.label
                      : "Choose supplier..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search suppliers..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        {suppliers.map((supplier) => (
                          <CommandItem
                            key={supplier.value}
                            value={supplier.value}
                            onSelect={(currentValue) => {
                              setSelectedSupplier(
                                currentValue === selectedSupplier
                                  ? ""
                                  : currentValue
                              );
                              setSupplierOpen(false);
                            }}
                          >
                            <div>
                              <p className="font-medium">{supplier.label}</p>
                              <p className="text-xs text-gray-500">
                                {supplier.contact}
                              </p>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedSupplier === supplier.value
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

            {/* Invoice Number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Invoice Number</Label>
              <Input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="h-10"
                placeholder="INV-000001"
              />
            </div>

            {/* Billing Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Billing Date
              </Label>
              <Popover open={billingDateOpen} onOpenChange={setBillingDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10",
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
                    onSelect={(date) => {
                      setBillingDate(date || new Date());
                      setBillingDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Invoice Items
              </h2>
              <p className="text-gray-600 text-sm">
                Add and manage your invoice items
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Invoice
              </Button>
              <Button variant="outline" className="border-gray-300">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Add New Item Form */}
          <Card className="mb-6 border-2 border-dashed border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Item Code</Label>
                  <Popover open={itemCodeOpen} onOpenChange={setItemCodeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-10"
                      >
                        <span className="truncate">
                          {newItem.itemCode || "Select code..."}
                        </span>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <Command>
                        <CommandInput placeholder="Search items..." />
                        <CommandList>
                          <CommandEmpty>No item found.</CommandEmpty>
                          <CommandGroup>
                            {itemsDatabase.map((item) => (
                              <CommandItem
                                key={item.code}
                                value={item.code}
                                onSelect={() => handleItemCodeSelect(item.code)}
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.code}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {item.category}
                                    </Badge>
                                    <span className="text-xs text-green-600 font-medium">
                                      ${item.price}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
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
                      >
                        <span className="truncate">
                          {newItem.itemName || "Select item..."}
                        </span>
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0">
                      <Command>
                        <CommandInput placeholder="Search items..." />
                        <CommandList>
                          <CommandEmpty>No item found.</CommandEmpty>
                          <CommandGroup>
                            {itemsDatabase.map((item) => (
                              <CommandItem
                                key={item.name}
                                value={item.name}
                                onSelect={() => handleItemNameSelect(item.name)}
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.code}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {item.category}
                                    </Badge>
                                    <span className="text-xs text-green-600 font-medium">
                                      ${item.price}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>

              <Button
                onClick={addItem}
                disabled={
                  !newItem.itemCode ||
                  !newItem.itemName ||
                  !newItem.price ||
                  !newItem.quantity
                }
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item to Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No items added yet</p>
              <p className="text-sm">
                Start by adding items to your invoice using the form above
              </p>
            </div>
          ) : (
            <>
              {isMobile ? (
                // Mobile View - Cards
                <div className="space-y-4">
                  {items.map((item) => (
                    <MobileItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                // Desktop View - Table
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[150px]">Code</TableHead>
                        <TableHead className="min-w-[200px]">
                          Item Name
                        </TableHead>
                        <TableHead className="w-[120px]">Unit Price</TableHead>
                        <TableHead className="w-[100px]">Qty</TableHead>
                        <TableHead className="w-[100px]">Discount</TableHead>
                        <TableHead className="w-[100px]">Free Qty</TableHead>
                        <TableHead className="w-[120px]">Amount</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">
                                {item.itemCode}
                              </p>
                              {item.category && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs mt-1"
                                >
                                  {item.category}
                                </Badge>
                              )}
                            </div>
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
                                className="h-8"
                              />
                            ) : (
                              <div className="font-medium">{item.itemName}</div>
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
                                className="h-8"
                              />
                            ) : (
                              <span className="font-medium">
                                ${item.price.toFixed(2)}
                              </span>
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
                                className="h-8"
                              />
                            ) : (
                              <span>{item.quantity}</span>
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
                                className="h-8"
                              />
                            ) : (
                              <span>{item.discount}%</span>
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
                                className="h-8"
                              />
                            ) : (
                              <span>{item.freeItemQuantity || 0}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-green-600">
                              ${item.amount.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  editingId === item.id
                                    ? stopEdit()
                                    : startEdit(item.id)
                                }
                                className="text-blue-600 hover:text-blue-800 p-1"
                              >
                                {editingId === item.id ? (
                                  <Save className="h-4 w-4" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Invoice Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover
                open={paymentMethodOpen}
                onOpenChange={setPaymentMethodOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={paymentMethodOpen}
                    className="w-full justify-between h-12"
                  >
                    <div className="flex items-center gap-2">
                      {paymentMethod && (
                        <span className="text-lg">
                          {
                            paymentMethods.find(
                              (method) => method.value === paymentMethod
                            )?.icon
                          }
                        </span>
                      )}
                      <span>
                        {paymentMethod
                          ? paymentMethods.find(
                              (method) => method.value === paymentMethod
                            )?.label
                          : "Select payment method..."}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search payment methods..." />
                    <CommandList>
                      <CommandEmpty>No payment method found.</CommandEmpty>
                      <CommandGroup>
                        {paymentMethods.map((method) => (
                          <CommandItem
                            key={method.value}
                            value={method.value}
                            onSelect={(currentValue) => {
                              setPaymentMethod(
                                currentValue === paymentMethod
                                  ? ""
                                  : currentValue
                              );
                              setPaymentMethodOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{method.icon}</span>
                              <span>{method.label}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                paymentMethod === method.value
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
            </CardContent>
          </Card>

          {/* Billing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Extra Discount:</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={extraDiscount}
                    onChange={(e) => setExtraDiscount(e.target.value)}
                    className="w-20 h-8 text-right"
                    placeholder="0"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-red-600">
                <span>Discount Amount:</span>
                <span>-${extraDiscountAmount.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-green-600">
                  <span>Final Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {finalTotal > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 text-center">
                    🎉 Invoice ready for processing!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            disabled={items.length === 0}
          >
            <Save className="h-5 w-5 mr-2" />
            Save & Generate Invoice
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 border-gray-300"
            disabled={items.length === 0}
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Invoice
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="px-8 py-3 text-gray-600"
            onClick={() => {
              setItems([]);
              setNewItem({
                itemCode: "",
                itemName: "",
                price: "",
                quantity: "",
                discount: "",
                freeItemQuantity: "",
              });
              setSelectedSupplier("");
              setPaymentMethod("");
              setExtraDiscount("0");
              setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
            }}
          >
            <X className="h-5 w-5 mr-2" />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
