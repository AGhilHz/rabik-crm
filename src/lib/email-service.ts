// Email Service Helper
// برای استفاده واقعی، باید با Resend یا SendGrid یکپارچه شود

import { formatDate, formatCurrency } from "./crm-utils";

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

/**
 * تولید قالب ایمیل فاکتور
 */
export const generateInvoiceEmail = (invoice: any): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Tahoma, Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .invoice-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .invoice-info p { margin: 8px 0; color: #333; }
    .invoice-info strong { color: #1E3A8A; }
    .button { display: inline-block; background: #1E3A8A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .amount { font-size: 32px; font-weight: bold; color: #1E3A8A; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧾 فاکتور جدید</h1>
      <p>رابیک - آژانس دیجیتال مارکتینگ</p>
    </div>
    
    <div class="content">
      <p>سلام <strong>${invoice.customer?.full_name}</strong> عزیز،</p>
      <p>فاکتور شما با موفقیت صادر شد.</p>
      
      <div class="invoice-info">
        <p><strong>شماره فاکتور:</strong> ${invoice.invoice_number}</p>
        <p><strong>تاریخ صدور:</strong> ${formatDate(invoice.issue_date)}</p>
        <p><strong>تاریخ سررسید:</strong> ${formatDate(invoice.due_date)}</p>
        ${invoice.project ? `<p><strong>پروژه:</strong> ${invoice.project.title}</p>` : ""}
      </div>
      
      <div class="amount">
        ${formatCurrency(invoice.total)}
      </div>
      
      <p style="text-align: center;">
        <a href="https://rabik.ir/customer/invoices/${invoice.id}" class="button">
          مشاهده و پرداخت فاکتور
        </a>
      </p>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        در صورت داشتن هرگونه سوال، با ما تماس بگیرید.
      </p>
    </div>
    
    <div class="footer">
      <p>این ایمیل به صورت خودکار ارسال شده است.</p>
      <p style="margin-top: 10px;">
        <a href="https://rabik.ir" style="color: #1E3A8A; text-decoration: none;">www.rabik.ir</a> | 
        <a href="mailto:info@rabik.ir" style="color: #1E3A8A; text-decoration: none;">info@rabik.ir</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: invoice.customer?.email,
    subject: `فاکتور ${invoice.invoice_number} - رابیک`,
    html,
  };
};

/**
 * تولید قالب ایمیل یادآوری سررسید
 */
export const generateReminderEmail = (invoice: any, daysLeft: number): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Tahoma, Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .warning { background: #FEF3C7; border-right: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ یادآوری سررسید فاکتور</h1>
    </div>
    
    <div class="content">
      <p>سلام <strong>${invoice.customer?.full_name}</strong> عزیز،</p>
      
      <div class="warning">
        <p style="margin: 0; font-weight: bold;">
          ${daysLeft > 0 
            ? `${daysLeft} روز تا سررسید فاکتور ${invoice.invoice_number} باقی مانده است.`
            : `فاکتور ${invoice.invoice_number} سررسید گذشته است.`
          }
        </p>
      </div>
      
      <p><strong>مبلغ قابل پرداخت:</strong> ${formatCurrency(invoice.total)}</p>
      <p><strong>تاریخ سررسید:</strong> ${formatDate(invoice.due_date)}</p>
      
      <p style="text-align: center;">
        <a href="https://rabik.ir/customer/invoices/${invoice.id}" class="button">
          پرداخت فاکتور
        </a>
      </p>
    </div>
    
    <div class="footer">
      <p>رابیک - آژانس دیجیتال مارکتینگ</p>
      <p><a href="https://rabik.ir" style="color: #1E3A8A;">www.rabik.ir</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: invoice.customer?.email,
    subject: `یادآوری: سررسید فاکتور ${invoice.invoice_number}`,
    html,
  };
};

/**
 * تولید قالب ایمیل تأیید پرداخت
 */
export const generatePaymentConfirmationEmail = (invoice: any, payment: any): EmailTemplate => {
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Tahoma, Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .success { background: #D1FAE5; border-right: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .receipt { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ پرداخت موفق</h1>
    </div>
    
    <div class="content">
      <p>سلام <strong>${invoice.customer?.full_name}</strong> عزیز،</p>
      
      <div class="success">
        <p style="margin: 0; font-weight: bold;">
          پرداخت شما با موفقیت انجام شد.
        </p>
      </div>
      
      <div class="receipt">
        <h3 style="margin-top: 0; color: #1E3A8A;">رسید پرداخت</h3>
        <p><strong>شماره فاکتور:</strong> ${invoice.invoice_number}</p>
        <p><strong>مبلغ پرداختی:</strong> ${formatCurrency(payment.amount)}</p>
        <p><strong>تاریخ پرداخت:</strong> ${formatDate(payment.paid_at || payment.created_at)}</p>
        ${payment.tracking_code ? `<p><strong>کد پیگیری:</strong> ${payment.tracking_code}</p>` : ""}
      </div>
      
      <p>از اعتماد شما سپاسگزاریم. 🙏</p>
    </div>
    
    <div class="footer">
      <p>رابیک - آژانس دیجیتال مارکتینگ</p>
      <p><a href="https://rabik.ir" style="color: #1E3A8A;">www.rabik.ir</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: invoice.customer?.email,
    subject: `تأیید پرداخت فاکتور ${invoice.invoice_number}`,
    html,
  };
};

/**
 * ارسال ایمیل (نیاز به یکپارچهسازی با Resend/SendGrid)
 */
export const sendEmail = async (emailData: EmailTemplate): Promise<boolean> => {
  try {
    // TODO: یکپارچهسازی با Resend یا SendGrid
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@rabik.ir',
    //     to: emailData.to,
    //     subject: emailData.subject,
    //     html: emailData.html,
    //   }),
    // });
    
    console.log("Email would be sent to:", emailData.to);
    console.log("Subject:", emailData.subject);
    
    // برای تست، فقط لاگ میکنیم
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * ارسال فاکتور به ایمیل
 */
export const sendInvoiceEmail = async (invoice: any): Promise<boolean> => {
  const emailData = generateInvoiceEmail(invoice);
  return await sendEmail(emailData);
};

/**
 * ارسال یادآوری سررسید
 */
export const sendReminderEmail = async (invoice: any, daysLeft: number): Promise<boolean> => {
  const emailData = generateReminderEmail(invoice, daysLeft);
  return await sendEmail(emailData);
};

/**
 * ارسال تأیید پرداخت
 */
export const sendPaymentConfirmationEmail = async (invoice: any, payment: any): Promise<boolean> => {
  const emailData = generatePaymentConfirmationEmail(invoice, payment);
  return await sendEmail(emailData);
};
