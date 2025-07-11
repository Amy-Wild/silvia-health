
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

import { AssessmentStepProps } from "@/types/componentTypes";

type Step4Props = AssessmentStepProps;

const Step4PhysicalSymptoms = ({ data, onUpdate }: Step4Props) => {
  // Simplified symptom list without clinical evidence
  const physicalSymptomOptions = [
    { 
      id: "joint-pain", 
      label: "Joint aches and pains"
    },
    { 
      id: "muscle-pain", 
      label: "Muscle aches"
    },
    { 
      id: "headaches", 
      label: "Headaches or migraines"
    },
    { 
      id: "fatigue", 
      label: "Tiredness or fatigue"
    },
    { 
      id: "weight-gain", 
      label: "Weight gain"
    },
    { 
      id: "bloating", 
      label: "Bloating or digestive issues"
    },
    { 
      id: "breast-tenderness", 
      label: "Breast tenderness"
    },
    { 
      id: "skin-changes", 
      label: "Dry skin or hair changes"
    },
  ];

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    const current = data.physicalSymptoms || [];
    const updated = checked
      ? [...current, symptomId]
      : current.filter((item: string) => item !== symptomId);
    
    onUpdate("physicalSymptoms", updated);
  };

  const selectedCount = (data.physicalSymptoms || []).length;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">
          Which physical symptoms are you experiencing? (Select all that apply)
        </Label>
        <p className="text-sm text-gray-600 mt-1">
          These symptoms are commonly reported during the menopause transition
        </p>
        
        <div className="mt-4 space-y-3">
          {physicalSymptomOptions.map((symptom) => (
            <div 
              key={symptom.id} 
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={symptom.id}
                checked={data.physicalSymptoms?.includes(symptom.id) || false}
                onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
              />
              <Label 
                htmlFor={symptom.id} 
                className="font-medium cursor-pointer flex-1"
              >
                {symptom.label}
              </Label>
            </div>
          ))}
        </div>
        
        {selectedCount > 5 && (
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p className="font-medium">Multiple Symptoms Selected</p>
              <p className="text-sm mt-1">
                You've selected {selectedCount} symptoms. This information will help your GP provide the best care for you.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Step4PhysicalSymptoms;
