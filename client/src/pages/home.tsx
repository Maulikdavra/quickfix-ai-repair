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
import { Loader2 } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const compressedImage = await compressImage(file);
        const res = await apiRequest("POST", "/api/guides/analyze", {
          image: compressedImage,
        });
        return res.json() as Promise<Guide>;
      } catch (error: any) {
        if (error.message.includes('too large')) {
          throw new Error("Image size is too large. Please use a smaller image (max 10MB).");
        }
        throw error;
      }
    },
    onSuccess: (guide) => {
      toast({
        title: "Analysis Complete",
        description: "Your repair guide has been generated!",
      });
      setLocation(`/guides/${guide.id}`);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error analyzing image",
        description: error.message,
      });
    },
  });

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="page-title">QuickFix AI Home Repair Assistant</h1>
        <p className="subtitle max-w-2xl mx-auto">
          Upload a photo of your repair issue and get instant AI-powered guidance,
          or browse our repair categories.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="section-title">Upload a Photo</h2>
          <FileUpload
            onFileSelect={(file) => analyzeMutation.mutate(file)}
            className={analyzeMutation.isPending ? "opacity-50 pointer-events-none" : "h-[300px] card-gradient"}
          />
          {analyzeMutation.isPending && (
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">
                Analyzing your image...
                <br />
                <span className="text-sm">
                  Our AI is examining the repair issue and generating step-by-step instructions
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="section-title">Browse Categories</h2>
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
          className="card-gradient"
          onClick={() => setLocation("/professionals")}
        >
          Find a Professional
        </Button>
      </div>
    </div>
  );
}