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
  AlertCircle,
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
import { BillProduct, useGetProductsQuery } from "@/store/services/product";

// Import RTK Query hook

// Customer interface matching your API
interface Customer {
  id: number;
  customerName: string;
  shopName: string;
  customerCode: string;
  customerType: "retail" | "enterprise";
  areaId: number;
  area: {
    area_id: number;
    area_name: string;
  };
  address: string;
  contactNumber: string;
  assignedRepId: number;
  assignedRep: {
    user_id: number;
    username: string;
    role: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomersListResponse {
  statusCode: number;
  message: string;
  data: Customer[];
}

const paymentMethods = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "check", label: "Check", icon: "📝" },
  { value: "bank-transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "credit-card", label: "Credit Card", icon: "💳" },
];

interface Item {
  id: number;
  itemCode: string;
  itemName: string;
  price: number;
  quantity: number;
  unit: string;
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
  unit: string;
  discount: string;
  freeItemQuantity: string;
}

export default function CustomerInvoiceApp() {
  // RTK Query hook to fetch products
  const {
    data: productsResponse,
    error: productsError,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetProductsQuery();

  // Extract products from response
  const products = productsResponse?.data || [];

  // Customer API state
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = React.useState(false);
  const [customersError, setCustomersError] = React.useState<string | null>(
    null
  );

  // State management
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");
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
    unit: "",
    discount: "",
    freeItemQuantity: "",
  });
  const [itemCodeOpen, setItemCodeOpen] = React.useState(false);
  const [itemNameOpen, setItemNameOpen] = React.useState(false);

  // Fetch customers from API
  const fetchCustomers = React.useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);

    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CustomersListResponse = await response.json();

      if (result.statusCode === 200 && result.data) {
        setCustomers(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomersError(
        error instanceof Error ? error.message : "Failed to fetch customers"
      );
      // Fallback to empty array if API fails
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  // Load customers on component mount
  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Convert BillProduct to format expected by the component
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

      setItems([...items, item]);
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

  const saveInvoice = () => {
    if (items.length === 0) {
      alert("Please add at least one item to save the invoice.");
      return;
    }
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const selectedCustomerData = customers.find(
      (c) => c.id.toString() === selectedCustomer
    );

    const invoiceData = {
      invoiceNo,
      customer: selectedCustomerData,
      billingDate: billingDate.toISOString(),
      paymentMethod: paymentMethods.find((p) => p.value === paymentMethod),
      items,
      subtotal,
      extraDiscount: parseFloat(extraDiscount),
      extraDiscountAmount,
      finalTotal,
      totalItems,
      createdAt: new Date().toISOString(),
    };

    // Here you would typically save to a backend or local storage
    console.log("Customer Invoice saved:", invoiceData);

    // Show success message
    alert(`Customer Invoice ${invoiceNo} saved successfully!`);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Get selected customer data for display
  const getSelectedCustomerData = () => {
    return customers.find(
      (customer) => customer.id.toString() === selectedCustomer
    );
  };

  // Mobile item card component
  const MobileItemCard = ({ item }: { item: Item }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-sm">{item.itemName}</h4>
            <p className="text-xs text-gray-500">{item.itemCode}</p>
            <div className="flex items-center gap-2 mt-1">
              {item.category && (
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {item.unit}
              </Badge>
            </div>
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
              <p className="font-medium">
                {item.quantity} {item.unit}
              </p>
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
            <Label className="text-xs text-gray-500">Free Items</Label>
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
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">
                {item.freeItemQuantity || 0} {item.unit}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Amount</Label>
            <p className="font-bold text-green-600 text-lg">
              ${item.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {item.freeItemQuantity && item.freeItemQuantity > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded">
            <p className="text-xs text-green-700">
              <strong>Free Items:</strong> {item.freeItemQuantity} {item.unit}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Customer *
              </Label>

              {customersError && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{customersError}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchCustomers}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Retry
                  </Button>
                </div>
              )}

              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between h-10"
                    disabled={customersLoading}
                  >
                    {customersLoading
                      ? "Loading customers..."
                      : selectedCustomer
                      ? (() => {
                          const customer = getSelectedCustomerData();
                          return customer
                            ? `${customer.customerName} (${customer.customerCode})`
                            : "Select customer...";
                        })()
                      : "Choose customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search customers..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {customersLoading
                          ? "Loading customers..."
                          : "No customer found."}
                      </CommandEmpty>
                      {!customersLoading && customers.length > 0 && (
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.id.toString()}
                              onSelect={(currentValue) => {
                                setSelectedCustomer(
                                  currentValue === selectedCustomer
                                    ? ""
                                    : currentValue
                                );
                                setCustomerOpen(false);
                              }}
                            >
                              <div>
                                <p className="font-medium">
                                  {customer.customerName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Code: {customer.customerCode}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {customer.shopName}
                                </p>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedCustomer === customer.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
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
                Invoice Date
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
              <Button
                onClick={saveInvoice}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={items.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Invoice
              </Button>
              <Button
                variant="outline"
                className="border-gray-300"
                disabled={items.length === 0}
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

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
                        <TableHead className="w-[120px]">Code</TableHead>
                        <TableHead className="min-w-[200px]">
                          Item Name
                        </TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead className="w-[80px]">Qty</TableHead>
                        <TableHead className="w-[80px]">Unit</TableHead>
                        <TableHead className="w-[80px]">Disc%</TableHead>
                        <TableHead className="w-[80px]">Free</TableHead>
                        <TableHead className="w-[120px]">Amount</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
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
                            <Badge variant="outline" className="text-xs">
                              {item.unit}
                            </Badge>
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
                              <span className="text-green-600">
                                {item.freeItemQuantity || 0}
                              </span>
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
                Payment Method *
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
                    min="0"
                    max="100"
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
                    Invoice ready for processing!
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
            onClick={saveInvoice}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            disabled={items.length === 0}
          >
            <Save className="h-5 w-5 mr-2" />
            Save Invoice
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 border-gray-300"
            disabled={items.length === 0}
            onClick={() => window.print()}
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Invoice
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="px-8 py-3 text-gray-600"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all data?")) {
                setItems([]);
                setNewItem({
                  itemCode: "",
                  itemName: "",
                  price: "",
                  quantity: "",
                  unit: "",
                  discount: "",
                  freeItemQuantity: "",
                });
                setSelectedCustomer("");
                setPaymentMethod("");
                setExtraDiscount("0");
                setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
              }
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
