import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface PortfolioCardProps {
  image: string;
  title: string;
  tags: string[];
  link?: string;
}

export const PortfolioCard = ({ image, title, tags, link }: PortfolioCardProps) => {
  return (
    <Card className="overflow-hidden group cursor-pointer shadow-soft hover:shadow-elevated transition-smooth">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
        />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center"
          >
            <ExternalLink className="h-12 w-12 text-white" />
          </a>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
