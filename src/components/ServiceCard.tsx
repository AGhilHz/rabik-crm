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
    <Card className="shadow-soft hover:shadow-elevated transition-smooth group">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        {price && (
          <p className="text-sm text-accent font-semibold mt-4">{price}</p>
        )}
      </CardContent>
      {link && (
        <CardFooter>
          <Link to={link} className="w-full">
            <Button variant="outline" className="w-full">جزئیات بیشتر</Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
