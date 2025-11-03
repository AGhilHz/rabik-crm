import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { SEOHead, defaultSchema } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Search, Users, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "درخواست شما ارسال شد",
      description: "به زودی با شما تماس خواهیم گرفت.",
    });
    setFormData({ name: "", phone: "", email: "" });
  };

  const services = [
    {
      icon: Globe,
      title: "طراحی و توسعه وب‌سایت",
      description: "ساخت وب‌سایت‌های حرفه‌ای، سریع و زیبا با تکنولوژی‌های روز دنیا",
      price: "از ۱۰ میلیون تومان",
      link: "/services",
    },
    {
      icon: Search,
      title: "بهینه‌سازی سئو",
      description: "بهبود رتبه سایت شما در گوگل و افزایش ترافیک ارگانیک",
      price: "از ۵ میلیون تومان",
      link: "/services",
    },
    {
      icon: Users,
      title: "پیاده‌سازی CRM",
      description: "سیستم مدیریت ارتباط با مشتری برای رشد کسب‌وکار شما",
      price: "از ۱۵ میلیون تومان",
      link: "/services",
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="رابیک - ارتباط بی‌نهایت با مشتری | طراحی سایت و بازاریابی دیجیتال"
        description="طراحی هوشمند وب‌سایت، سئو، CRM و بازاریابی دیجیتال. ۵+ سال تجربه، ۵۰+ پروژه موفق، ۹۸٪ رضایت مشتری"
        keywords="طراحی سایت گرگان, سئو محلی, CRM ایران, بازاریابی دیجیتال, توسعه وب, طراحی وب‌سایت حرفه‌ای"
        canonical="https://rabik.ir"
        schema={defaultSchema}
      />
      <Hero />

      {/* Services Teaser */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خدمات ما</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              راهکارهای دیجیتال برای رشد کسب‌وکار شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/services">
              <Button size="lg" className="gradient-primary">مشاهده همه خدمات</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">آماده شروع همکاری هستید؟</h2>
              <p className="text-muted-foreground text-lg">
                اطلاعات خود را وارد کنید تا مشاوران ما با شما تماس بگیرند
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 shadow-soft p-8 rounded-xl bg-card animate-scale-in">
              <Input
                placeholder="نام و نام خانوادگی"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="شماره تماس"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                placeholder="ایمیل"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Button type="submit" className="w-full gradient-primary" size="lg">
                ارسال درخواست
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
