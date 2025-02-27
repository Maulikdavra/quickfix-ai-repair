import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GuideCard } from "@/components/ui/guide-card";
import { RepairCategories } from "@/components/repair-categories";
import { type Guide } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Repair Guides</h1>
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
        <RepairCategories
          selectedCategory={category || undefined}
          onSelectCategory={(newCategory) => {
            setLocation(`/guides${newCategory ? `?category=${newCategory}` : ""}`);
          }}
        />
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