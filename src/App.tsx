import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileDown, Eye, Mail, Printer } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoiceItems } from '@/components/InvoiceItems';
import { currencies } from '@/lib/constants';
import { downloadPDF, generatePDFContent } from '@/lib/pdf-generator';
import type { InvoiceData, InvoiceItem } from '@/lib/types';

export default function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    logo: null,
    invoiceNumber: `INV-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toISOString().split('T')[0],
    fromDetails: {
      name: '',
      company: '',
      email: '',
    },
    billTo: {
      name: '',
      email: '',
    },
    items: [
      {
        id: 1,
        name: '',
        description: '',
        quantity: 1,
        price: 0,
      }
    ],
    terms: '',
    notes: '',
    currency: currencies[0],
  });

  const [previewHtml, setPreviewHtml] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData({ ...invoiceData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    const html = generatePDFContent(invoiceData);
    setPreviewHtml(html);
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          id: invoiceData.items.length + 1,
          name: '',
          description: '',
          quantity: 1,
          price: 0,
        }
      ]
    });
  };

  const removeItem = (id: number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter(item => item.id !== id)
    });
  };

  const updateItem = (id: number, changes: Partial<InvoiceItem>) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(item =>
        item.id === id ? { ...item, ...changes } : item
      )
    });
  };

  const handlePrint = () => {
    const printContent = generatePDFContent(invoiceData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailTo,
          invoiceData: invoiceData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: "The invoice has been sent successfully.",
        });
        setEmailDialogOpen(false);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send the invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Invoice Preview</DialogTitle>
                </DialogHeader>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => downloadPDF(invoiceData)}>
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Invoice</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="email-to">Recipient Email</Label>
                  <input
                    id="email-to"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="Enter recipient's email"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleSendEmail}>Send Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="currency">Currency:</Label>
            <Select
              value={invoiceData.currency.code}
              onValueChange={(value) => {
                const selectedCurrency = currencies.find(c => c.code === value);
                if (selectedCurrency) {
                  setInvoiceData({ ...invoiceData, currency: selectedCurrency });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <InvoiceForm
          logo={invoiceData.logo}
          invoiceNumber={invoiceData.invoiceNumber}
          date={invoiceData.date}
          fromDetails={invoiceData.fromDetails}
          billTo={invoiceData.billTo}
          onLogoUpload={handleLogoUpload}
          onFromDetailsChange={(details) => setInvoiceData({
            ...invoiceData,
            fromDetails: { ...invoiceData.fromDetails, ...details }
          })}
          onBillToChange={(details) => setInvoiceData({
            ...invoiceData,
            billTo: { ...invoiceData.billTo, ...details }
          })}
          onDateChange={(date) => setInvoiceData({ ...invoiceData, date })}
          onInvoiceNumberChange={(number) => setInvoiceData({ ...invoiceData, invoiceNumber: number })}
        />

        <InvoiceItems
          items={invoiceData.items}
          currency={invoiceData.currency}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onItemChange={updateItem}
        />

        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Terms</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Enter invoice terms"
                  value={invoiceData.terms}
                  onChange={(e) => setInvoiceData({ ...invoiceData, terms: e.target.value })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Enter additional notes"
                  value={invoiceData.notes}
                  onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button onClick={handlePrint} className="w-full max-w-xs">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}