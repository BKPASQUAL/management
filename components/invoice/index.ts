// src/components/invoice/index.ts
// Main entry point for all invoice components

export { default as CustomerInvoiceApp } from "./CustomerInvoiceApp";
export { default as InvoiceWrapper } from "./InvoiceWrapper";
export { default as InvoiceHeader } from "./InvoiceHeader";
export { default as AddItemForm } from "./AddItemForm";
export { default as ItemsList } from "./ItemsList";
export { default as InvoiceSummary } from "./InvoiceSummary";

// Export types
export type {
  Customer,
  CustomersListResponse,
  PaymentMethod,
  Item,
  NewItemRow,
  InvoiceData,
} from "./types";

// Export constants
export { paymentMethods } from "./types";
