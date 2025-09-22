"use client";

import { ToastProvider } from '@/components/ui/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import CustomerInvoiceApp from './CustomerInvoiceApp';

export default function InvoiceWrapper() {
  return (
    <ToastProvider>
      <CustomerInvoiceApp />
      <ToastContainer />
    </ToastProvider>
  );
}