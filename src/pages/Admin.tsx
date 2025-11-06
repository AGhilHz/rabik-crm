import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  LogOut, 
  FileText, 
  Briefcase, 
  Wrench, 
  HelpCircle, 
  Mail,
  Loader2,
  Shield,
  Users,
  ArrowLeft,
  Receipt,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { BlogManager } from "@/components/admin/BlogManager";
import { PortfolioManager } from "@/components/admin/PortfolioManager";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { FAQManager } from "@/components/admin/FAQManager";
import { ContactManager } from "@/components/admin/ContactManager";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    blogPosts: 0,
    portfolio: 0,
    services: 0,
    faqs: 0,
    contacts: 0,
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!data) {
      toast({
        title: "دسترسی محدود",
        description: "شما دسترسی به پنل مدیریت ندارید.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const loadStats = async () => {
    const [blog, portfolio, services, faqs, contacts] = await Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('portfolio').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('faqs').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      blogPosts: blog.count || 0,
      portfolio: portfolio.count || 0,
      services: services.count || 0,
      faqs: faqs.count || 0,
      contacts: contacts.count || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "خروج موفق",
      description: "از حساب کاربری خود خارج شدید.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="پنل مدیریت | رابیک"
        description="پنل مدیریت محتوای سایت رابیک"
        canonical="https://rabik.ir/admin"
      />

      <section className="min-h-[calc(100vh-20rem)] py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-gradient">پنل مدیریت</h1>
              </div>
              <p className="text-muted-foreground text-lg">مدیریت محتوا و تنظیمات سایت</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/admin/customers">
              <Card className="gradient-card hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-bold">مدیریت مشتریان</h3>
                      <p className="text-sm text-muted-foreground">CRM سیستم</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 mr-auto text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/admin/projects">
              <Card className="gradient-card hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-secondary" />
                    <div>
                      <h3 className="font-bold">مدیریت پروژهها</h3>
                      <p className="text-sm text-muted-foreground">Kanban Board</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 mr-auto text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/admin/invoices">
              <Card className="gradient-card hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-8 w-8 text-accent" />
                    <div>
                      <h3 className="font-bold">مدیریت فاکتورها</h3>
                      <p className="text-sm text-muted-foreground">فاکتور و پرداخت</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 mr-auto text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/admin/tickets">
              <Card className="gradient-card hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-success" />
                    <div>
                      <h3 className="font-bold">مدیریت تیکتها</h3>
                      <p className="text-sm text-muted-foreground">پشتیبانی</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 mr-auto text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-2xl border-2 border-primary/20">
              <CardHeader className="pb-3">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-3xl font-bold text-gradient">{stats.blogPosts}</CardTitle>
                <CardDescription>مقالات وبلاگ</CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-2xl border-2 border-secondary/20">
              <CardHeader className="pb-3">
                <Briefcase className="h-8 w-8 text-secondary mb-2" />
                <CardTitle className="text-3xl font-bold text-gradient">{stats.portfolio}</CardTitle>
                <CardDescription>نمونه کارها</CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-2xl border-2 border-accent/20">
              <CardHeader className="pb-3">
                <Wrench className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-3xl font-bold text-gradient">{stats.services}</CardTitle>
                <CardDescription>خدمات</CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-2xl border-2 border-success/20">
              <CardHeader className="pb-3">
                <HelpCircle className="h-8 w-8 text-success mb-2" />
                <CardTitle className="text-3xl font-bold text-gradient">{stats.faqs}</CardTitle>
                <CardDescription>سوالات متداول</CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-2xl border-2 border-destructive/20">
              <CardHeader className="pb-3">
                <Mail className="h-8 w-8 text-destructive mb-2" />
                <CardTitle className="text-3xl font-bold text-gradient">{stats.contacts}</CardTitle>
                <CardDescription>پیام‌های تماس</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Management Tabs */}
          <Card className="gradient-card shadow-elevated border-2 border-border/50 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">مدیریت محتوا</CardTitle>
              <CardDescription>ایجاد، ویرایش و حذف محتوای سایت</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="blog" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-8 p-1 rounded-2xl glass-strong">
                  <TabsTrigger value="blog" className="rounded-xl">
                    <FileText className="h-4 w-4 ml-2" />
                    وبلاگ
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="rounded-xl">
                    <Briefcase className="h-4 w-4 ml-2" />
                    نمونه کار
                  </TabsTrigger>
                  <TabsTrigger value="services" className="rounded-xl">
                    <Wrench className="h-4 w-4 ml-2" />
                    خدمات
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="rounded-xl">
                    <HelpCircle className="h-4 w-4 ml-2" />
                    سوالات
                  </TabsTrigger>
                  <TabsTrigger value="contacts" className="rounded-xl">
                    <Mail className="h-4 w-4 ml-2" />
                    پیام‌ها
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="blog" className="space-y-4">
                  <BlogManager />
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                  <PortfolioManager />
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <ServicesManager />
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                  <FAQManager />
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                  <ContactManager />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
