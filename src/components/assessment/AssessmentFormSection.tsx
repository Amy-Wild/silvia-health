
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

interface AssessmentFormSectionProps {
  currentStep: number;
  steps: string[];
  assessmentData: PatientAssessmentData;
  onDataChange: (data: PatientAssessmentData) => void;
}

const AssessmentFormSection = ({ 
  currentStep, 
  steps, 
  assessmentData, 
  onDataChange 
}: AssessmentFormSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pink-500 rounded-full text-white flex items-center justify-center text-sm font-bold">
            {currentStep}
          </div>
          <CardTitle className="text-xl">{steps[currentStep - 1]}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <PatientAssessmentForm 
          step={currentStep}
          data={assessmentData}
          onDataChange={onDataChange}
        />
      </CardContent>
    </Card>
  );
};

export default AssessmentFormSection;
