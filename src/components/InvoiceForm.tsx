import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';
import { FromDetails, BillTo } from '@/lib/types';

interface InvoiceFormProps {
  logo: string | null;
  invoiceNumber: string;
  date: string;
  fromDetails: FromDetails;
  billTo: BillTo;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFromDetailsChange: (details: Partial<FromDetails>) => void;
  onBillToChange: (details: Partial<BillTo>) => void;
  onDateChange: (date: string) => void;
  onInvoiceNumberChange: (number: string) => void;
}

export function InvoiceForm({
  logo,
  invoiceNumber,
  date,
  fromDetails,
  billTo,
  onLogoUpload,
  onFromDetailsChange,
  onBillToChange,
  onDateChange,
  onInvoiceNumberChange,
}: InvoiceFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label className="text-lg font-semibold mb-2">Company Logo</Label>
          <div className="mt-2 flex items-center gap-4">
            {logo ? (
              <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              className="max-w-xs"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>From</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-1"
                  placeholder="Your Name"
                  value={fromDetails.name}
                  onChange={(e) => onFromDetailsChange({ name: e.target.value })}
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  className="mt-1"
                  placeholder="Company Name"
                  value={fromDetails.company}
                  onChange={(e) => onFromDetailsChange({ company: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="Email"
                  value={fromDetails.email}
                  onChange={(e) => onFromDetailsChange({ email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  className="mt-1"
                  placeholder="Client Name"
                  value={billTo.name}
                  onChange={(e) => onBillToChange({ name: e.target.value })}
                />
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="Client Email"
                  value={billTo.email}
                  onChange={(e) => onBillToChange({ email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Invoice Number</Label>
            <Input
              className="mt-1"
              value={invoiceNumber}
              onChange={(e) => onInvoiceNumberChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              className="mt-1"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}