import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GuideCard } from "@/components/ui/guide-card";
import { type Guide } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Guides() {
  const [location, setLocation] = useLocation();
  const category = new URLSearchParams(location.split("?")[1]).get("category");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: category
      ? [`/api/guides/category/${category}`]
      : ["/api/guides"],
  });

  const sortedGuides = guides?.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="page-title">Repair Guides</h1>
          <Link href="/">
            <Button variant="ghost">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGuides?.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
          {guides?.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No guides found. Try uploading a photo to create a new guide.
            </p>
          )}
        </div>
      )}
    </div>
  );
}