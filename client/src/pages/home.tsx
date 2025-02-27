import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@/components/ui/file-upload";
import { RepairCategories } from "@/components/repair-categories";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { type Guide } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const compressedImage = await compressImage(file);
      const res = await apiRequest("POST", "/api/guides/analyze", {
        image: compressedImage,
      });
      return res.json() as Promise<Guide>;
    },
    onSuccess: (guide) => {
      setLocation(`/guides/${guide.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error analyzing image",
        description: error.message,
      });
    },
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">QuickFix AI Home Repair Assistant</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload a photo of your repair issue and get instant AI-powered guidance,
          or browse our repair categories.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Upload a Photo</h2>
          <FileUpload
            onFileSelect={(file) => analyzeMutation.mutate(file)}
            className="h-[300px]"
          />
          {analyzeMutation.isPending && (
            <p className="text-center text-muted-foreground">
              Analyzing your image...
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Browse Categories</h2>
          <RepairCategories
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setLocation(`/guides?category=${category}`);
            }}
          />
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setLocation("/professionals")}
        >
          Find a Professional
        </Button>
      </div>
    </div>
  );
}