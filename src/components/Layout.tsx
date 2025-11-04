import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ChevronUp, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    setIsAdmin(!!data);
  };

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
    { path: "/faq", label: "سوالات" },
    { path: "/contact", label: "تماس" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-secondary blur-xl opacity-40 group-hover:opacity-60 transition-smooth"></div>
                <img 
                  src="/logo.png" 
                  alt="رابیک" 
                  className="relative h-12 w-12 object-contain drop-shadow-lg group-hover:scale-110 transition-transform" 
                />
              </div>
              <span className="text-2xl font-bold text-primary hidden sm:block">رابیک</span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth relative group ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-primary rounded-full" />
                  )}
                  <span className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-xl transition-smooth" />
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-smooth relative group text-accent"
                >
                  <Shield className="h-4 w-4 inline ml-1" />
                  مدیریت
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                className="rounded-full hover:bg-primary/10"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {user ? (
                <Link to="/admin" className="hidden md:block">
                  <Button className="rounded-xl">
                    <Shield className="h-4 w-4 ml-2" />
                    پنل کاربری
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="hidden md:block">
                    <Button variant="ghost" className="rounded-xl">ورود</Button>
                  </Link>
                  <Link to="/contact" className="hidden md:block">
                    <Button className="rounded-xl">شروع همکاری</Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="lg:hidden py-6 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-xl transition-smooth ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="px-4 py-3 rounded-xl bg-accent/10 text-accent">
                    <Shield className="h-4 w-4 inline ml-2" />
                    پنل مدیریت
                  </Link>
                )}
                {!user && (
                  <>
                    <Link to="/auth" className="px-4 mt-2">
                      <Button variant="outline" className="w-full rounded-xl">ورود</Button>
                    </Link>
                    <Link to="/contact" className="px-4">
                      <Button className="w-full rounded-xl">شروع همکاری</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="رابیک" className="h-12 w-12 object-contain" />
                <span className="text-2xl font-bold text-foreground">رابیک</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ارتباط بی‌نهایت با مشتری
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                طراحی هوشمند وب، رشد پایدار کسب‌وکار شما
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6 text-lg text-foreground">دسترسی سریع</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/services" className="text-muted-foreground hover:text-primary transition-smooth hover:translate-x-1 inline-block">
                    خدمات
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio" className="text-muted-foreground hover:text-primary transition-smooth hover:translate-x-1 inline-block">
                    نمونه کارها
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary transition-smooth hover:translate-x-1 inline-block">
                    وبلاگ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-primary transition-smooth hover:translate-x-1 inline-block">
                    سوالات متداول
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-6 text-lg text-foreground">خدمات</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>طراحی وب‌سایت</li>
                <li>بهینه‌سازی سئو</li>
                <li>پیاده‌سازی CRM</li>
                <li>بازاریابی دیجیتال</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-6 text-lg text-foreground">تماس با ما</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:info@rabik.ir" className="text-muted-foreground hover:text-primary transition-smooth">
                    info@rabik.ir
                  </a>
                </li>
                <li>
                  <a href="https://t.me/rabik_ir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-smooth">
                    تلگرام: @rabik_ir
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/rabik.ir" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-smooth">
                    اینستاگرام: @rabik.ir
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© ۱۴۰۴ رابیک. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-40 p-4 rounded-2xl bg-primary text-primary-foreground shadow-elevated hover:scale-110 transition-bounce animate-fade-in"
          aria-label="بازگشت به بالا"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
