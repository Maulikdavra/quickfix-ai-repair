import { type Guide } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, Activity } from "lucide-react";

interface GuideStepsProps {
  guide: Guide;
}

export function GuideSteps({ guide }: GuideStepsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <CardDescription>{guide.description}</CardDescription>
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Estimated Time</p>
                <p className="text-muted-foreground">{guide.estimatedTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Difficulty Level</p>
                <p className="text-muted-foreground">{guide.difficulty}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        {guide.imageUrl && (
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={guide.imageUrl}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {guide.steps.map((step) => (
          <Card key={step.step}>
            <CardHeader>
              <CardTitle className="text-lg">Step {step.step}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
              {step.imageUrl && (
                <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={step.imageUrl}
                    alt={`Step ${step.step}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}