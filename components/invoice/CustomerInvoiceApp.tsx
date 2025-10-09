// components/invoice/CustomerInvoiceApp.tsx - With Authentication
"use client";

import * as React from "react";
import { Save, X, Package, FileCheck } from "lucide-react";
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
  paymentMethods,
} from "./types";
import PrintInvoice from "./PrintInvoice";

export default function CustomerInvoiceApp() {
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
  const [isSaveAndPrintLoading, setIsSaveAndPrintLoading] =
    React.useState(false);

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

  // Helper function to get auth headers
  const getAuthHeaders = React.useCallback(() => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Get token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }, []);

  // Generate invoice number on client side
  React.useEffect(() => {
    if (!invoiceNo) {
      setInvoiceNo(`INV-${Date.now().toString().slice(-6)}`);
    }
  }, [invoiceNo]);

  // Fetch customers from API with authentication
  const fetchCustomers = React.useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
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

      // Show error toast
      addToast({
        type: "error",
        title: "Failed to Load Customers",
        description:
          error instanceof Error ? error.message : "Failed to fetch customers",
        duration: 5000,
      });
    } finally {
      setCustomersLoading(false);
    }
  }, [getAuthHeaders, addToast]);

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

  // Clear all fields function
  const clearAllFields = () => {
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
    setBillingDate(new Date());
    setEditingId(null);
    setCustomerOpen(false);
    setPaymentMethodOpen(false);
    setItemCodeOpen(false);
    setItemNameOpen(false);
  };

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

  // Validation function
  const validateInvoice = () => {
    if (items.length === 0) {
      addToast({
        type: "error",
        title: "No Items Added",
        description: "Please add at least one item to save the invoice.",
        duration: 4000,
      });
      return false;
    }
    if (!selectedCustomer) {
      addToast({
        type: "error",
        title: "Customer Required",
        description: "Please select a customer before saving the invoice.",
        duration: 4000,
      });
      return false;
    }
    if (!paymentMethod) {
      addToast({
        type: "error",
        title: "Payment Method Required",
        description:
          "Please select a payment method before saving the invoice.",
        duration: 4000,
      });
      return false;
    }
    return true;
  };

  // Save invoice function with authentication
  const saveInvoice = async (shouldPrint = false) => {
    if (!validateInvoice()) return;

    const loadingStateSetter = shouldPrint
      ? setIsSaveAndPrintLoading
      : setIsLoading;
    loadingStateSetter(true);

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

      // Call backend API with authentication headers
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customer-bills`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Success notification
      addToast({
        type: "success",
        title: shouldPrint
          ? "Invoice Saved & Print Ready!"
          : "Invoice Saved Successfully!",
        description: `Invoice ${
          result.data.invoice_no
        } has been saved with ${totalItems} items totaling $${finalTotal.toFixed(
          2
        )}.${shouldPrint ? " Preparing for print..." : ""}`,
        duration: 6000,
      });

      // Clear form after successful save
      if (shouldPrint) {
        setTimeout(() => {
          window.print();
          setTimeout(() => {
            clearAllFields();
          }, 2000);
        }, 1000);
      } else {
        clearAllFields();
      }
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
      loadingStateSetter(false);
    }
  };

  const handleSaveOnly = () => saveInvoice(false);
  const handleSaveAndPrint = () => saveInvoice(true);

  const clearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      clearAllFields();

      addToast({
        type: "info",
        title: "Invoice Cleared",
        description: "All invoice data has been cleared. You can start fresh.",
        duration: 3000,
      });
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extraDiscountAmount = (subtotal * parseFloat(extraDiscount)) / 100;
  const finalTotal = subtotal - extraDiscountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Loading state
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
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSaveOnly}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={
                  items.length === 0 || isLoading || isSaveAndPrintLoading
                }
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Invoice"}
              </Button>
              <Button
                onClick={handleSaveAndPrint}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  items.length === 0 || isLoading || isSaveAndPrintLoading
                }
              >
                <FileCheck className="h-4 w-4 mr-2" />
                {isSaveAndPrintLoading
                  ? "Saving & Printing..."
                  : "Save & Print"}
              </Button>
            </div>
          </div>

          {/* Add Item Form */}
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
            onClick={handleSaveOnly}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            disabled={items.length === 0 || isLoading || isSaveAndPrintLoading}
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? "Saving..." : "Save Invoice"}
          </Button>
          <Button
            size="lg"
            onClick={handleSaveAndPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            disabled={items.length === 0 || isLoading || isSaveAndPrintLoading}
          >
            <FileCheck className="h-5 w-5 mr-2" />
            {isSaveAndPrintLoading ? "Saving & Printing..." : "Save & Print"}
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

        {/* Print Invoice Component */}
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
