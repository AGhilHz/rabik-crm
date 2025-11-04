import { Layout } from "@/components/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", fullName: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({
        title: "خوش آمدید!",
        description: "با موفقیت وارد شدید.",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "خطا در ورود",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "ثبت‌نام موفق!",
        description: "حساب کاربری شما ایجاد شد. اکنون می‌توانید وارد شوید.",
      });
      
      setSignupData({ email: "", password: "", fullName: "" });
    } catch (error: any) {
      toast({
        title: "خطا در ثبت‌نام",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="ورود و ثبت‌نام | رابیک"
        description="ورود به پنل کاربری رابیک"
        canonical="https://rabik.ir/auth"
      />

      <section className="min-h-[calc(100vh-20rem)] py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 rounded-2xl glass-strong">
                <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <LogIn className="h-4 w-4 ml-2" />
                  ورود
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UserPlus className="h-4 w-4 ml-2" />
                  ثبت‌نام
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="gradient-card shadow-elevated border-2 border-border/50 rounded-3xl">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl text-gradient">ورود به حساب</CardTitle>
                    <CardDescription className="text-base">
                      برای دسترسی به پنل مدیریت وارد شوید
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ایمیل</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">رمز عبور</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                          className="rounded-xl h-12"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full hover-lift rounded-xl h-12 text-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            در حال ورود...
                          </>
                        ) : (
                          <>
                            <LogIn className="ml-2 h-5 w-5" />
                            ورود
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card className="gradient-card shadow-elevated border-2 border-border/50 rounded-3xl">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl text-gradient">ثبت‌نام</CardTitle>
                    <CardDescription className="text-base">
                      حساب کاربری جدید ایجاد کنید
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">نام و نام خانوادگی</label>
                        <Input
                          type="text"
                          placeholder="نام کامل شما"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          required
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ایمیل</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          required
                          className="rounded-xl h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">رمز عبور</label>
                        <Input
                          type="password"
                          placeholder="حداقل ۶ کاراکتر"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                          minLength={6}
                          className="rounded-xl h-12"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full hover-lift rounded-xl h-12 text-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                            در حال ثبت‌نام...
                          </>
                        ) : (
                          <>
                            <UserPlus className="ml-2 h-5 w-5" />
                            ثبت‌نام
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
