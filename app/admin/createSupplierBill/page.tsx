"use client";

import * as React from "react";
import { Calendar, Plus, Edit, Trash2, Save, Printer, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  CreateSupplierBillDto,
  useCreateSupplierBillMutation,
  useGetAllBusinessQuery,
  useGetDropdownSuppliersQuery,
} from "@/store/services/supplier";
import { useGetProductsQuery } from "@/store/services/product";

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
  shopId: number;
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
  discountAmount: number;
  amount: number;
  freeItemQuantity?: number;
}

const initialNewItem = {
  itemCode: "", itemName: "", sellingPrice: "", mrp: "", price: "", 
  quantity: "", discount: "", discountAmount: "", freeItemQuantity: ""
};

export default function DatePickerPage() {
  const { data: suppliers = [], isLoading: suppliersLoading, error: suppliersError } = useGetDropdownSuppliersQuery();
  const [createSupplierBill, { isLoading: isCreating }] = useCreateSupplierBillMutation();
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useGetProductsQuery();
  const { data: businesses = [], isLoading: businessesLoading, error: businessesError } = useGetAllBusinessQuery();

  const products: Product[] = productsResponse?.data || [];
  
  // State management
  const [open, setOpen] = React.useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState<string>("");
  const [shop, setShop] = React.useState<string>("");
  const [billNo, setBillNo] = React.useState<string>("");
  const [billingDate, setBillingDate] = React.useState<Date | undefined>();
  const [receivedDate, setReceivedDate] = React.useState<Date | undefined>();
  const [billingDateOpen, setBillingDateOpen] = React.useState<boolean>(false);
  const [receivedDateOpen, setReceivedDateOpen] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<Item[]>([]);
  const [extraDiscount, setExtraDiscount] = React.useState<string>("0");
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [newItem, setNewItem] = React.useState(initialNewItem);
  const [itemCodeOpen, setItemCodeOpen] = React.useState(false);
  const [itemNameOpen, setItemNameOpen] = React.useState(false);

  const shops = businesses.map((loc) => ({
    id: loc.location_id?.toString() ?? "",
    name: loc.location_name,
  }));

  const filteredProducts = React.useMemo(() => {
    return selectedSupplierId ? products.filter(p => p.supplier_id.toString() === selectedSupplierId) : [];
  }, [products, selectedSupplierId]);

  // Initialize default shop
  React.useEffect(() => {
    if (businesses.length > 0 && !shop) {
      setShop(businesses[0].location_id?.toString() ?? "");
    }
  }, [businesses, shop]);

  // Utility functions
  const formatDate = (date: Date | undefined): string => date ? date.toLocaleDateString() : "Pick a date";
  
  const calculateAmount = (price: number, quantity: number, discount: number, discountAmount: number = 0): number => {
    const subtotal = price * quantity;
    const finalDiscountAmount = discountAmount > 0 ? discountAmount : (subtotal * discount) / 100;
    return subtotal - finalDiscountAmount;
  };

  const calculateDiscountPercentage = (price: number, quantity: number, discountAmount: number): number => {
    const subtotal = price * quantity;
    return subtotal === 0 ? 0 : (discountAmount / subtotal) * 100;
  };

  const calculateDiscountAmount = (price: number, quantity: number, discountPercentage: number): number => {
    return (price * quantity * discountPercentage) / 100;
  };

  // Event handlers
  const handleSupplierSelect = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setOpen(false);
    setItems([]);
    setNewItem(initialNewItem);
  };

  const getSelectedSupplierName = (): string => {
    if (!selectedSupplierId) return "Select supplier...";
    const supplier = suppliers.find(s => s.supplier_id.toString() === selectedSupplierId);
    return supplier ? supplier.supplier_name : "Select supplier...";
  };

  const handleItemSelect = (type: 'code' | 'name', value: string) => {
    const selectedProduct = filteredProducts.find(p => 
      type === 'code' ? p.item_code === value : p.item_name === value
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
    type === 'code' ? setItemCodeOpen(false) : setItemNameOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedItem = { ...newItem, [field]: value };
    const price = parseFloat(updatedItem.price) || 0;
    const quantity = parseFloat(updatedItem.quantity) || 0;

    if (field === "discount") {
      const discountPercentage = parseFloat(value) || 0;
      updatedItem.discountAmount = calculateDiscountAmount(price, quantity, discountPercentage).toFixed(2);
    }

    if (field === "discountAmount") {
      const discountAmount = parseFloat(value) || 0;
      updatedItem.discount = calculateDiscountPercentage(price, quantity, discountAmount).toFixed(2);
    }

    setNewItem(updatedItem);
  };

  const handleEditInputChange = (id: number, field: keyof Item, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        const price = field === "price" ? Number(value) : updatedItem.price;
        const quantity = field === "quantity" ? Number(value) : updatedItem.quantity;

        if (field === "discount") {
          updatedItem.discountAmount = calculateDiscountAmount(price, quantity, Number(value));
        }

        if (field === "discountAmount") {
          updatedItem.discount = calculateDiscountPercentage(price, quantity, Number(value));
        }

        if (["price", "quantity", "discount", "discountAmount"].includes(field as string)) {
          updatedItem.amount = calculateAmount(
            price, quantity,
            field === "discount" ? Number(value) : updatedItem.discount,
            field === "discountAmount" ? Number(value) : updatedItem.discountAmount
          );
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, nextField: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextElement = document.querySelector(`[data-field="${nextField}"]`) as HTMLElement;
      nextElement?.focus();
    }
  };

  const addItem = () => {
    if (newItem.itemCode && newItem.itemName && newItem.price && newItem.quantity) {
      const price = parseFloat(newItem.price) || 0;
      const quantity = parseFloat(newItem.quantity) || 0;
      const discount = parseFloat(newItem.discount) || 0;
      const discountAmount = parseFloat(newItem.discountAmount) || 0;
      const amount = calculateAmount(price, quantity, discount, discountAmount);

      const item: Item = {
        id: Date.now(),
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        sellingPrice: parseFloat(newItem.sellingPrice) || 0,
        mrp: parseFloat(newItem.mrp) || 0,
        price, quantity, discount, discountAmount, amount,
        freeItemQuantity: parseFloat(newItem.freeItemQuantity) || 0,
      };

      setItems([...items, item]);
      setNewItem(initialNewItem);
      toast.success("Item added successfully!");

      setTimeout(() => {
        const itemCodeField = document.querySelector('[data-field="itemCode"]') as HTMLElement;
        itemCodeField?.focus();
      }, 100);
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Item deleted successfully!");
  };

  const resetForm = () => {
    setSelectedSupplierId("");
    setShop("");
    setBillNo("");
    setBillingDate(undefined);
    setReceivedDate(undefined);
    setItems([]);
    setExtraDiscount("0");
    setEditingId(null);
    setNewItem(initialNewItem);
    [setOpen, setBillingDateOpen, setReceivedDateOpen, setItemCodeOpen, setItemNameOpen].forEach(setter => setter(false));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;

  const handleSaveInvoice = async () => {
    try {
      const validations = [
        { condition: !selectedSupplierId, message: "Please select a supplier!" },
        { condition: !shop, message: "Please select a shop!" },
        { condition: !billNo.trim(), message: "Please enter a Bill Number!" },
        { condition: !billingDate || !receivedDate, message: "Please select billing and received dates!" },
        { condition: items.length === 0, message: "Please add at least one item!" }
      ];

      const failedValidation = validations.find(v => v.condition);
      if (failedValidation) {
        toast.error(failedValidation.message);
        return;
      }

      toast.loading("Saving invoice...", { id: "save-invoice" });

      const formatDateForBackend = (date: Date | undefined) => 
        date ? new Date(date).toISOString().split("T")[0] : "";

      const payload: CreateSupplierBillDto = {
        supplierId: selectedSupplierId,
        location_id: Number(shop),
        billNo: billNo.trim(),
        billingDate: formatDateForBackend(billingDate),
        receivedDate: formatDateForBackend(receivedDate),
        items: items.map(item => ({
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

      const response = await createSupplierBill(payload).unwrap();

      toast.dismiss("save-invoice");
      toast.success("Invoice saved successfully!", {
        description: `Bill No: ${billNo} has been created`,
        duration: 4000,
      });

      resetForm();
    } catch (error: any) {
      toast.dismiss("save-invoice");
      const errorMessage = error?.data?.message || error?.message || "Failed to save invoice. Please try again.";
      toast.error(`Failed to save invoice: ${errorMessage}`);
    }
  };

  const renderDropdown = (
    open: boolean,
    setOpen: (open: boolean) => void,
    value: string,
    placeholder: string,
    options: any[],
    onSelect: (value: string) => void,
    getOptionValue: (option: any) => string,
    getOptionLabel: (option: any) => string,
    searchPlaceholder: string,
    width: string = "w-full",
    disabled: boolean = false
  ) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${width} justify-between h-10 px-3 text-sm`}
          disabled={disabled}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{disabled ? "Loading..." : "No items found."}</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={getOptionLabel(option)}
                  onSelect={() => onSelect(getOptionValue(option))}
                >
                  {getOptionLabel(option)}
                  <Check className={cn("ml-auto h-4 w-4", value === getOptionValue(option) ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  const renderDatePicker = (
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
    label: string
  ) => (
    <div className="w-[250px] space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(date) => { setDate(date); setOpen(false); }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <div className="flex gap-x-4">
            <div className="space-y-2">
              <Label>Select Supplier</Label>
              {renderDropdown(
                open, setOpen, getSelectedSupplierName(), "Select supplier...",
                suppliers, handleSupplierSelect,
                (s) => s.supplier_id.toString(), (s) => s.supplier_name,
                "Search supplier...", "w-[350px]", suppliersLoading
              )}
            </div>
            <div className="space-y-2">
              <Label>Select Shop</Label>
              <Select value={shop} onValueChange={setShop}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a shop" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {suppliersError && <p className="text-sm text-red-500">Failed to load suppliers. Please try again.</p>}
        </div>

        <div className="flex gap-x-4">
          <div className="w-[250px] space-y-2">
            <Label htmlFor="billNo">Bill Number</Label>
            <Input
              id="billNo"
              type="text"
              placeholder="Enter bill number"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              className="w-full"
            />
          </div>
          {renderDatePicker(billingDate, setBillingDate, billingDateOpen, setBillingDateOpen, "Billing Date")}
          {renderDatePicker(receivedDate, setReceivedDate, receivedDateOpen, setReceivedDateOpen, "Received Date")}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Items</h3>
          <div className="flex gap-x-2">
            <Button variant="greenOutline" onClick={handleSaveInvoice}>
              <Save className="h-4 w-4" /> Save Invoice
            </Button>
            <Button variant="blackOutline">
              <Printer className="h-4 w-4" /> Print Invoice
            </Button>
          </div>
        </div>

        {productsLoading && <div className="text-center py-1">Loading products...</div>}
        {productsError && <div className="text-center py-4 text-red-500">Failed to load products. Please try again.</div>}
        {selectedSupplierId && !productsLoading && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No products found for the selected supplier
          </div>
        )}

        <div className="border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 rounded-lg">
              <TableRow>
                {["Item Code", "Item Name", "MRP", "Unit Price", "Quantity", "Discount(%)", "D. Amount", "Free Item Qty", "Selling Price", "Amount", "Action"].map((header, i) => (
                  <TableHead key={i} className={i === 0 ? "w-[150px] py-3 px-4" : "w-[100px]"}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {editingId === item.id ? (
                      <Input value={item.itemCode} onChange={(e) => handleEditInputChange(item.id, "itemCode", e.target.value)} className="h-8" />
                    ) : item.itemCode}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input value={item.itemName} onChange={(e) => handleEditInputChange(item.id, "itemName", e.target.value)} className="h-8" />
                    ) : item.itemName}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.mrp} onChange={(e) => handleEditInputChange(item.id, "mrp", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : `$${item.mrp.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.price} onChange={(e) => handleEditInputChange(item.id, "price", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : `$${item.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.quantity} onChange={(e) => handleEditInputChange(item.id, "quantity", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : item.quantity}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.discount} onChange={(e) => handleEditInputChange(item.id, "discount", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : `${item.discount.toFixed(2)}%`}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.discountAmount} onChange={(e) => handleEditInputChange(item.id, "discountAmount", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : `${item.discountAmount.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.freeItemQuantity || 0} onChange={(e) => handleEditInputChange(item.id, "freeItemQuantity", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : item.freeItemQuantity || 0}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input type="number" value={item.sellingPrice} onChange={(e) => handleEditInputChange(item.id, "sellingPrice", parseFloat(e.target.value) || 0)} className="h-8" />
                    ) : `${item.sellingPrice.toFixed(2)}`}
                  </TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editingId === item.id ? (
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="text-green-600 hover:text-green-800">
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(item.id)} className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="bg-blue-50">
                <TableCell className="font-medium">
                  {renderDropdown(
                    itemCodeOpen, setItemCodeOpen, newItem.itemCode, "Select Code...",
                    filteredProducts, (code) => handleItemSelect('code', code),
                    (p) => p.item_code, (p) => p.item_code,
                    "Search item code...", "w-full",
                    productsLoading || filteredProducts.length === 0
                  )}
                </TableCell>
                <TableCell>
                  {renderDropdown(
                    itemNameOpen, setItemNameOpen, newItem.itemName, "Select Item...",
                    filteredProducts, (name) => handleItemSelect('name', name),
                    (p) => p.item_name, (p) => p.item_name,
                    "Search item name...", "w-full",
                    productsLoading || filteredProducts.length === 0
                  )}
                </TableCell>
                {["mrp", "price", "quantity", "discount", "discountAmount", "freeItemQuantity", "sellingPrice"].map((field, i) => (
                  <TableCell key={field}>
                    <Input
                      type="number"
                      placeholder={field === "quantity" || field === "freeItemQuantity" ? "0" : "0.00"}
                      value={newItem[field as keyof typeof newItem]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      data-field={field}
                      onKeyDown={i === 6 ? (e) => e.key === "Enter" && addItem() : (e) => handleKeyPress(e, ["price", "quantity", "discount", "discountAmount", "freeItemQuantity", "sellingPrice"][i + 1] || "mrp")}
                      className="h-10"
                      disabled={!selectedSupplierId || filteredProducts.length === 0}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <span className="text-sm text-gray-600">
                    ${newItem.price && newItem.quantity ? calculateAmount(
                      parseFloat(newItem.price) || 0,
                      parseFloat(newItem.quantity) || 0,
                      parseFloat(newItem.discount) || 0,
                      parseFloat(newItem.discountAmount) || 0
                    ).toFixed(2) : "0.00"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addItem}
                    disabled={!newItem.itemCode || !newItem.itemName || !newItem.price || !newItem.quantity || productsLoading || !selectedSupplierId || filteredProducts.length === 0}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

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