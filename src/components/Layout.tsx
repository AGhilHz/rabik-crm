import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuItems = [
    { path: "/", label: "خانه" },
    { path: "/services", label: "خدمات" },
    { path: "/about", label: "درباره ما" },
    { path: "/portfolio", label: "نمونه کارها" },
    { path: "/blog", label: "وبلاگ" },
    { path: "/faq", label: "سوالات متداول" },
    { path: "/contact", label: "تماس با ما" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-smooth">
              <img src="/logo.svg" alt="رابیک" className="h-8" />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-smooth hover:text-primary ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                className="rounded-full"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Link to="/contact" className="hidden md:block">
                <Button className="gradient-primary">شروع همکاری</Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t animate-fade-in">
              <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg transition-smooth ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/contact" className="px-4">
                  <Button className="w-full gradient-primary">شروع همکاری</Button>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div className="space-y-4">
              <img src="/logo.svg" alt="رابیک" className="h-8 brightness-0 invert" />
              <p className="text-sm opacity-90">
                ارتباط بی‌نهایت با مشتری
              </p>
              <p className="text-xs opacity-75">
                طراحی هوشمند وب، رشد پایدار کسب‌وکار شما
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">دسترسی سریع</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link to="/services" className="hover:text-accent transition-smooth">
                    خدمات
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-accent transition-smooth">
                    نمونه کارها
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-accent transition-smooth">
                    وبلاگ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-accent transition-smooth">
                    سوالات متداول
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-4">خدمات</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>طراحی وب‌سایت</li>
                <li>بهینه‌سازی سئو</li>
                <li>پیاده‌سازی CRM</li>
                <li>بازاریابی دیجیتال</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">تماس با ما</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <a href="mailto:info@rabik.ir" className="hover:text-accent transition-smooth">
                    info@rabik.ir
                  </a>
                </li>
                <li>
                  <a href="https://t.me/rabik_ir" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                    تلگرام: @rabik_ir
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/rabik.ir" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-smooth">
                    اینستاگرام: @rabik.ir
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>© ۱۴۰۴ رابیک. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-elevated hover:shadow-glow transition-smooth animate-fade-in"
          aria-label="بازگشت به بالا"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
