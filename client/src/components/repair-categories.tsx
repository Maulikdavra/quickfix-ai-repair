import { REPAIR_CATEGORIES } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface RepairCategoriesProps {
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

export function RepairCategories({
  selectedCategory,
  onSelectCategory,
}: RepairCategoriesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {REPAIR_CATEGORIES.map((category) => (
        <Card
          key={category.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
            selectedCategory === category.id && "border-primary bg-primary/5"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl">{category.icon}</span>
              <div className="space-y-1">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}