import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { GuideSteps } from "@/components/guide-steps";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { Link } from "wouter";
import { type Guide } from "@shared/schema";

export default function GuidePage() {
  const [, params] = useRoute<{ id: string }>("/guides/:id");
  const id = params?.id;

  const { data: guide, isLoading } = useQuery<Guide>({
    queryKey: [`/api/guides/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="h-[400px] rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Guide not found</h1>
        <p className="text-muted-foreground mt-2">
          The guide you're looking for doesn't exist.
        </p>
        <Link href="/guides">
          <Button className="mt-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/guides">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      <GuideSteps guide={guide} />
    </div>
  );
}