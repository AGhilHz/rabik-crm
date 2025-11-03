import { Layout } from "@/components/Layout";
import { ServiceCard } from "@/components/ServiceCard";
import { Globe, Search, Users, FileText, TrendingUp } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "طراحی و توسعه وب‌سایت حرفه‌ای",
      description: "ساخت وب‌سایت‌های مدرن، سریع و واکنش‌گرا با تکنولوژی‌های React، Next.js و Tailwind CSS. از لندینگ پیج ساده تا فروشگاه‌های پیچیده آنلاین.",
      price: "از ۱۰ میلیون تومان",
    },
    {
      icon: Search,
      title: "بهینه‌سازی موتورهای جستجو (سئو)",
      description: "افزایش رتبه سایت شما در گوگل با تکنیک‌های سئو تخصصی. تحلیل کلمات کلیدی، بهینه‌سازی محتوا و لینک سازی حرفه‌ای.",
      price: "از ۵ میلیون تومان",
    },
    {
      icon: Users,
      title: "پیاده‌سازی سیستم مدیریت ارتباط با مشتری (CRM)",
      description: "سیستم‌های CRM اختصاصی برای مدیریت مشتریان، پیگیری فروش و افزایش بهره‌وری تیم شما. یکپارچه‌سازی با ابزارهای موجود.",
      price: "از ۱۵ میلیون تومان",
    },
    {
      icon: FileText,
      title: "تولید محتوای دیجیتال (غیرفرهنگی و غیرهنری)",
      description: "تولید محتوای تخصصی برای وب‌سایت، وبلاگ و شبکه‌های اجتماعی. نوشتن مقالات سئو شده، توضیحات محصولات و محتوای بازاریابی.",
      price: "از ۳ میلیون تومان",
    },
    {
      icon: TrendingUp,
      title: "بازاریابی دیجیتال (غیرهرمی و غیرشبکه‌ای)",
      description: "استراتژی‌های بازاریابی دیجیتال برای افزایش فروش. تبلیغات گوگل، سئو محلی، ایمیل مارکتینگ و بهینه‌سازی نرخ تبدیل.",
      price: "از ۸ میلیون تومان",
    },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">خدمات رابیک</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              راهکارهای دیجیتال جامع برای رشد کسب‌وکار شما. از طراحی وب‌سایت تا بازاریابی دیجیتال، همه چیز در یک جا.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 shadow-soft rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">۵+</div>
              <div className="text-lg font-semibold mb-2">سال تجربه</div>
              <p className="text-sm text-muted-foreground">
                تجربه کار با شرکت‌های معتبر و پروژه‌های متنوع
              </p>
            </div>
            <div className="text-center p-6 shadow-soft rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">۱۰۰٪</div>
              <div className="text-lg font-semibold mb-2">تضمین کیفیت</div>
              <p className="text-sm text-muted-foreground">
                رضایت شما اولویت ماست، تا زمان تایید نهایی کار ادامه دارد
              </p>
            </div>
            <div className="text-center p-6 shadow-soft rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">۲۴/۷</div>
              <div className="text-lg font-semibold mb-2">پشتیبانی</div>
              <p className="text-sm text-muted-foreground">
                پشتیبانی مستمر پس از تحویل پروژه
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
