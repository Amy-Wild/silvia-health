
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface AssessmentNavigationProps {
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
}

const AssessmentNavigation = ({
  currentStep,
  totalSteps,
  isValid,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}: AssessmentNavigationProps) => {
  const handleNextOrSubmit = () => {
    if (currentStep === totalSteps) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      <Button 
        onClick={handleNextOrSubmit}
        disabled={(!isValid && currentStep < totalSteps) || isSubmitting}
        className="bg-pink-500 hover:bg-pink-600 flex items-center"
      >
        {isSubmitting ? (
          <>Processing...</>
        ) : currentStep === totalSteps ? (
          <>Complete Assessment</>
        ) : (
          <>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default AssessmentNavigation;
