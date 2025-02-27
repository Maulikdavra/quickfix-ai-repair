import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { type Guide } from "@shared/schema";
import { ExternalLink, Clock, Activity } from "lucide-react";
import { Link } from "wouter";

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <Card className="overflow-hidden">
      {guide.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={guide.imageUrl}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{guide.title}</span>
          <span className="text-sm px-2 py-1 bg-primary/10 rounded-full">
            {guide.category}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {guide.description}
        </p>
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{guide.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            <span>{guide.difficulty}</span>
          </div>
        </div>
        <Link href={`/guides/${guide.id}`}>
          <Button className="w-full">
            View Guide
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}