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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {REPAIR_CATEGORIES.map((category) => (
        <Card
          key={category.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-primary/5",
            selectedCategory === category.id && "border-primary bg-primary/10"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <span className="text-4xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
