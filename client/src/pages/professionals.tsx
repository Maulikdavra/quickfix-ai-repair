import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Star, Home } from "lucide-react";
import { type Professional } from "@shared/schema";
import { useState } from "react";

export default function Professionals() {
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const { data: professionals, isLoading } = useQuery<Professional[]>({
    queryKey: selectedCategory
      ? [`/api/professionals/category/${selectedCategory}`]
      : ["/api/professionals"],
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Find a Professional</h1>
          <Link href="/">
            <Button variant="ghost">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals?.map((professional) => (
            <Card key={professional.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <img
                    src={professional.imageUrl}
                    alt={professional.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div>{professional.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {professional.location}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm px-2 py-1 bg-primary/10 rounded-full">
                    {professional.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{professional.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}