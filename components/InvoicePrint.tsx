import React from "react";

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
}

interface Supplier {
  value: string;
  label: string;
  contact: string;
}

interface PaymentMethod {
  value: string;
  label: string;
  icon: string;
}

interface InvoicePrintProps {
  invoiceNo: string;
  supplier: Supplier | undefined;
  billingDate: Date;
  paymentMethod: PaymentMethod | undefined;
  items: Item[];
  subtotal: number;
  extraDiscount: number;
  extraDiscountAmount: number;
  finalTotal: number;
  totalItems: number;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({
  invoiceNo,
  supplier,
  billingDate,
  paymentMethod,
  items,
  subtotal,
  extraDiscount,
  extraDiscountAmount,
  finalTotal,
  totalItems,
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Sample data for demonstration
  const sampleItems: Item[] = [
    {
      id: 1,
      itemCode: "HW001",
      itemName: "Steel Bolts M8x50",
      price: 2.5,
      quantity: 100,
      unit: "pcs",
      discount: 5,
      amount: 237.5,
      freeItemQuantity: 5,
    },
    {
      id: 2,
      itemCode: "HW002",
      itemName: "Concrete Screws 6x40",
      price: 1.8,
      quantity: 50,
      unit: "pcs",
      discount: 0,
      amount: 90.0,
    },
    {
      id: 3,
      itemCode: "HW003",
      itemName: "PVC Pipe 4 inch",
      price: 15.0,
      quantity: 10,
      unit: "m",
      discount: 10,
      amount: 135.0,
    },
    {
      id: 4,
      itemCode: "HW004",
      itemName: "Electrical Wire 2.5mm",
      price: 3.2,
      quantity: 25,
      unit: "m",
      discount: 0,
      amount: 80.0,
    },
    {
      id: 5,
      itemCode: "HW005",
      itemName: "Paint Brush Set",
      price: 12.0,
      quantity: 3,
      unit: "set",
      discount: 15,
      amount: 30.6,
    },
    {
      id: 6,
      itemCode: "HW006",
      itemName: "Cement Portland",
      price: 8.5,
      quantity: 20,
      unit: "kg",
      discount: 8,
      amount: 156.4,
    },
    {
      id: 7,
      itemCode: "HW007",
      itemName: "Wooden Planks 2x4",
      price: 25.0,
      quantity: 8,
      unit: "pcs",
      discount: 12,
      amount: 176.0,
    },
    {
      id: 8,
      itemCode: "HW008",
      itemName: "Metal Hinges",
      price: 4.5,
      quantity: 12,
      unit: "pcs",
      discount: 0,
      amount: 54.0,
    },
    {
      id: 9,
      itemCode: "HW009",
      itemName: "Sandpaper Assorted",
      price: 2.0,
      quantity: 15,
      unit: "sheet",
      discount: 5,
      amount: 28.5,
      freeItemQuantity: 2,
    },
    {
      id: 10,
      itemCode: "HW010",
      itemName: "Safety Gloves",
      price: 6.0,
      quantity: 5,
      unit: "pair",
      discount: 0,
      amount: 30.0,
    },
  ];

  const displayItems = items.length > 0 ? items.slice(0, 10) : sampleItems;
  const displaySubtotal = items.length > 0 ? subtotal : 1018.0;
  const displayExtraDiscount = items.length > 0 ? extraDiscount : 5;
  const displayExtraDiscountAmount =
    items.length > 0 ? extraDiscountAmount : 50.9;
  const displayFinalTotal = items.length > 0 ? finalTotal : 967.1;
  const displayTotalItems = items.length > 0 ? totalItems : 10;

  return (
    <div
      className="w-full max-w-[210mm] mx-auto bg-white"
      style={{ minHeight: "297mm", fontSize: "12px" }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-600">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 mb-1">
              CHAPIKA HARDWARE
            </h1>
            <p className="text-sm text-gray-600 mb-1">
              123 Main Street, Business District
            </p>
            <p className="text-sm text-gray-600">
              Phone: (555) 123-4567 | Tax ID: 123-456-789
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-800 mb-1">INVOICE</h2>
            <p className="text-sm font-semibold">#{invoiceNo || "INV-001"}</p>
            <p className="text-xs text-gray-600">
              Date: {formatDate(billingDate || new Date())}
            </p>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              BILL TO:
            </h3>
            <p className="font-medium">
              {supplier?.label || "ABC Construction Ltd"}
            </p>
            <p className="text-xs text-gray-600">
              {supplier?.contact || "Contact: +94 77 123 4567"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              PAYMENT:
            </h3>
            <p className="font-medium">
              {paymentMethod?.label || "Cash Payment"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border border-gray-300 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                  Item Code
                </th>
                <th className="border border-gray-300 px-2 py-2 text-left font-semibold">
                  Description
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                  Price
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                  Qty
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                  Unit
                </th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold">
                  Disc%
                </th>
                <th className="border border-gray-300 px-2 py-2 text-right font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}
                >
                  <td className="border border-gray-300 px-2 py-2">
                    {item.itemCode}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 font-medium">
                    {item.itemName}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {item.discount}%
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                    ${item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Fill empty rows if less than 10 items */}
              {displayItems.length < 10 &&
                Array.from({ length: 10 - displayItems.length }).map(
                  (_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className="border border-gray-300 px-2 py-2 h-6">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &nbsp;
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-64 border border-gray-300">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h3 className="font-semibold text-sm">INVOICE SUMMARY</h3>
            </div>
            <div className="px-4 py-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Subtotal ({displayTotalItems} items):</span>
                <span className="font-semibold">
                  ${displaySubtotal.toFixed(2)}
                </span>
              </div>
              {displayExtraDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Extra Discount ({displayExtraDiscount}%):</span>
                  <span>-${displayExtraDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-base font-bold text-blue-800">
                  <span>TOTAL:</span>
                  <span>${displayFinalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Items (if any) */}
        {displayItems.some(
          (item) => item.freeItemQuantity && item.freeItemQuantity > 0
        ) && (
          <div className="mb-6 bg-green-50 border border-green-200 p-3">
            <h3 className="text-sm font-semibold text-green-800 mb-2">
              FREE ITEMS INCLUDED:
            </h3>
            <div className="text-xs space-y-1">
              {displayItems
                .filter(
                  (item) => item.freeItemQuantity && item.freeItemQuantity > 0
                )
                .map((item) => (
                  <div key={`free-${item.id}`} className="flex justify-between">
                    <span>{item.itemName}</span>
                    <span className="font-semibold text-green-700">
                      {item.freeItemQuantity} {item.unit} (FREE)
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4">
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
              <ul className="text-gray-600 space-y-1 leading-tight">
                <li>• Payment due within 30 days</li>
                <li>• Returns within 7 days with receipt</li>
                <li>• All sales are final unless specified</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="mb-2">Authorized Signature:</p>
              <div className="border-b border-gray-400 w-32 ml-auto mb-2 mt-4"></div>
              <p className="text-xs text-gray-500">Chapika Hardware</p>
            </div>
          </div>
          <div className="text-center mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
