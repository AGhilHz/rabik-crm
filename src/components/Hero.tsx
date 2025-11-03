import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section 
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            رابیک
            <span className="block text-accent mt-2">ارتباط بی‌نهایت با مشتری</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            طراحی هوشمند وب، رشد پایدار کسب‌وکار شما
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/services">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elevated text-lg px-8">
                خدمات ما
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                تماس با ما
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="glass p-6 rounded-lg backdrop-blur-md">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">۵۰+</div>
              <div className="text-white/80">پروژه موفق</div>
            </div>
            <div className="glass p-6 rounded-lg backdrop-blur-md">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">۹۸٪</div>
              <div className="text-white/80">رضایت مشتری</div>
            </div>
            <div className="glass p-6 rounded-lg backdrop-blur-md col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">۵+</div>
              <div className="text-white/80">سال تجربه</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
