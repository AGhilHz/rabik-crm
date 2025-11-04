import { Layout } from "@/components/Layout";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import seoImage from "@/assets/blog-seo.jpg";
import crmImage from "@/assets/blog-crm.jpg";
import marketingImage from "@/assets/blog-marketing.jpg";
import responsiveImage from "@/assets/blog-responsive.jpg";

const Blog = () => {
  const articles = [
    {
      image: seoImage,
      title: "سئو محلی: چگونه در گرگان رتبه اول گوگل بگیرید",
      excerpt: "راهنمای جامع برای بهینه‌سازی کسب‌وکار محلی در موتورهای جستجو. از ثبت در گوگل مای بیزینس تا دریافت نظرات مشتریان.",
      slug: "local-seo-gorgan",
    },
    {
      image: crmImage,
      title: "CRM هوشمند: راز حفظ مشتری",
      excerpt: "چگونه یک سیستم CRM می‌تواند نرخ حفظ مشتری شما را تا ۸۰٪ افزایش دهد. تکنیک‌ها و ابزارهای کاربردی.",
      slug: "crm-customer-retention",
    },
    {
      image: marketingImage,
      title: "بازاریابی دیجیتال بدون ریسک",
      excerpt: "استراتژی‌های کم‌هزینه اما پرتاثیر برای شروع بازاریابی دیجیتال. مناسب برای کسب‌وکارهای کوچک و متوسط.",
      slug: "digital-marketing-low-risk",
    },
    {
      image: responsiveImage,
      title: "طراحی سایت responsive در ۱۴۰۴",
      excerpt: "چرا طراحی واکنش‌گرا دیگر اختیاری نیست؟ آمار، نکات و بهترین روش‌های طراحی برای موبایل در سال ۱۴۰۴.",
      slug: "responsive-design-2024",
    },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">وبلاگ رابیک</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              آخرین مقالات و راهنماهای تخصصی در زمینه طراحی وب، سئو و بازاریابی دیجیتال
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 animate-fade-in-up">
            {articles.map((article, i) => (
              <BlogCard key={i} {...article} />
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-20 max-w-2xl mx-auto text-center p-12 rounded-2xl shadow-elevated bg-card">
            <h2 className="text-3xl font-bold mb-4">خبرنامه رابیک</h2>
            <p className="text-muted-foreground mb-6">
              جدیدترین مقالات و نکات کاربردی را مستقیم در ایمیل خود دریافت کنید
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
              />
              <Button className="px-6 py-2 rounded-lg font-semibold">
                عضویت
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
