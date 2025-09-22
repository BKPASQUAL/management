"use client";

import * as React from "react";
import { Edit, Trash2, Save, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Item } from "./types";

interface ItemsListProps {
  items: Item[];
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onEditItem: (id: number, field: keyof Item, value: string | number) => void;
  onDeleteItem: (id: number) => void;
  isMobile: boolean;
}

export default function ItemsList({
  items,
  editingId,
  setEditingId,
  onEditItem,
  onDeleteItem,
  isMobile,
}: ItemsListProps) {
  const startEdit = (id: number) => {
    setEditingId(id);
  };

  const stopEdit = () => {
    setEditingId(null);
  };

  // Mobile item card component
  const MobileItemCard = ({ item }: { item: Item }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-sm">{item.itemName}</h4>
            <p className="text-xs text-gray-500">{item.itemCode}</p>
            <div className="flex items-center gap-2 mt-1">
              {item.category && (
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {item.unit}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editingId === item.id ? stopEdit() : startEdit(item.id)
              }
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              {editingId === item.id ? (
                <Save className="h-4 w-4" />
              ) : (
                <Edit className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteItem(item.id)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Label className="text-xs text-gray-500">Unit Price</Label>
            {editingId === item.id ? (
              <Input
                type="number"
                value={item.price}
                onChange={(e) =>
                  onEditItem(
                    item.id,
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">${item.price.toFixed(2)}</p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Quantity</Label>
            {editingId === item.id ? (
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onEditItem(
                    item.id,
                    "quantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">
                {item.quantity} {item.unit}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Discount (%)</Label>
            {editingId === item.id ? (
              <Input
                type="number"
                value={item.discount}
                onChange={(e) =>
                  onEditItem(
                    item.id,
                    "discount",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">{item.discount}%</p>
            )}
          </div>
          <div>
            <Label className="text-xs text-gray-500">Free Items</Label>
            {editingId === item.id ? (
              <Input
                type="number"
                value={item.freeItemQuantity || 0}
                onChange={(e) =>
                  onEditItem(
                    item.id,
                    "freeItemQuantity",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="h-8 mt-1"
              />
            ) : (
              <p className="font-medium">
                {item.freeItemQuantity || 0} {item.unit}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Amount</Label>
            <p className="font-bold text-green-600 text-lg">
              ${item.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {item.freeItemQuantity && item.freeItemQuantity > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded">
            <p className="text-xs text-green-700">
              <strong>Free Items:</strong> {item.freeItemQuantity} {item.unit}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium mb-2">No items added yet</p>
        <p className="text-sm">
          Start by adding items to your invoice using the form above
        </p>
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        // Mobile View - Cards
        <div className="space-y-4">
          {items.map((item) => (
            <MobileItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        // Desktop View - Table
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[120px]">Code</TableHead>
                <TableHead className="min-w-[200px]">
                  Item Name
                </TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[80px]">Qty</TableHead>
                <TableHead className="w-[80px]">Unit</TableHead>
                <TableHead className="w-[80px]">Disc%</TableHead>
                <TableHead className="w-[80px]">Free</TableHead>
                <TableHead className="w-[120px]">Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {item.itemCode}
                      </p>
                      {item.category && (
                        <Badge
                          variant="secondary"
                          className="text-xs mt-1"
                        >
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={item.itemName}
                        onChange={(e) =>
                          onEditItem(
                            item.id,
                            "itemName",
                            e.target.value
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      <div className="font-medium">{item.itemName}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          onEditItem(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onEditItem(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {item.unit}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          onEditItem(
                            item.id,
                            "discount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      <span>{item.discount}%</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        type="number"
                        value={item.freeItemQuantity || 0}
                        onChange={(e) =>
                          onEditItem(
                            item.id,
                            "freeItemQuantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-8"
                      />
                    ) : (
                      <span className="text-green-600">
                        {item.freeItemQuantity || 0}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">
                      ${item.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editingId === item.id
                            ? stopEdit()
                            : startEdit(item.id)
                        }
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        {editingId === item.id ? (
                          <Save className="h-4 w-4" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}