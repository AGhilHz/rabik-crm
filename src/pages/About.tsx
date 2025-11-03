import { Layout } from "@/components/Layout";
import profileImage from "@/assets/profile.jpg";

const About = () => {
  const timeline = [
    { year: "۱۴۰۴", title: "توسعه رابیک", description: "راه‌اندازی برند شخصی رابیک برای ارائه خدمات دیجیتال" },
    { year: "۱۴۰۲", title: "سرپرست IT در لابل", description: "مدیریت زیرساخت‌های فنی و تیم توسعه" },
    { year: "۱۴۰۰", title: "مشاور فنی در متزون", description: "مشاوره و پیاده‌سازی راهکارهای دیجیتال" },
    { year: "۱۳۹۸", title: "شروع فعالیت حرفه‌ای", description: "آغاز کار به عنوان برنامه‌نویس فول‌استک" },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">رابیک کیست؟</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              داستان یک برند شخصی در دنیای دیجیتال
            </p>
          </div>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 animate-fade-in-up">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <img
                src={profileImage}
                alt="رابیک"
                className="rounded-2xl shadow-elevated w-full max-w-md mx-auto"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold">معرفی</h2>
              <p className="text-lg leading-relaxed">
                <strong className="text-primary">رابیک</strong> برند شخصی من است. 
                کلمه‌ای ساخته شده از «رابط» (ارتباط) و «بیک» (بی‌نهایت) که نماد 
                ارتباطات هوشمند و پایدار در دنیای دیجیتال است.
              </p>
              <p className="text-lg leading-relaxed">
                با بیش از <strong className="text-primary">۵ سال تجربه</strong> در برنامه‌نویسی، 
                DevOps و مدیریت IT، در شرکت‌های معتبری چون <strong>لابل</strong> و <strong>متزون</strong> 
                فعالیت داشته‌ام.
              </p>
              <p className="text-lg leading-relaxed">
                تخصص من طراحی و توسعه راهکارهای دیجیتال است که نه تنها زیبا و کاربردی 
                هستند، بلکه به رشد واقعی کسب‌وکار شما کمک می‌کنند.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">۵۰+</div>
                  <div className="text-sm text-muted-foreground">پروژه موفق</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">۹۸٪</div>
                  <div className="text-sm text-muted-foreground">رضایت مشتری</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">۵+</div>
                  <div className="text-sm text-muted-foreground">سال تجربه</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">مسیر حرفه‌ای</h2>
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-6 items-start animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-20 flex-shrink-0 text-left">
                    <div className="text-2xl font-bold text-primary">{item.year}</div>
                  </div>
                  <div className="flex-1 pb-8 border-r-2 border-muted pr-6">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
