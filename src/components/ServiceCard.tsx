import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price?: string;
  link?: string;
}

export const ServiceCard = ({ icon: Icon, title, description, price, link }: ServiceCardProps) => {
  return (
    <Card className="gradient-card shadow-soft hover:shadow-elevated transition-smooth hover-lift card-shine group border-2 border-transparent hover:border-primary/20 rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/40 transition-bounce">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        {price && (
          <div className="mt-6 p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <p className="text-accent font-bold text-lg">{price}</p>
          </div>
        )}
      </CardContent>
      {link && (
        <CardFooter>
          <Link to={link} className="w-full">
            <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground transition-smooth">
              جزئیات بیشتر
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
