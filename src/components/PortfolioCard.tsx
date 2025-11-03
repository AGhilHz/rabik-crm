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
    <Card className="overflow-hidden group cursor-pointer shadow-soft hover:shadow-elevated transition-smooth hover-lift rounded-3xl border-2 border-transparent hover:border-primary/20">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-700"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-80 transition-smooth" />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth z-10"
          >
            <div className="glass-strong p-6 rounded-2xl backdrop-blur-xl shadow-glow">
              <ExternalLink className="h-12 w-12 text-white" />
            </div>
          </a>
        )}
      </div>
      <div className="p-6 gradient-card">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="rounded-lg px-3 py-1 bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
