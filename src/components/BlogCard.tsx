import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogCardProps {
  image: string;
  title: string;
  excerpt: string;
  slug: string;
}

export const BlogCard = ({ image, title, excerpt, slug }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-3xl border-2 border-transparent hover:border-primary/20 gradient-card">
      <div className="aspect-video overflow-hidden relative group">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
        />
        <div className="absolute inset-0 bg-gradient-primary/20 opacity-0 group-hover:opacity-100 transition-smooth" />
      </div>
      <CardHeader>
        <h3 className="font-bold text-xl line-clamp-2 leading-tight">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/blog/${slug}`} className="w-full">
          <Button variant="outline" className="w-full rounded-xl hover:bg-primary hover:text-primary-foreground transition-smooth">
            ادامه مطلب
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
