import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GuideCard } from "@/components/ui/guide-card";
import { RepairCategories } from "@/components/repair-categories";
import { type Guide } from "@shared/schema";

export default function Guides() {
  const [location, setLocation] = useLocation();
  const category = new URLSearchParams(location.split("?")[1]).get("category");

  const { data: guides, isLoading } = useQuery<Guide[]>({
    queryKey: category
      ? [`/api/guides/category/${category}`]
      : ["/api/guides"],
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Repair Guides</h1>
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
          {guides?.map((guide) => (
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