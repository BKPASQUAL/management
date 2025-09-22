// app/admin/createCustomerBill/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer Invoice | Your App Name',
  description: 'Create and manage customer invoices',
  keywords: ['invoice', 'billing', 'customer', 'management'],
};

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}