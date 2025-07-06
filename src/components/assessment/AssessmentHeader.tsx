
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AssessmentHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  riskBadge: {
    className: string;
    text: string;
  };
  showUrgentWarning: boolean;
}

const AssessmentHeader = ({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  riskBadge, 
  showUrgentWarning 
}: AssessmentHeaderProps) => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Silvia Health Assessment</h1>
              <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}: {stepTitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {showUrgentWarning && (
              <Badge className="bg-red-500 text-white">
                Urgent Review Recommended
              </Badge>
            )}
            <Badge className={riskBadge.className}>
              {riskBadge.text}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AssessmentHeader;
