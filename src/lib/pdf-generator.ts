import html2pdf from 'html2pdf.js';
import { InvoiceData } from './types';

export const generatePDFContent = (invoiceData: InvoiceData): string => {
  return `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; border: 2px solid #333; border-radius: 8px;">
      ${invoiceData.logo ? `<img src="${invoiceData.logo}" style="max-width: 150px; margin-bottom: 20px;"/>` : ''}
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div style="border-right: 1px solid #eee; padding-right: 20px;">
          <h2 style="color: #1a1a1a; margin-bottom: 10px;">From</h2>
          <p style="margin: 5px 0;">${invoiceData.fromDetails.name}</p>
          <p style="margin: 5px 0;">${invoiceData.fromDetails.company}</p>
          <p style="margin: 5px 0;">${invoiceData.fromDetails.email}</p>
        </div>
        <div style="text-align: right;">
          <h1 style="color: #1a1a1a; margin-bottom: 10px; border-bottom: 2px solid #333; padding-bottom: 5px;">INVOICE</h1>
          <p style="margin: 5px 0;">${invoiceData.invoiceNumber}</p>
          <p style="margin: 5px 0;">Date: ${invoiceData.date}</p>
        </div>
      </div>

      <div style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
        <h2 style="color: #1a1a1a; margin-bottom: 10px;">Bill To</h2>
        <p style="margin: 5px 0;">${invoiceData.billTo.name}</p>
        <p style="margin: 5px 0;">${invoiceData.billTo.email}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 1px solid #ddd;">
        <thead>
          <tr style="background-color: #f4f4f4;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Item</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Price</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoiceData.items.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${item.description}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${item.quantity}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${invoiceData.currency.symbol}${item.price.toFixed(2)}</td>
              <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">${invoiceData.currency.symbol}${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="text-align: right; margin-bottom: 40px; border-top: 2px solid #333; padding-top: 20px;">
        <h3 style="margin: 0;">Total: ${invoiceData.currency.symbol}${invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</h3>
      </div>

      <div style="margin-bottom: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="color: #1a1a1a; margin-bottom: 10px;">Terms</h3>
        <p style="margin: 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 4px;">${invoiceData.terms}</p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="color: #1a1a1a; margin-bottom: 10px;">Notes</h3>
        <p style="margin: 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; border-radius: 4px;">${invoiceData.notes}</p>
      </div>
    </div>
  `;
};

export const downloadPDF = (invoiceData: InvoiceData) => {
  const element = document.createElement('div');
  element.innerHTML = generatePDFContent(invoiceData);
  
  const opt = {
    margin: 1,
    filename: `${invoiceData.invoiceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};