import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronLeft } from "lucide-react";
import { type Shop } from "@shared/schema";
import { useLocation } from "wouter";

export default function Shops() {
  const [location, setLocation] = useLocation();
  const fromGuideId = new URLSearchParams(location.split("?")[1]).get("from");

  const { data: shops, isLoading } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
  });

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => setLocation(fromGuideId ? `/guides/${fromGuideId}` : "/guides")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Hardware Stores</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops?.map((shop) => (
            <Card key={shop.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <span className="text-4xl">{shop.logo}</span>
                  <div>{shop.name}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {shop.description}
                </p>
                {shop.locations.map((location, index) => (
                  <div key={index} className="text-sm space-y-1">
                    <p>{location.address}</p>
                    {location.phone && (
                      <p className="text-muted-foreground">{location.phone}</p>
                    )}
                  </div>
                ))}
                {shop.website && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => shop.website && window.open(shop.website, '_blank')}
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}