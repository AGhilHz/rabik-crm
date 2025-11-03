import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "هزینه طراحی یک وب‌سایت چقدر است؟",
      answer: "هزینه طراحی وب‌سایت بستگی به پیچیدگی پروژه دارد. یک لندینگ پیج ساده از ۱۰ میلیون تومان، وب‌سایت شرکتی از ۱۵ میلیون تومان و فروشگاه‌های آنلاین از ۲۵ میلیون تومان شروع می‌شود. برای دریافت قیمت دقیق، با ما تماس بگیرید.",
    },
    {
      question: "مدت زمان طراحی وب‌سایت چقدر است؟",
      answer: "معمولاً یک وب‌سایت ساده ۲-۳ هفته، وب‌سایت متوسط ۴-۶ هفته و پروژه‌های پیچیده ۸-۱۲ هفته زمان می‌برد. این زمان شامل مراحل طراحی، توسعه، تست و تحویل نهایی است.",
    },
    {
      question: "آیا پس از تحویل پروژه پشتیبانی دارید؟",
      answer: "بله، برای تمام پروژه‌ها ۳ ماه پشتیبانی رایگان ارائه می‌دهیم. پس از آن می‌توانید قرارداد پشتیبانی سالانه با شرایط ویژه داشته باشید.",
    },
    {
      question: "سئو چقدر زمان می‌برد تا نتیجه بدهد؟",
      answer: "سئو یک فرآیند بلندمدت است. معمولاً اولین نتایج را بعد از ۳-۶ ماه می‌بینید، اما برای رتبه‌های برتر در کلمات کلیدی رقابتی، ممکن است ۶-۱۲ ماه زمان ببرد.",
    },
    {
      question: "CRM چه کمکی به کسب‌وکار من می‌کند؟",
      answer: "سیستم CRM به شما کمک می‌کند تا ارتباطات با مشتریان را بهتر مدیریت کنید، فرآیند فروش را بهینه کنید و نرخ حفظ مشتری را افزایش دهید. همچنین گزارش‌های دقیقی از عملکرد تیم فروش ارائه می‌دهد.",
    },
    {
      question: "آیا می‌توانم خودم محتوای سایت را مدیریت کنم؟",
      answer: "بله، تمام سایت‌های ما با پنل مدیریت کاربرپسند طراحی می‌شوند که به راحتی می‌توانید محتوا، تصاویر و محصولات را اضافه یا ویرایش کنید. همچنین آموزش کامل ارائه می‌دهیم.",
    },
    {
      question: "هزینه بازاریابی دیجیتال چگونه محاسبه می‌شود؟",
      answer: "هزینه بازاریابی دیجیتال شامل دو بخش است: هزینه خدمات ما و بودجه تبلیغات. هزینه خدمات ما بسته به استراتژی و کانال‌های انتخابی متفاوت است. حداقل بودجه پیشنهادی برای تبلیغات ۵ میلیون تومان در ماه است.",
    },
    {
      question: "چگونه می‌توانم پروژه را شروع کنم؟",
      answer: "کافی است از طریق فرم تماس، تلگرام یا ایمیل با ما در ارتباط باشید. بعد از بررسی نیازهای شما، پیشنهاد و تایم‌لاین پروژه را ارائه می‌دهیم. پس از تایید، قرارداد امضا و پروژه شروع می‌شود.",
    },
  ];

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">سوالات متداول</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              پاسخ سوالاتی که معمولاً از ما پرسیده می‌شود
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border rounded-lg px-6 shadow-soft"
                >
                  <AccordionTrigger className="text-right hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 p-8 rounded-2xl bg-muted/50">
            <h2 className="text-2xl font-bold mb-4">سوال دیگری دارید؟</h2>
            <p className="text-muted-foreground mb-6">
              تیم ما آماده پاسخگویی به تمام سوالات شماست
            </p>
            <a href="/contact">
              <button className="gradient-primary text-white px-8 py-3 rounded-lg font-semibold">
                تماس با ما
              </button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
