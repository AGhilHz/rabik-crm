import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary/20">۴۰۴</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold">صفحه یافت نشد</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/">
              <Button size="lg" className="gradient-primary">
                <Home className="ml-2 h-5 w-5" />
                بازگشت به خانه
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                <ArrowRight className="ml-2 h-5 w-5" />
                تماس با ما
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
