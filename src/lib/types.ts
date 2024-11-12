export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface InvoiceItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface FromDetails {
  name: string;
  company: string;
  email: string;
}

export interface BillTo {
  name: string;
  email: string;
}

export interface InvoiceData {
  logo: string | null;
  invoiceNumber: string;
  date: string;
  fromDetails: FromDetails;
  billTo: BillTo;
  items: InvoiceItem[];
  terms: string;
  notes: string;
  currency: Currency;
}