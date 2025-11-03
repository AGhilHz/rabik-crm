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
    <Card className="overflow-hidden shadow-soft hover:shadow-elevated transition-smooth">
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-smooth duration-500"
        />
      </div>
      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/blog/${slug}`} className="w-full">
          <Button variant="outline" className="w-full">ادامه مطلب</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
