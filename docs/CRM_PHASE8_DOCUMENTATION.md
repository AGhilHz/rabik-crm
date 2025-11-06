# 📚 مستندات فاز 8: اتوماسیون و نوتیفیکیشن

## 📋 فهرست مطالب
- [معرفی](#معرفی)
- [فایلهای ایجاد شده](#فایلهای-ایجاد-شده)
- [ویژگیها](#ویژگیها)
- [نحوه استفاده](#نحوه-استفاده)
- [Edge Functions](#edge-functions)

---

## معرفی

فاز 8 شامل سیستم اتوماسیون و نوتیفیکیشن است که:
- اعلانهای Real-time
- اتوماسیون فرآیندها
- یادآوری سررسید
- نوتیفیکیشن رویدادها

---

## فایلهای ایجاد شده

### 1. notification-service.ts
**مسیر:** `src/lib/notification-service.ts`

**متدها:**
- `create()` - ایجاد اعلان
- `getAll()` - دریافت همه اعلانها
- `markAsRead()` - خواندن اعلان
- `markAllAsRead()` - خواندن همه
- `delete()` - حذف اعلان
- `subscribe()` - Real-time subscription

### 2. automation-service.ts
**مسیر:** `src/lib/automation-service.ts`

**متدها:**
- `checkOverdueInvoices()` - چک فاکتورهای سررسید
- `notifyProjectMilestone()` - اعلان پیشرفت پروژه
- `notifyNewTicket()` - اعلان تیکت جدید
- `notifyTicketResponse()` - اعلان پاسخ تیکت
- `notifyInvoicePaid()` - اعلان پرداخت

### 3. NotificationBell.tsx
**مسیر:** `src/components/NotificationBell.tsx`

**ویژگیها:**
- نمایش تعداد اعلانهای خوانده نشده
- لیست اعلانها
- خواندن/حذف اعلان
- Real-time updates

### 4. Edge Function
**مسیر:** `supabase/functions/check-overdue-invoices/index.ts`

**کاربرد:**
- اجرای خودکار روزانه
- چک فاکتورهای سررسید گذشته
- ارسال اعلان

---

## ویژگیها

### نوتیفیکیشن
- ✅ اعلانهای Real-time
- ✅ Badge تعداد خوانده نشده
- ✅ خواندن/حذف اعلان
- ✅ انواع اعلان (info, success, warning, error)

### اتوماسیون
- ✅ چک خودکار فاکتورهای سررسید
- ✅ اعلان پیشرفت پروژه
- ✅ اعلان تیکت جدید
- ✅ اعلان پاسخ تیکت
- ✅ اعلان پرداخت

---

## نحوه استفاده

### 1. افزودن NotificationBell به Layout

```typescript
import NotificationBell from "@/components/NotificationBell";

<header>
  <NotificationBell />
</header>
```

### 2. ارسال اعلان

```typescript
import { notificationService } from "@/lib/notification-service";

await notificationService.create({
  user_id: "user-id",
  title: "عنوان",
  message: "پیام",
  type: "info",
});
```

### 3. استفاده از اتوماسیون

```typescript
import { automationService } from "@/lib/automation-service";

// چک فاکتورهای سررسید
await automationService.checkOverdueInvoices();

// اعلان پیشرفت پروژه
await automationService.notifyProjectMilestone(projectId);

// اعلان تیکت جدید
await automationService.notifyNewTicket(ticketId);
```

### 4. Real-time Subscription

```typescript
import { notificationService } from "@/lib/notification-service";

useEffect(() => {
  const unsubscribe = notificationService.subscribe(userId, (notification) => {
    console.log("New notification:", notification);
  });

  return unsubscribe;
}, [userId]);
```

---

## Edge Functions

### دیپلوی Edge Function

```bash
# نصب Supabase CLI
npm install -g supabase

# لاگین
supabase login

# دیپلوی
supabase functions deploy check-overdue-invoices
```

### تنظیم Cron Job

در Supabase Dashboard:
1. Database → Cron Jobs
2. ایجاد Job جدید:

```sql
SELECT cron.schedule(
  'check-overdue-invoices',
  '0 9 * * *', -- هر روز ساعت 9 صبح
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/check-overdue-invoices',
    headers:='{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

---

## انواع اعلان

| نوع | رنگ | کاربرد |
|-----|-----|--------|
| info | آبی | اطلاعات عمومی |
| success | سبز | موفقیت عملیات |
| warning | زرد | هشدار |
| error | قرمز | خطا |

---

## فایلهای ایجاد شده

```
src/lib/
├── notification-service.ts
└── automation-service.ts

src/components/
└── NotificationBell.tsx

supabase/functions/check-overdue-invoices/
└── index.ts

docs/
└── CRM_PHASE8_DOCUMENTATION.md
```

---

## نکات مهم

1. **Real-time:** نیاز به فعالسازی Realtime در Supabase
2. **Edge Functions:** نیاز به Supabase CLI
3. **Cron Jobs:** برای اجرای خودکار
4. **Permissions:** RLS policies برای notifications

---

## مراحل بعدی

- [ ] ایمیل نوتیفیکیشن
- [ ] SMS نوتیفیکیشن
- [ ] Push notifications
- [ ] Webhook ها

---

**تاریخ ایجاد:** 2025-01-15  
**نسخه:** 1.0.0
