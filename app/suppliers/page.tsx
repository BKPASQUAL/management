"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  code: string;
}

interface RepCode {
  id: string;
  name: string;
}

interface BillItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface BillData {
  customer: string;
  date: string;
  repCode: string;
  items: BillItem[];
}

export default function CreateBillForm() {
  const [billData, setBillData] = useState<BillData>({
    customer: '',
    date: '',
    repCode: '',
    items: [{ itemCode: '', itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
  });

  const customers: Customer[] = [
    { id: '1', name: 'John Smith', code: 'CU001' },
    { id: '2', name: 'ABC Company', code: 'CU002' },
    { id: '3', name: 'XYZ Corporation', code: 'CU003' },
    { id: '4', name: 'Tech Solutions Ltd', code: 'CU004' }
  ];

  const repCodes: RepCode[] = [
    { id: 'REP001', name: 'Sales Rep 1' },
    { id: 'REP002', name: 'Sales Rep 2' },
    { id: 'REP003', name: 'Sales Rep 3' }
  ];

  const addItem = (): void => {
    setBillData(prev => ({
      ...prev,
      items: [...prev.items, { itemCode: '', itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index: number): void => {
    setBillData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: string | number): void => {
    setBillData(prev => {
      const updatedItems = prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          // Calculate total price when quantity or unit price changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const calculateGrandTotal = (): string => {
    return billData.items.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
  };

  const handleSubmit = (): void => {
    console.log('Bill Data:', billData);
    alert('Bill created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto space-y-6">
        {/* Header */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center">Create New Bill</CardTitle>
          </CardHeader>
        </Card>

        {/* Bill Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Bill Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Select Customer</Label>
                <Select 
                  value={billData.customer} 
                  onValueChange={(value: string) => setBillData(prev => ({ ...prev, customer: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={billData.date}
                  onChange={(e) => setBillData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repCode">Rep Code</Label>
                <Select 
                  value={billData.repCode} 
                  onValueChange={(value: string) => setBillData(prev => ({ ...prev, repCode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rep code" />
                  </SelectTrigger>
                  <SelectContent>
                    {repCodes.map(rep => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.id} - {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Bill Items</CardTitle>
              <Button onClick={addItem} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Item Code</th>
                    <th className="text-left p-3 font-semibold">Item Name</th>
                    <th className="text-center p-3 font-semibold">Qty</th>
                    <th className="text-right p-3 font-semibold">Unit Price</th>
                    <th className="text-right p-3 font-semibold">Total Price</th>
                    <th className="text-center p-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <Input
                          placeholder="Item Code"
                          value={item.itemCode}
                          onChange={(e) => updateItem(index, 'itemCode', e.target.value)}
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          placeholder="Item Name"
                          value={item.itemName}
                          onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                          className="min-w-[200px]"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="min-w-[80px] text-center"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="min-w-[100px] text-right"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-semibold text-lg">
                          ${item.totalPrice.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {billData.items.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Total Section */}
        <Card className="w-full bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-end items-center">
              <div className="text-right space-y-2">
                <div className="text-lg font-medium">Grand Total:</div>
                <div className="text-3xl font-bold text-blue-600">
                  ${calculateGrandTotal()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleSubmit} 
                className="px-8 py-3 text-lg"
                size="lg"
              >
                Create Bill
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-3 text-lg"
                size="lg"
              >
                Save as Draft
              </Button>
              <Button 
                variant="secondary" 
                className="px-8 py-3 text-lg"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}