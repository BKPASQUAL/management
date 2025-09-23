// components/invoice/CustomerInvoiceApp.tsx - Fixed version with stock integration
"use client";

import * as React from "react";
import { Save, Printer, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/ToastContext";
import InvoiceHeader from "./InvoiceHeader";
import AddItemForm from "./AddItemForm";
import ItemsList from "./ItemsList";
import InvoiceSummary from "./InvoiceSummary";
import {
  Customer,
  CustomersListResponse,
  Item,
  NewItemRow,
  InvoiceData,
  paymentMethods,
} from "./types";
import PrintInvoice from "./PrintInvoice";

export default function CustomerInvoiceApp() {
  // Toast hook
  const { addToast } = useToast();

  // Customer API state
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = React.useState(false);
  const [customersError, setCustomersError] = React.useState<string | null>(
    null
  );

  // Header state
  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState("");

  // Fix hydration issue by using useEffect for invoice number generation
  const [invoiceNo, setInvoiceNo] = React.useState("");
  const [billingDate, setBillingDate] = React.useState<Date>(new Date());
  const [billingDateOpen, setBillingDateOpen] = React.useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [paymentMethodOpen, setPaymentMethodOpen] = React.useState(false);

  // Items state
  const [items, setItems] = React.useState<Item[]>([]);
  const [extraDiscount, setExtraDiscount] = React.useState("0");
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // New item state - Updated for stock-based form
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

  // Generate invoice number on client side to avoid hydration mismatch
  React.useEffect(() => {
    if (!invoiceNo) {
      setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
    }
  }, [invoiceNo]);

  // Fetch customers from API
  const fetchCustomers = React.useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);

    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  // Item management functions
  const calculateAmount = (
    price: number,
    quantity: number,
    discount: number
  ): number => {
    const subtotal = price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const addItem = (item: Item) => {
    setItems([...items, item]);
    addToast({
      type: "success",
      title: "Item Added",
      description: `${item.itemName} has been added to the invoice.`,
      duration: 3000,
    });
  };

  const deleteItem = (id: number) => {
    const itemToDelete = items.find((item) => item.id === id);
    setItems(items.filter((item) => item.id !== id));

    if (itemToDelete) {
      addToast({
        type: "info",
        title: "Item Removed",
        description: `${itemToDelete.itemName} has been removed from the invoice.`,
        duration: 3000,
      });
    }
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

  const saveInvoice = async () => {
    if (items.length === 0) {
      addToast({
        type: "error",
        title: "No Items Added",
        description: "Please add at least one item to save the invoice.",
        duration: 4000,
      });
      return;
    }
    if (!selectedCustomer) {
      addToast({
        type: "error",
        title: "Customer Required",
        description: "Please select a customer before saving the invoice.",
        duration: 4000,
      });
      return;
    }
    if (!paymentMethod) {
      addToast({
        type: "error",
        title: "Payment Method Required",
        description:
          "Please select a payment method before saving the invoice.",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend
      const invoiceData = {
        selectedCustomer: selectedCustomer,
        invoiceNo: invoiceNo,
        billingDate: billingDate.toISOString(),
        paymentMethod: {
          value: paymentMethod,
          label:
            paymentMethods.find((p) => p.value === paymentMethod)?.label ||
            paymentMethod,
        },
        items: items.map((item) => ({
          itemCode: item.itemCode,
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          discount: item.discount,
          freeItemQuantity: item.freeItemQuantity,
          amount: item.amount,
          category: item.category,
        })),
        subtotal: subtotal,
        extraDiscount: parseFloat(extraDiscount),
        extraDiscountAmount: extraDiscountAmount,
        finalTotal: finalTotal,
        totalItems: totalItems,
      };

      // Call backend API
      const response = await fetch("http://localhost:3001/customer-bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Success notification
      addToast({
        type: "success",
        title: "Invoice Saved Successfully!",
        description: `Invoice ${
          result.data.invoice_no
        } has been saved with ${totalItems} items totaling $${finalTotal.toFixed(
          2
        )}.`,
        duration: 6000,
      });

      // Clear form after successful save
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
    } catch (error) {
      console.error("Error saving invoice:", error);

      addToast({
        type: "error",
        title: "Failed to Save Invoice",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while saving the invoice.",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
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

      addToast({
        type: "info",
        title: "Invoice Cleared",
        description: "All invoice data has been cleared. You can start fresh.",
        duration: 3000,
      });
    }
  };

  const handlePrint = () => {
    // Validation checks
    if (items.length === 0) {
      addToast({
        type: "warning",
        title: "No Items to Print",
        description: "Please add items to the invoice before printing.",
        duration: 3000,
      });
      return;
    }

    if (!selectedCustomer) {
      addToast({
        type: "warning",
        title: "Customer Required",
        description: "Please select a customer before printing.",
        duration: 3000,
      });
      return;
    }

    if (!paymentMethod) {
      addToast({
        type: "warning",
        title: "Payment Method Required",
        description: "Please select a payment method before printing.",
        duration: 3000,
      });
      return;
    }

    // Show preparing toast
    addToast({
      type: "info",
      title: "Preparing Print",
      description: "Invoice is being prepared for printing...",
      duration: 2000,
    });

    // Small delay to allow toast to show, then print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Don't render until we have an invoice number
  if (!invoiceNo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <InvoiceHeader
          customers={customers}
          customersLoading={customersLoading}
          customersError={customersError}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customerOpen={customerOpen}
          setCustomerOpen={setCustomerOpen}
          billingDate={billingDate}
          setBillingDate={setBillingDate}
          billingDateOpen={billingDateOpen}
          setBillingDateOpen={setBillingDateOpen}
          fetchCustomers={fetchCustomers}
        />

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Invoice Items
              </h2>
              <p className="text-gray-600 text-sm">
                Add and manage your invoice items from stock inventory
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={saveInvoice}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={items.length === 0 || isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Invoice"}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300"
                disabled={
                  items.length === 0 || !selectedCustomer || !paymentMethod
                }
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Updated Add Item Form - Now uses stock API */}
          <AddItemForm
            newItem={newItem}
            setNewItem={setNewItem}
            itemCodeOpen={itemCodeOpen}
            setItemCodeOpen={setItemCodeOpen}
            itemNameOpen={itemNameOpen}
            setItemNameOpen={setItemNameOpen}
            onAddItem={addItem}
            existingItems={items}
          />

          {/* Items List */}
          <ItemsList
            items={items}
            editingId={editingId}
            setEditingId={setEditingId}
            onEditItem={handleEditInputChange}
            onDeleteItem={deleteItem}
            isMobile={isMobile}
          />
        </div>

        {/* Invoice Summary */}
        <InvoiceSummary
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          paymentMethodOpen={paymentMethodOpen}
          setPaymentMethodOpen={setPaymentMethodOpen}
          subtotal={subtotal}
          totalItems={totalItems}
          extraDiscount={extraDiscount}
          setExtraDiscount={setExtraDiscount}
          extraDiscountAmount={extraDiscountAmount}
          finalTotal={finalTotal}
        />

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            size="lg"
            onClick={saveInvoice}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            disabled={items.length === 0 || isLoading}
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? "Saving..." : "Save Invoice"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 border-gray-300"
            disabled={items.length === 0 || !selectedCustomer || !paymentMethod}
            onClick={handlePrint}
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Invoice
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="px-8 py-3 text-gray-600"
            onClick={clearAll}
          >
            <X className="h-5 w-5 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Print Invoice Component - Hidden but rendered for printing */}
        <PrintInvoice
          selectedCustomer={selectedCustomer}
          customers={customers}
          invoiceNo={invoiceNo}
          billingDate={billingDate}
          paymentMethod={paymentMethod}
          items={items}
          subtotal={subtotal}
          extraDiscount={extraDiscount}
          extraDiscountAmount={extraDiscountAmount}
          finalTotal={finalTotal}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
