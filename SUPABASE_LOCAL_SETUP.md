# راهنمای نصب Supabase Local

## نصب Docker

1. Docker Desktop را از https://www.docker.com/products/docker-desktop دانلود و نصب کنید

## نصب Supabase CLI

```bash
npm install -g supabase
```

## راه‌اندازی Supabase Local

```bash
cd rabik-digital-growth-35431
supabase init
supabase start
```

پس از اجرا، اطلاعات زیر نمایش داده می‌شود:

```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
anon key: eyJh...
service_role key: eyJh...
```

## تنظیم .env.local

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY_FROM_ABOVE
```

## اجرای Migrations

```bash
supabase db reset
```

## اجرای پروژه

```bash
npm run dev
```

## دستورات مفید

```bash
supabase stop          # متوقف کردن
supabase status        # وضعیت
supabase db reset      # ریست دیتابیس
```
