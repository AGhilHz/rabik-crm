import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Rocket, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }} />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-full text-white shadow-glow animate-scale-in">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            <span className="text-sm font-medium">طراحی حرفه‌ای و خلاقانه</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            <span className="block mb-4">رابیک</span>
            <span className="block text-gradient text-6xl md:text-8xl lg:text-9xl">
              ارتباط بی‌نهایت
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 text-white/90">
              با مشتری
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/95 max-w-3xl mx-auto font-light leading-relaxed">
            طراحی هوشمند وب، تجربه کاربری استثنایی
            <br />
            <span className="text-accent font-medium">رشد پایدار کسب‌وکار شما</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link to="/services">
              <Button size="lg" className="gradient-primary hover-lift shadow-glow text-xl px-12 py-7 h-auto rounded-2xl group">
                <Rocket className="ml-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                مشاهده خدمات
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="glass-strong border-2 border-white/30 text-white hover:bg-white/20 text-xl px-12 py-7 h-auto rounded-2xl backdrop-blur-xl">
                شروع مشاوره رایگان
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            <div className="glass-strong p-8 rounded-3xl backdrop-blur-xl hover-lift card-shine group">
              <div className="text-5xl md:text-6xl font-bold text-gradient mb-3 group-hover:scale-110 transition-transform">۵۰+</div>
              <div className="text-white/90 text-lg">پروژه موفق</div>
            </div>
            <div className="glass-strong p-8 rounded-3xl backdrop-blur-xl hover-lift card-shine group">
              <div className="text-5xl md:text-6xl font-bold text-gradient mb-3 group-hover:scale-110 transition-transform">۹۸٪</div>
              <div className="text-white/90 text-lg">رضایت مشتری</div>
            </div>
            <div className="glass-strong p-8 rounded-3xl backdrop-blur-xl hover-lift card-shine group col-span-2 md:col-span-1">
              <div className="text-5xl md:text-6xl font-bold text-gradient mb-3 group-hover:scale-110 transition-transform">۵+</div>
              <div className="text-white/90 text-lg">سال تجربه</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 animate-bounce">
            <TrendingUp className="h-8 w-8 text-white/60 mx-auto rotate-90" />
          </div>
        </div>
      </div>
    </section>
  );
};
