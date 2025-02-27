import { type Guide } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
