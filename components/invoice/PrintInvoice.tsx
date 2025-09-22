// components/invoice/PrintInvoice.tsx - Simple working version
"use client";

import React from "react";
import { Customer, Item } from "./types";

interface PrintInvoiceProps {
  selectedCustomer: string;
  customers: Customer[];
  invoiceNo: string;
  billingDate: Date;
  paymentMethod: string;
  items: Item[];
  subtotal: number;
  extraDiscount: string;
  extraDiscountAmount: number;
  finalTotal: number;
  totalItems: number;
}

export default function PrintInvoice({
  selectedCustomer,
  customers,
  invoiceNo,
  billingDate,
  paymentMethod,
  items,
  subtotal,
  extraDiscount,
  extraDiscountAmount,
  finalTotal,
  totalItems,
}: PrintInvoiceProps) {
  const customer = customers.find(
    (c) => c?.id?.toString() === selectedCustomer
  );

  return (
    <>
      <div id="print-invoice" style={{ display: "none" }}>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            lineHeight: "1.4",
            color: "#333",
            padding: "20px",
            background: "white",
          }}
        >
          {/* Invoice Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              borderBottom: "3px solid #2c5282",
              paddingBottom: "15px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2c5282",
                  marginBottom: "5px",
                }}
              >
                Your Company Name
              </div>
              <div
                style={{ fontSize: "11px", color: "#666", lineHeight: "1.3" }}
              >
                123 Business Street
                <br />
                City, State 12345
                <br />
                Phone: (555) 123-4567
                <br />
                Email: info@company.com
                <br />
                Website: www.company.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1
                style={{
                  fontSize: "28px",
                  color: "#2c5282",
                  margin: "0 0 5px 0",
                }}
              >
                INVOICE
              </h1>
              <div style={{ fontSize: "14px", color: "#666" }}>
                #{invoiceNo}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
            }}
          >
            <div style={{ flex: 1, marginRight: "40px" }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c5282",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Bill To:
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  {customer?.customerName || "Customer Name"}
                </div>
                {customer?.address && (
                  <>
                    {customer.address}
                    <br />
                  </>
                )}
                {customer?.contactNumber && (
                  <>
                    Phone: {customer.contactNumber}
                    <br />
                  </>
                )}
                {customer?.shopName && (
                  <>
                    Shop: {customer.shopName}
                    <br />
                  </>
                )}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#2c5282",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Invoice Details:
              </div>
              <div>
                <strong>Invoice Date:</strong>{" "}
                {billingDate.toLocaleDateString()}
                <br />
                <strong>Payment Method:</strong> {paymentMethod}
                <br />
                <strong>Total Items:</strong> {totalItems}
                <br />
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Item Code
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Item Name
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Unit Price
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Unit
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Discount %
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Free Qty
                </th>
                <th
                  style={{
                    background: "#2c5282",
                    color: "white",
                    padding: "10px 8px",
                    textAlign: "right",
                    fontWeight: "bold",
                    border: "1px solid #2c5282",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id || index}
                  style={{
                    backgroundColor: index % 2 === 1 ? "#f8f9fa" : "white",
                  }}
                >
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.itemCode}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {item.itemName}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {item.unit}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                    }}
                  >
                    {item.discount}%
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {item.freeItemQuantity || 0}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                    }}
                  >
                    ${item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <table style={{ width: "300px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                      background: "#f8f9fa",
                    }}
                  >
                    Subtotal:
                  </td>
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                      background: "#f8f9fa",
                    }}
                  >
                    Extra Discount ({extraDiscount}%):
                  </td>
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    -${extraDiscountAmount.toFixed(2)}
                  </td>
                </tr>
                <tr
                  style={{
                    background: "#2c5282",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      fontWeight: "bold",
                    }}
                  >
                    TOTAL:
                  </td>
                  <td
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ${finalTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid #ddd",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#2c5282",
                    marginBottom: "8px",
                    fontSize: "12px",
                  }}
                >
                  Terms & Conditions:
                </div>
                <div style={{ fontSize: "11px", lineHeight: "1.4" }}>
                  • Payment is due within 30 days
                  <br />
                  • Late payments may incur fees
                  <br />• All sales are final
                </div>
              </div>
              <div style={{ textAlign: "center", width: "200px" }}>
                <div
                  style={{
                    borderTop: "1px solid #333",
                    marginTop: "40px",
                    paddingTop: "5px",
                    fontSize: "11px",
                  }}
                >
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide everything when printing */
          body * {
            visibility: hidden;
          }

          /* Show only the print invoice */
          #print-invoice,
          #print-invoice * {
            visibility: visible;
          }

          #print-invoice {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }

          /* Page settings */
          @page {
            margin: 0.5in;
            size: A4;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
