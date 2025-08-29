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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CreateSupplierBillDto,
  useCreateSupplierBillMutation,
  useGetDropdownSuppliersQuery,
} from "@/store/services/supplier";
import { useGetProductsQuery } from "@/store/services/product";

// Updated Product interface to match your API response
interface Product {
  item_uuid: string;
  item_code: string;
  item_name: string;
  description: string;
  additional_notes?: string;
  cost_price: string;
  selling_price: string;
  rep_commision: string;
  minimum_selling_price: string;
  unit_type: string;
  unit_quantity: string;
  supplier_id: number;
  supplier_name: string;
  category_id: number;
  category_name: string;
  images: string[];
  mrp: string;
}

interface Item {
  id: number;
  itemCode: string;
  itemName: string;
  sellingPrice: number;
  mrp: number;
  price: number;
  quantity: number;
  discount: number;
  discountAmount: number; // Added discount amount field
  amount: number;
  freeItemQuantity?: number;
}

interface NewItemRow {
  itemCode: string;
  itemName: string;
  sellingPrice: string;
  mrp: string;
  price: string;
  quantity: string;
  discount: string;
  discountAmount: string; // Added discount amount field
  freeItemQuantity: string;
}

export default function DatePickerPage() {
  // Fetch suppliers from API
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useGetDropdownSuppliersQuery();

  const [createSupplierBill, { isLoading: isCreating }] =
    useCreateSupplierBillMutation();

  // Fetch products from API
  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery();

  // Extract products from the API response
  const products: Product[] = productsResponse?.data || [];

  const [open, setOpen] = React.useState(false);
  const [selectedSupplierId, setSelectedSupplierId] =
    React.useState<string>("");
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
    discountAmount: "",
    freeItemQuantity: "",
    sellingPrice: "",
    mrp: "",
  });

  // Dropdown states
  const [itemCodeOpen, setItemCodeOpen] = React.useState(false);
  const [itemNameOpen, setItemNameOpen] = React.useState(false);

  // Filter products by selected supplier
  const filteredProducts = React.useMemo(() => {
    if (!selectedSupplierId) return [];
    return products.filter(
      (product) => product.supplier_id.toString() === selectedSupplierId
    );
  }, [products, selectedSupplierId]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Pick a date";
    return date.toLocaleDateString();
  };

  // Calculate amount when price, quantity, discount, or discount amount changes
  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number,
    discountAmount: number = 0
  ): number => {
    const subtotal = price * quantity;
    // Use discount amount if provided, otherwise use percentage
    const finalDiscountAmount =
      discountAmount > 0 ? discountAmount : (subtotal * discount) / 100;
    return subtotal - finalDiscountAmount;
  };

  // Calculate discount percentage from amount
  const calculateDiscountPercentage = (
    price: number,
    quantity: number,
    discountAmount: number
  ): number => {
    const subtotal = price * quantity;
    if (subtotal === 0) return 0;
    return (discountAmount / subtotal) * 100;
  };

  // Calculate discount amount from percentage
  const calculateDiscountAmount = (
    price: number,
    quantity: number,
    discountPercentage: number
  ): number => {
    const subtotal = price * quantity;
    return (subtotal * discountPercentage) / 100;
  };

  // Handle supplier selection
  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setOpen(false);

    // Clear existing items and new item form when supplier changes
    setItems([]);
    setNewItem({
      itemCode: "",
      itemName: "",
      price: "",
      quantity: "",
      discount: "",
      discountAmount: "",
      freeItemQuantity: "",
      sellingPrice: "",
      mrp: "",
    });
  };

  // Get selected supplier name for display
  const getSelectedSupplierName = (): string => {
    if (!selectedSupplierId) return "Select supplier...";
    const supplier = suppliers.find(
      (s) => s.supplier_id.toString() === selectedSupplierId
    );
    return supplier ? supplier.supplier_name : "Select supplier...";
  };

  // Handle item code selection
  const handleItemCodeSelect = (code: string) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.item_code === code
    );
    if (selectedProduct) {
      setNewItem({
        ...newItem,
        itemCode: selectedProduct.item_code,
        itemName: selectedProduct.item_name,
        sellingPrice: selectedProduct.selling_price,
        mrp: selectedProduct.mrp,
        price: selectedProduct.cost_price,
      });
    }

    setItemCodeOpen(false);
  };

  // Handle item name selection
  const handleItemNameSelect = (name: string) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.item_name === name
    );
    if (selectedProduct) {
      setNewItem({
        ...newItem,
        itemCode: selectedProduct.item_code,
        itemName: name,
        sellingPrice: selectedProduct.selling_price,
        mrp: selectedProduct.mrp,
        price: selectedProduct.cost_price,
      });
    }
    setItemNameOpen(false);
  };

  // Handle input changes with auto-calculation for discount
  const handleInputChange = (field: keyof NewItemRow, value: string) => {
    const updatedItem = { ...newItem, [field]: value };

    const price = parseFloat(updatedItem.price) || 0;
    const quantity = parseFloat(updatedItem.quantity) || 0;

    // Auto-calculate discount amount when percentage changes
    if (field === "discount") {
      const discountPercentage = parseFloat(value) || 0;
      const discountAmount = calculateDiscountAmount(
        price,
        quantity,
        discountPercentage
      );
      updatedItem.discountAmount = discountAmount.toFixed(2);
    }

    // Auto-calculate discount percentage when amount changes
    if (field === "discountAmount") {
      const discountAmount = parseFloat(value) || 0;
      const discountPercentage = calculateDiscountPercentage(
        price,
        quantity,
        discountAmount
      );
      updatedItem.discount = discountPercentage.toFixed(2);
    }

    setNewItem(updatedItem);
  };

  // Handle edit input changes with auto-calculation
  const handleEditInputChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          const price = field === "price" ? Number(value) : updatedItem.price;
          const quantity =
            field === "quantity" ? Number(value) : updatedItem.quantity;

          // Auto-calculate discount amount when percentage changes
          if (field === "discount") {
            const discountPercentage = Number(value);
            const discountAmount = calculateDiscountAmount(
              price,
              quantity,
              discountPercentage
            );
            updatedItem.discountAmount = discountAmount;
          }

          // Auto-calculate discount percentage when amount changes
          if (field === "discountAmount") {
            const discountAmount = Number(value);
            const discountPercentage = calculateDiscountPercentage(
              price,
              quantity,
              discountAmount
            );
            updatedItem.discount = discountPercentage;
          }

          // Recalculate amount if price, quantity, discount, or discount amount changes
          if (
            field === "price" ||
            field === "quantity" ||
            field === "discount" ||
            field === "discountAmount"
          ) {
            updatedItem.amount = calculateAmount(
              price,
              quantity,
              field === "discount" ? Number(value) : updatedItem.discount,
              field === "discountAmount"
                ? Number(value)
                : updatedItem.discountAmount
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
      const discountAmount = parseFloat(newItem.discountAmount) || 0;
      const freeItemQuantity = parseFloat(newItem.freeItemQuantity) || 0;
      const sellingPrice = parseFloat(newItem.sellingPrice) || 0;
      const mrp = parseFloat(newItem.mrp) || 0;

      const amount = calculateAmount(price, quantity, discount, discountAmount);

      const item: Item = {
        id: Date.now(),
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        sellingPrice,
        mrp,
        price,
        quantity,
        discount,
        discountAmount,
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
        discountAmount: "",
        freeItemQuantity: "",
        sellingPrice: "",
        mrp: "",
      });

      toast.success("Item added successfully!");

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
    toast.success("Item deleted successfully!");
  };

  // Start editing an item
  const startEdit = (id: number) => {
    setEditingId(id);
  };

  // Stop editing an item
  const stopEdit = () => {
    setEditingId(null);
    toast.success("Item updated successfully!");
  };

  // Reset form function
  const resetForm = () => {
    setSelectedSupplierId("");
    setBillNo("");
    setBillingDate(undefined);
    setReceivedDate(undefined);
    setItems([]);
    setExtraDiscount("0");
    setEditingId(null);
    setNewItem({
      itemCode: "",
      itemName: "",
      price: "",
      quantity: "",
      discount: "",
      discountAmount: "",
      freeItemQuantity: "",
      sellingPrice: "",
      mrp: "",
    });
    setOpen(false);
    setBillingDateOpen(false);
    setReceivedDateOpen(false);
    setItemCodeOpen(false);
    setItemNameOpen(false);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;

  // Handle loading and error states
  if (suppliersError) {
    console.error("Error loading suppliers:", suppliersError);
  }

  if (productsError) {
    console.error("Error loading products:", productsError);
  }

  const handleSaveInvoice = async () => {
    try {
      if (!selectedSupplierId) {
        toast.error("Please select a supplier!");
        return;
      }
      if (!billNo.trim()) {
        toast.error("Please enter a Bill Number!");
        return;
      }
      if (!billingDate || !receivedDate) {
        toast.error("Please select billing and received dates!");
        return;
      }
      if (items.length === 0) {
        toast.error("Please add at least one item!");
        return;
      }

      toast.loading("Saving invoice...", { id: "save-invoice" });

      const formatDateForBackend = (date: Date | undefined) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
      };

      const transformedBillItems = items.map((item) => {
        const product = filteredProducts.find(
          (p) => p.item_code === item.itemCode
        );
        if (!product) {
          throw new Error(`Product not found for item code: ${item.itemCode}`);
        }

        return {
          item_id: parseInt(product.item_uuid) || 0,
          unit_price: item.price,
          quantity: item.quantity,
          discount_percentage: item.discount || 0,
          free_item_quantity: item.freeItemQuantity || 0,
        };
      });

      const supplierIdNum = parseInt(selectedSupplierId);
      if (isNaN(supplierIdNum)) {
        toast.error("Invalid supplier ID");
        return;
      }

      const payload: CreateSupplierBillDto = {
        supplierId: selectedSupplierId,
        billNo: billNo.trim(),
        billingDate: formatDateForBackend(billingDate),
        receivedDate: formatDateForBackend(receivedDate),
        items: items.map((item) => ({
          itemCode: item.itemCode,
          itemName: item.itemName,
          sellingPrice: item.sellingPrice,
          mrp: item.mrp,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          discountAmount: item.discountAmount,
          amount: item.amount,
          freeItemQuantity: item.freeItemQuantity,
        })),
        extraDiscount,
        subtotal,
        extraDiscountAmount,
        finalTotal,
      };

      console.log("🚀 Sending payload to backend:", payload);

      const response = await createSupplierBill(payload).unwrap();

      console.log("✅ Backend response:", response);

      toast.dismiss("save-invoice");
      toast.success("Invoice saved successfully!", {
        description: `Bill No: ${billNo} has been created`,
        duration: 4000,
      });

      resetForm();
    } catch (error: any) {
      toast.dismiss("save-invoice");

      console.error("❌ Error saving invoice:", error);

      if (error?.data?.message) {
        toast.error(`Failed to save invoice: ${error.data.message}`);
      } else if (error?.message) {
        toast.error(`Failed to save invoice: ${error.message}`);
      } else {
        toast.error("Failed to save invoice. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <div className="flex gap-x-4">
            <div className="space-y-2">
              <Label>Select Supplier</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[350px] justify-between"
                    disabled={suppliersLoading}
                  >
                    {suppliersLoading
                      ? "Loading suppliers..."
                      : getSelectedSupplierName()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search supplier..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {suppliersLoading ? "Loading..." : "No supplier found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {suppliers.map((supplier) => (
                          <CommandItem
                            key={supplier.supplier_id}
                            value={supplier.supplier_name}
                            onSelect={() =>
                              handleSupplierSelect(
                                supplier.supplier_id.toString()
                              )
                            }
                          >
                            {supplier.supplier_name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedSupplierId ===
                                  supplier.supplier_id.toString()
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
            <div className="space-y-2">
              <Label>Select Shop</Label>
              <Select defaultValue="apple">
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Champika Hardware</SelectItem>
                  <SelectItem value="banana">Bawantha Hardware</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {suppliersError && (
            <p className="text-sm text-red-500">
              Failed to load suppliers. Please try again.
            </p>
          )}
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
          <div className="flex gap-x-2">
            <Button
              variant="greenOutline"
              className="cursor-pointer"
              onClick={handleSaveInvoice}
            >
              <Save className=" h-4 w-4" /> Save Invoice
            </Button>
            <Button variant="blackOutline" className="cursor-pointer">
              <Printer className=" h-4 w-4" /> Print Invoice
            </Button>
          </div>
        </div>

        {/* Show loading or error states for products */}
        {productsLoading && (
          <div className="text-center py-1">Loading products...</div>
        )}
        {productsError && (
          <div className="text-center py-4 text-red-500">
            Failed to load products. Please try again.
          </div>
        )}

        {/* Show message when supplier is selected but has no products */}
        {selectedSupplierId &&
          !productsLoading &&
          filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              No products found for the selected supplier
            </div>
          )}

        {/* Show table only when supplier is selected and has products */}
        {/* { filteredProducts.length > 0 && ( */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 rounded-lg">
              <TableRow>
                <TableHead className="w-[150px] py-3 px-4">Item Code</TableHead>
                <TableHead className="w-[200px]">Item Name</TableHead>
                <TableHead className="w-[100px]">MRP</TableHead>
                <TableHead className="w-[100px]">Unit Price</TableHead>
                <TableHead className="w-[80px]">Quantity</TableHead>
                <TableHead className="w-[100px]">Discount(%)</TableHead>
                <TableHead className="w-[100px]">Discount Amount</TableHead>
                <TableHead className="w-[100px]">Free Item Qty</TableHead>
                <TableHead className="w-[100px]">Selling Price</TableHead>
                <TableHead className="w-[100px]">Amount</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
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
                        className="h-8"
                      />
                    ) : (
                      item.itemCode
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
                        className="h-8"
                      />
                    ) : (
                      item.itemName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.mrp}
                        onChange={(e) =>
                          handleEditInputChange(
                            item.id,
                            "mrp",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      `$${item.mrp.toFixed(2)}`
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
                      `$${item.price.toFixed(2)}`
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
                        className="h-8"
                      />
                    ) : (
                      `${item.discount.toFixed(2)}%`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.discountAmount}
                        onChange={(e) =>
                          handleEditInputChange(
                            item.id,
                            "discountAmount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      `$${item.discountAmount.toFixed(2)}`
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
                      item.freeItemQuantity || 0
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.sellingPrice}
                        onChange={(e) =>
                          handleEditInputChange(
                            item.id,
                            "sellingPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      `$${item.sellingPrice.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
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
                        className="w-full justify-between h-10 px-3 text-sm"
                        data-field="itemCode"
                        onKeyDown={(e) => handleKeyPress(e, "itemName")}
                        disabled={
                          productsLoading || filteredProducts.length === 0
                        }
                      >
                        {newItem.itemCode ||
                          (productsLoading
                            ? "Loading..."
                            : filteredProducts.length === 0
                            ? "No items available"
                            : "Select Code...")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search item code..." />
                        <CommandList>
                          <CommandEmpty>
                            {productsLoading ? "Loading..." : "No item found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredProducts.map((product) => (
                              <CommandItem
                                key={product.item_uuid}
                                value={product.item_code}
                                onSelect={() =>
                                  handleItemCodeSelect(product.item_code)
                                }
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {product.item_code}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {product.item_name}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    newItem.itemCode === product.item_code
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
                        className="w-full justify-between h-10 px-3 text-sm"
                        data-field="itemName"
                        onKeyDown={(e) => handleKeyPress(e, "price")}
                        disabled={
                          productsLoading || filteredProducts.length === 0
                        }
                      >
                        {newItem.itemName ||
                          (productsLoading
                            ? "Loading..."
                            : filteredProducts.length === 0
                            ? "No items available"
                            : "Select Item...")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search item name..." />
                        <CommandList>
                          <CommandEmpty>
                            {productsLoading ? "Loading..." : "No item found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredProducts.map((product) => (
                              <CommandItem
                                key={product.item_uuid}
                                value={product.item_name}
                                onSelect={() =>
                                  handleItemNameSelect(product.item_name)
                                }
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {product.item_name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {product.item_code} - $
                                    {product.selling_price}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    newItem.itemName === product.item_name
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
                    value={newItem.mrp}
                    onChange={(e) => handleInputChange("mrp", e.target.value)}
                    data-field="mrp"
                    onKeyDown={(e) => handleKeyPress(e, "price")}
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newItem.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    data-field="price"
                    onKeyDown={(e) => handleKeyPress(e, "quantity")}
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
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
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
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
                    onKeyDown={(e) => handleKeyPress(e, "discountAmount")}
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newItem.discountAmount}
                    onChange={(e) =>
                      handleInputChange("discountAmount", e.target.value)
                    }
                    data-field="discountAmount"
                    onKeyDown={(e) => handleKeyPress(e, "freeItemQuantity")}
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
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
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newItem.sellingPrice}
                    onChange={(e) =>
                      handleInputChange("sellingPrice", e.target.value)
                    }
                    data-field="sellingPrice"
                    onKeyDown={(e) => handleKeyPress(e, "mrp")}
                    className="h-10"
                    disabled={
                      !selectedSupplierId || filteredProducts.length === 0
                    }
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    $
                    {newItem.price && newItem.quantity
                      ? calculateAmount(
                          parseFloat(newItem.price) || 0,
                          parseFloat(newItem.quantity) || 0,
                          parseFloat(newItem.discount) || 0,
                          parseFloat(newItem.discountAmount) || 0
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
                      !newItem.quantity ||
                      productsLoading ||
                      !selectedSupplierId ||
                      filteredProducts.length === 0
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

        {/* Total Section - Only show when there are items */}
        {items.length > 0 && (
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
                  className="w-20 h-8"
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
        )}
      </div>
    </div>
  );
}
