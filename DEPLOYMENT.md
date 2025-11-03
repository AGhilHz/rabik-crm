# راهنمای استقرار سایت رابیک

## روش ۱: استقرار در Vercel (پیشنهادی)

### مراحل نصب:

1. **آماده‌سازی کد:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **اتصال به GitHub:**
   - ریپازیتوری جدید در GitHub بسازید
   - کد را push کنید:
   ```bash
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

3. **استقرار در Vercel:**
   - به [vercel.com](https://vercel.com) بروید
   - "Import Project" را کلیک کنید
   - ریپازیتوری GitHub خود را انتخاب کنید
   - تنظیمات پیش‌فرض را تایید کنید
   - "Deploy" را بزنید

### تنظیمات دامنه سفارشی:

1. در پنل Vercel، به Settings > Domains بروید
2. دامنه خود را اضافه کنید (مثلاً rabik.ir)
3. رکوردهای DNS را طبق راهنمای Vercel تنظیم کنید:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

---

## روش ۲: استقرار در Netlify

### مراحل:

1. کد را در GitHub قرار دهید (مانند بالا)
2. به [netlify.com](https://netlify.com) بروید
3. "New site from Git" را بزنید
4. ریپازیتوری را انتخاب کنید
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. "Deploy site" را بزنید

---

## روش ۳: استقرار دستی

### ساخت فایل‌های نهایی:

```bash
npm install
npm run build
```

فایل‌های نهایی در پوشه `dist/` ایجاد می‌شوند.

### آپلود به سرور:

فایل‌های `dist/` را به سرور خود آپلود کنید و Nginx را طوری تنظیم کنید که به `index.html` اشاره کند.

**پیکربندی Nginx نمونه:**

```nginx
server {
    listen 80;
    server_name rabik.ir www.rabik.ir;
    root /var/www/rabik/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

---

## تنظیمات پیشرفته

### 1. متغیرهای محیطی (در صورت نیاز):

فایل `.env.production` بسازید:
```
VITE_API_URL=https://api.rabik.ir
VITE_CONTACT_EMAIL=info@rabik.ir
```

### 2. Analytics (Google Analytics):

در `index.html` قبل از `</head>` اضافه کنید:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### 3. Tawk.to Chat Widget:

در `index.html` قبل از `</body>` اضافه کنید:

```html
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_TAWK_ID/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

---

## بهینه‌سازی عملکرد

### 1. فعال‌سازی Cache:

در Vercel/Netlify به صورت خودکار فعال است.

### 2. تصاویر:

تصاویر از قبل بهینه شده‌اند، اما برای بهینه‌سازی بیشتر:

```bash
npm install -g sharp-cli
sharp -i src/assets/*.jpg -o src/assets/optimized/
```

### 3. Lighthouse Score:

پس از استقرار، امتیاز Lighthouse را چک کنید:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## پشتیبانی SSL

هر دو Vercel و Netlify به صورت خودکار SSL رایگان از Let's Encrypt ارائه می‌دهند.

برای سرور دستی:

```bash
sudo certbot --nginx -d rabik.ir -d www.rabik.ir
```

---

## نکات مهم

✅ **قبل از استقرار:**
- همه لینک‌ها را تست کنید
- فرم‌ها را آزمایش کنید
- نسخه موبایل را بررسی کنید
- SEO meta tags را چک کنید

✅ **بعد از استقرار:**
- Google Search Console را راه‌اندازی کنید
- Sitemap بسازید و ثبت کنید
- Google Analytics را تنظیم کنید
- عملکرد سایت را مانیتور کنید

---

## پشتیبانی

در صورت بروز مشکل:
- Email: info@rabik.ir
- Telegram: @rabik_ir
- Instagram: @rabik.ir

---

**موفق باشید! 🚀**
