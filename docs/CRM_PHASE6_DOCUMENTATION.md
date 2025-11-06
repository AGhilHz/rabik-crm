# 📚 مستندات فاز 6: پورتال مشتری

## 📋 فهرست مطالب
- [معرفی](#معرفی)
- [صفحات ایجاد شده](#صفحات-ایجاد-شده)
- [ویژگیها](#ویژگیها)
- [نحوه استفاده](#نحوه-استفاده)
- [مسیرها](#مسیرها)

---

## معرفی

فاز 6 شامل پورتال مشتری است که به مشتریان امکان میدهد:
- مشاهده داشبورد شخصی
- پیگیری پروژهها
- مشاهده و پرداخت فاکتورها
- مدیریت تیکتها
- ویرایش پروفایل

---

## صفحات ایجاد شده

### 1. Dashboard.tsx
**مسیر:** `/customer/dashboard`

**ویژگیها:**
- نمایش آمار کلی (پروژهها، فاکتورها، تیکتها)
- کارتهای اطلاعاتی
- وضعیت حساب کاربری

### 2. Projects.tsx
**مسیر:** `/customer/projects`

**ویژگیها:**
- لیست پروژههای مشتری
- نمایش وضعیت و پیشرفت
- اطلاعات بودجه و زمانبندی

### 3. Invoices.tsx
**مسیر:** `/customer/invoices`

**ویژگیها:**
- لیست فاکتورها
- دانلود PDF
- پرداخت آنلاین
- نمایش وضعیت پرداخت

### 4. Tickets.tsx
**مسیر:** `/customer/tickets`

**ویژگیها:**
- لیست تیکتها
- ایجاد تیکت جدید
- فیلتر بر اساس وضعیت
- نمایش اولویت

### 5. TicketDetails.tsx
**مسیر:** `/customer/tickets/:id`

**ویژگیها:**
- نمایش جزئیات تیکت
- چت Real-time
- ارسال پیام
- تاریخچه مکالمات

### 6. Profile.tsx
**مسیر:** `/customer/profile`

**ویژگیها:**
- نمایش اطلاعات شخصی
- ویرایش پروفایل
- بهروزرسانی اطلاعات تماس

---

## ویژگیها

### امنیت
- احراز هویت با Supabase Auth
- دسترسی فقط به دادههای خود مشتری
- RLS Policies

### Real-time
- بهروزرسانی خودکار تیکتها
- اعلانهای لحظهای

### UI/UX
- رابط کاربری فارسی
- Responsive Design
- استفاده از shadcn/ui

---

## نحوه استفاده

### 1. افزودن Routes

```typescript
// در App.tsx یا Router
import CustomerDashboard from "@/pages/customer/Dashboard";
import CustomerProjects from "@/pages/customer/Projects";
import CustomerInvoices from "@/pages/customer/Invoices";
import CustomerTickets from "@/pages/customer/Tickets";
import CustomerTicketDetails from "@/pages/customer/TicketDetails";
import CustomerProfile from "@/pages/customer/Profile";

// Routes
<Route path="/customer/dashboard" element={<CustomerDashboard />} />
<Route path="/customer/projects" element={<CustomerProjects />} />
<Route path="/customer/invoices" element={<CustomerInvoices />} />
<Route path="/customer/tickets" element={<CustomerTickets />} />
<Route path="/customer/tickets/:id" element={<CustomerTicketDetails />} />
<Route path="/customer/profile" element={<CustomerProfile />} />
```

### 2. ایجاد Navigation

```typescript
const customerNav = [
  { name: "داشبورد", path: "/customer/dashboard", icon: Home },
  { name: "پروژهها", path: "/customer/projects", icon: FolderKanban },
  { name: "فاکتورها", path: "/customer/invoices", icon: FileText },
  { name: "تیکتها", path: "/customer/tickets", icon: MessageSquare },
  { name: "پروفایل", path: "/customer/profile", icon: User },
];
```

### 3. محافظت از Routes

```typescript
function ProtectedCustomerRoute({ children }) {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

---

## مسیرها

| مسیر | صفحه | توضیحات |
|------|------|---------|
| `/customer/dashboard` | Dashboard | داشبورد اصلی |
| `/customer/projects` | Projects | لیست پروژهها |
| `/customer/invoices` | Invoices | لیست فاکتورها |
| `/customer/tickets` | Tickets | لیست تیکتها |
| `/customer/tickets/:id` | TicketDetails | جزئیات تیکت |
| `/customer/profile` | Profile | پروفایل کاربری |

---

## فایلهای ایجاد شده

```
src/pages/customer/
├── Dashboard.tsx
├── Projects.tsx
├── Invoices.tsx
├── Tickets.tsx
├── TicketDetails.tsx
└── Profile.tsx
```

---

## نکات مهم

1. **احراز هویت:** همه صفحات نیاز به احراز هویت دارند
2. **RLS:** دسترسی به دادهها از طریق RLS محدود شده
3. **Real-time:** تیکتها به صورت Real-time بهروزرسانی میشوند
4. **Responsive:** تمام صفحات Responsive هستند

---

## مراحل بعدی

- [ ] افزودن نوتیفیکیشن
- [ ] پیادهسازی درگاه پرداخت
- [ ] افزودن فیلترهای پیشرفته
- [ ] تست کامل

---

**تاریخ ایجاد:** 2025-01-15  
**نسخه:** 1.0.0
