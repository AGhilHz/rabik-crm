# 📚 مستندات سیستم CRM رابیک

این پوشه شامل تمام مستندات مربوط به سیستم CRM است.

## 📑 فهرست مستندات

### 1. نقشه راه کلی
📄 **[CRM_ROADMAP.md](../CRM_ROADMAP.md)**
- نقشه راه کامل 8 فاز
- وضعیت پیشرفت
- اولویتبندی فازها

### 2. راهنمای Migration
📄 **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**
- نحوه اجرای migration در Supabase
- رفع مشکلات رایج
- ایجاد اولین admin

### 3. مستندات فاز 1
📄 **[CRM_PHASE1_DOCUMENTATION.md](./CRM_PHASE1_DOCUMENTATION.md)**
- توضیحات کامل جداول دیتابیس
- Functions و Triggers
- RLS Policies
- نحوه استفاده از Helper Functions

## 🚀 شروع سریع

### مرحله 1: اجرای Migration
```bash
# مراجعه کنید به MIGRATION_GUIDE.md
```

### مرحله 2: ایجاد Admin
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

### مرحله 3: استفاده از Helper Functions
```typescript
import { getCustomers } from '@/lib/crm-helpers';

const customers = await getCustomers();
```

## 📂 ساختار فایلها

```
rabik-digital-growth-35431/
├── supabase/
│   └── migrations/
│       └── 20250115000000_crm_system_base.sql
├── src/
│   ├── integrations/supabase/
│   │   └── types-crm.ts
│   └── lib/
│       ├── crm-helpers.ts
│       ├── crm-constants.ts
│       └── crm-utils.ts
└── docs/
    ├── README.md (این فایل)
    ├── MIGRATION_GUIDE.md
    └── CRM_PHASE1_DOCUMENTATION.md
```

## 🔗 لینکهای مفید

- [Supabase Dashboard](https://supabase.com)
- [React Query Docs](https://tanstack.com/query)
- [shadcn/ui Components](https://ui.shadcn.com)

## 📞 پشتیبانی

در صورت بروز مشکل:
1. ابتدا مستندات را مطالعه کنید
2. Logs را در Supabase بررسی کنید
3. RLS Policies را چک کنید

---

**نسخه:** 1.0.0  
**تاریخ:** 2025-01-15
