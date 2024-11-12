import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem, Currency } from '@/lib/types';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  currency: Currency;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onItemChange: (id: number, changes: Partial<InvoiceItem>) => void;
}

export function InvoiceItems({
  items,
  currency,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: InvoiceItemsProps) {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Items</h2>
          <Button variant="outline" onClick={onAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <Label>Item Name</Label>
                  <Input
                    className="mt-1"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => onItemChange(item.id, { name: e.target.value })}
                  />
                </div>
                <div className="md:col-span-4">
                  <Label>Description</Label>
                  <Input
                    className="mt-1"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => onItemChange(item.id, { description: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onItemChange(item.id, { quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Price</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => onItemChange(item.id, { price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-right mt-6">
          <h3 className="text-xl font-semibold">
            Total: {currency.symbol}{calculateTotal().toFixed(2)}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}