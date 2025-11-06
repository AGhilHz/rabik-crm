# 💳 راهنمای یکپارچهسازی با زرینپال

## 📋 مراحل یکپارچهسازی

### مرحله 1: ثبتنام در زرینپال

1. به [https://www.zarinpal.com](https://www.zarinpal.com) بروید
2. ثبتنام کنید و حساب خود را تأیید کنید
3. از داشبورد، **Merchant ID** خود را کپی کنید

### مرحله 2: نصب پکیج

```bash
npm install axios
```

### مرحله 3: تنظیم Environment Variables

در فایل `.env` اضافه کنید:

```env
VITE_ZARINPAL_MERCHANT_ID=your_merchant_id_here
VITE_ZARINPAL_CALLBACK_URL=http://localhost:5173/payment/callback
```

### مرحله 4: ایجاد سرویس زرینپال

فایل: `src/lib/zarinpal-service.ts`

```typescript
import axios from 'axios';

const ZARINPAL_API = 'https://api.zarinpal.com/pg/v4/payment';
const MERCHANT_ID = import.meta.env.VITE_ZARINPAL_MERCHANT_ID;
const CALLBACK_URL = import.meta.env.VITE_ZARINPAL_CALLBACK_URL;

export interface PaymentRequest {
  amount: number; // مبلغ به تومان
  description: string;
  email?: string;
  mobile?: string;
  metadata?: {
    invoice_id: string;
    customer_id: string;
  };
}

export interface PaymentResponse {
  authority: string;
  payment_url: string;
}

/**
 * درخواست پرداخت
 */
export const requestPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(`${ZARINPAL_API}/request.json`, {
      merchant_id: MERCHANT_ID,
      amount: data.amount,
      description: data.description,
      callback_url: CALLBACK_URL,
      metadata: data.metadata,
    });

    if (response.data.data.code === 100) {
      return {
        authority: response.data.data.authority,
        payment_url: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`,
      };
    }

    throw new Error('Payment request failed');
  } catch (error) {
    console.error('Zarinpal request error:', error);
    throw error;
  }
};

/**
 * تأیید پرداخت
 */
export const verifyPayment = async (authority: string, amount: number) => {
  try {
    const response = await axios.post(`${ZARINPAL_API}/verify.json`, {
      merchant_id: MERCHANT_ID,
      authority,
      amount,
    });

    if (response.data.data.code === 100 || response.data.data.code === 101) {
      return {
        success: true,
        ref_id: response.data.data.ref_id,
        card_pan: response.data.data.card_pan,
      };
    }

    return { success: false };
  } catch (error) {
    console.error('Zarinpal verify error:', error);
    return { success: false };
  }
};
```

### مرحله 5: بهروزرسانی PaymentGateway Component

در `src/components/PaymentGateway.tsx`:

```typescript
import { requestPayment } from '@/lib/zarinpal-service';

const handleZarinpalPayment = async () => {
  try {
    const paymentData = await requestPayment({
      amount: invoice.total,
      description: `پرداخت فاکتور ${invoice.invoice_number}`,
      email: invoice.customer?.email,
      mobile: invoice.customer?.phone,
      metadata: {
        invoice_id: invoice.id,
        customer_id: invoice.customer_id,
      },
    });

    // هدایت به درگاه پرداخت
    window.location.href = paymentData.payment_url;
  } catch (error) {
    toast({
      title: "خطا در اتصال به درگاه",
      variant: "destructive",
    });
  }
};
```

### مرحله 6: ایجاد صفحه Callback

فایل: `src/pages/PaymentCallback.tsx`

```typescript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '@/lib/zarinpal-service';
import { createPayment, updateInvoice } from '@/lib/crm-helpers';
import { toast } from '@/hooks/use-toast';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const authority = searchParams.get('Authority');
      const status = searchParams.get('Status');

      if (status !== 'OK' || !authority) {
        toast({
          title: "پرداخت ناموفق",
          description: "پرداخت توسط کاربر لغو شد.",
          variant: "destructive",
        });
        navigate('/admin/invoices');
        return;
      }

      // دریافت اطلاعات فاکتور از metadata
      // این اطلاعات باید از دیتابیس یا session گرفته شود
      const invoiceId = sessionStorage.getItem('payment_invoice_id');
      const amount = parseInt(sessionStorage.getItem('payment_amount') || '0');

      if (!invoiceId) {
        navigate('/admin/invoices');
        return;
      }

      // تأیید پرداخت
      const result = await verifyPayment(authority, amount);

      if (result.success) {
        // ثبت پرداخت
        await createPayment({
          invoice_id: invoiceId,
          amount,
          payment_method: 'online',
          transaction_id: result.ref_id,
          tracking_code: authority,
          gateway: 'zarinpal',
          status: 'success',
          paid_at: new Date().toISOString(),
        });

        // بهروزرسانی فاکتور
        await updateInvoice(invoiceId, {
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0],
        });

        toast({
          title: "پرداخت موفق",
          description: `کد پیگیری: ${result.ref_id}`,
        });

        navigate(`/admin/invoices/${invoiceId}`);
      } else {
        toast({
          title: "خطا در تأیید پرداخت",
          variant: "destructive",
        });
        navigate('/admin/invoices');
      }

      // پاک کردن session
      sessionStorage.removeItem('payment_invoice_id');
      sessionStorage.removeItem('payment_amount');
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>در حال پردازش پرداخت...</p>
      </div>
    </div>
  );
};

export default PaymentCallback;
```

### مرحله 7: اضافه کردن Route

در `src/App.tsx`:

```typescript
import PaymentCallback from "./pages/PaymentCallback";

// در Routes:
<Route path="/payment/callback" element={<PaymentCallback />} />
```

---

## 🔒 نکات امنیتی

1. **هرگز Merchant ID را در کد frontend قرار ندهید** - از environment variables استفاده کنید
2. **تأیید پرداخت را در backend انجام دهید** - برای امنیت بیشتر
3. **از HTTPS استفاده کنید** - در production
4. **لاگ تمام تراکنشها را نگه دارید**

---

## 🧪 تست

### حالت Sandbox:

برای تست، از Sandbox زرینپال استفاده کنید:

```typescript
const ZARINPAL_API = 'https://sandbox.zarinpal.com/pg/v4/payment';
```

کارتهای تست:
- شماره کارت: `5022-2910-0000-0000`
- CVV2: هر عددی
- تاریخ انقضا: هر تاریخ آینده

---

## 📞 پشتیبانی

- مستندات زرینپال: [https://docs.zarinpal.com](https://docs.zarinpal.com)
- پشتیبانی: support@zarinpal.com

---

## ✅ چک لیست

- [ ] ثبتنام در زرینپال
- [ ] دریافت Merchant ID
- [ ] نصب axios
- [ ] تنظیم environment variables
- [ ] ایجاد zarinpal-service.ts
- [ ] بهروزرسانی PaymentGateway
- [ ] ایجاد صفحه Callback
- [ ] اضافه کردن Route
- [ ] تست در Sandbox
- [ ] تست در Production
