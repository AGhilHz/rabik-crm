import { formatDate, formatCurrency } from "@/lib/crm-utils";
import { TAX_RATE } from "@/lib/crm-constants";

interface InvoicePDFProps {
  invoice: any;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاکتور ${invoice.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Tahoma, Arial, sans-serif; padding: 40px; background: #f5f5f5; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #1E3A8A; padding-bottom: 20px; }
    .logo { font-size: 32px; font-weight: bold; color: #1E3A8A; }
    .invoice-info { text-align: left; }
    .invoice-number { font-size: 24px; font-weight: bold; color: #1E3A8A; margin-bottom: 5px; }
    .date { color: #666; font-size: 14px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party { flex: 1; }
    .party h3 { color: #1E3A8A; margin-bottom: 10px; font-size: 16px; }
    .party p { margin: 5px 0; color: #333; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #1E3A8A; color: white; padding: 12px; text-align: right; font-size: 14px; }
    td { padding: 12px; border-bottom: 1px solid #ddd; text-align: right; font-size: 14px; }
    tr:hover { background: #f9f9f9; }
    .totals { margin-right: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .total-row.final { border-top: 2px solid #1E3A8A; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #1E3A8A; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
    .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; border-right: 4px solid #1E3A8A; }
    .notes h4 { margin-bottom: 10px; color: #1E3A8A; }
    @media print {
      body { padding: 0; background: white; }
      .invoice { box-shadow: none; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">رابیک</div>
      <div class="invoice-info">
        <div class="invoice-number">${invoice.invoice_number}</div>
        <div class="date">تاریخ صدور: ${formatDate(invoice.issue_date)}</div>
        <div class="date">تاریخ سررسید: ${formatDate(invoice.due_date)}</div>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h3>فروشنده:</h3>
        <p><strong>رابیک - آژانس دیجیتال مارکتینگ</strong></p>
        <p>گرگان، ایران</p>
        <p>تلفن: 09123456789</p>
        <p>ایمیل: info@rabik.ir</p>
      </div>
      <div class="party">
        <h3>خریدار:</h3>
        <p><strong>${invoice.customer?.full_name}</strong></p>
        ${invoice.customer?.company_name ? `<p>${invoice.customer.company_name}</p>` : ""}
        ${invoice.customer?.phone ? `<p>تلفن: ${invoice.customer.phone}</p>` : ""}
        <p>ایمیل: ${invoice.customer?.email}</p>
        ${invoice.customer?.address ? `<p>${invoice.customer.address}</p>` : ""}
      </div>
    </div>

    ${invoice.project ? `<p style="margin-bottom: 20px; color: #666;"><strong>پروژه:</strong> ${invoice.project.title}</p>` : ""}

    <table>
      <thead>
        <tr>
          <th style="width: 50px;">ردیف</th>
          <th>شرح خدمات/کالا</th>
          <th style="width: 80px; text-align: center;">تعداد</th>
          <th style="width: 120px; text-align: left;">قیمت واحد</th>
          <th style="width: 120px; text-align: left;">مبلغ کل</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items?.map((item: any, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <strong>${item.title}</strong>
              ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ""}
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: left;">${formatCurrency(item.unit_price)}</td>
            <td style="text-align: left;"><strong>${formatCurrency(item.total)}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>جمع کل:</span>
        <span><strong>${formatCurrency(invoice.subtotal)}</strong></span>
      </div>
      ${invoice.discount > 0 ? `
        <div class="total-row" style="color: #dc2626;">
          <span>تخفیف:</span>
          <span><strong>-${formatCurrency(invoice.discount)}</strong></span>
        </div>
      ` : ""}
      <div class="total-row">
        <span>مالیات بر ارزش افزوده (${(TAX_RATE * 100).toFixed(0)}%):</span>
        <span><strong>+${formatCurrency(invoice.tax)}</strong></span>
      </div>
      <div class="total-row final">
        <span>مبلغ قابل پرداخت:</span>
        <span>${formatCurrency(invoice.total)}</span>
      </div>
    </div>

    ${invoice.notes ? `
      <div class="notes">
        <h4>یادداشت:</h4>
        <p>${invoice.notes.replace(/\n/g, "<br>")}</p>
      </div>
    ` : ""}

    <div class="footer">
      <p>این فاکتور به صورت الکترونیکی صادر شده و نیازی به امضا و مهر ندارد.</p>
      <p style="margin-top: 10px;">رابیک - ارتباط بینهایت با مشتری | www.rabik.ir</p>
    </div>
  </div>

  <div style="text-align: center; margin: 20px;">
    <button onclick="window.print()" style="background: #1E3A8A; color: white; border: none; padding: 12px 30px; font-size: 16px; border-radius: 8px; cursor: pointer; font-family: Tahoma;">
      چاپ فاکتور
    </button>
  </div>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return { generatePDF };
};
