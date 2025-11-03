import { Layout } from "@/components/Layout";
import { PortfolioCard } from "@/components/PortfolioCard";
import smsImage from "@/assets/portfolio-sms.jpg";
import ecommerceImage from "@/assets/portfolio-ecommerce.jpg";
import crmImage from "@/assets/portfolio-crm.jpg";

const Portfolio = () => {
  const projects = [
    {
      image: smsImage,
      title: "پنل پیامک رابیک",
      tags: ["طراحی UI/UX", "React", "پنل مدیریت"],
      link: "https://sms.rabik.ir",
    },
    {
      image: ecommerceImage,
      title: "فروشگاه آنلاین XYZ",
      tags: ["فروشگاه", "Next.js", "پرداخت آنلاین"],
    },
    {
      image: crmImage,
      title: "سیستم CRM شرکت ABC",
      tags: ["CRM", "مدیریت مشتری", "داشبورد"],
    },
    {
      image: smsImage,
      title: "وب‌سایت شرکتی تک‌رنگ",
      tags: ["وب‌سایت شرکتی", "واکنش‌گرا", "سئو"],
    },
    {
      image: ecommerceImage,
      title: "اپلیکیشن موبایل فروشگاهی",
      tags: ["موبایل", "React Native", "فروشگاه"],
    },
    {
      image: crmImage,
      title: "پلتفرم آموزش آنلاین",
      tags: ["آموزش", "LMS", "ویدئو"],
    },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">نمونه کارها</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              نگاهی به پروژه‌های موفق ما. هر پروژه داستانی از همکاری، نوآوری و موفقیت است.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {projects.map((project, i) => (
              <PortfolioCard key={i} {...project} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 p-12 rounded-2xl shadow-elevated gradient-primary">
            <h2 className="text-3xl font-bold text-white mb-4">
              پروژه بعدی شما اینجاست؟
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              بیایید با هم چیزی فوق‌العاده بسازیم. از ایده تا اجرا، در کنار شما هستیم.
            </p>
            <a href="/contact">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-smooth">
                شروع همکاری
              </button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
