// types.ts - Shared Types and Interfaces

export interface Customer {
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

export interface CustomersListResponse {
  statusCode: number;
  message: string;
  data: Customer[];
}

export interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
}

export interface Item {
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

export interface NewItemRow {
  itemCode: string;
  itemName: string;
  price: string;
  quantity: string;
  unit: string;
  discount: string;
  freeItemQuantity: string;
}

export interface InvoiceData {
  invoiceNo: string;
  customer?: Customer;
  billingDate: string;
  paymentMethod?: PaymentMethod;
  items: Item[];
  subtotal: number;
  extraDiscount: number;
  extraDiscountAmount: number;
  finalTotal: number;
  totalItems: number;
  createdAt: string;
}

export const paymentMethods: PaymentMethod[] = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "check", label: "Check", icon: "📝" },
  { value: "bank-transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "credit-card", label: "Credit Card", icon: "💳" },
];