
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AssessmentProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const AssessmentProgress = ({ currentStep, totalSteps, steps }: AssessmentProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">Assessment Progress</CardTitle>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">
          {steps[currentStep - 1]}
        </p>
      </CardHeader>
    </Card>
  );
};

export default AssessmentProgress;
