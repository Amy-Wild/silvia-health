
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface Step4Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step4PhysicalSymptoms = ({ data, onUpdate }: Step4Props) => {
  // Enhanced symptom list with clinical evidence
  const physicalSymptomOptions = [
    { 
      id: "joint-pain", 
      label: "Joint aches and pains",
      evidence: "NICE NG23: Common in perimenopause - affects 60% of women"
    },
    { 
      id: "muscle-pain", 
      label: "Muscle aches",
      evidence: "Related to declining estrogen levels affecting muscle function"
    },
    { 
      id: "headaches", 
      label: "Headaches or migraines",
      evidence: "Hormonal headaches common in menopause transition"
    },
    { 
      id: "fatigue", 
      label: "Tiredness or fatigue",
      evidence: "Affects 80% of menopausal women - multifactorial causes"
    },
    { 
      id: "weight-gain", 
      label: "Weight gain",
      evidence: "Metabolic changes during menopause - average 5-10% increase"
    },
    { 
      id: "bloating", 
      label: "Bloating or digestive issues",
      evidence: "Estrogen affects gut microbiome and digestive function"
    },
    { 
      id: "breast-tenderness", 
      label: "Breast tenderness",
      evidence: "Hormonal fluctuations - usually improves post-menopause"
    },
    { 
      id: "skin-changes", 
      label: "Dry skin or hair changes",
      evidence: "Collagen production decreases by 30% in first 5 years post-menopause"
    },
  ];

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    const current = data.physicalSymptoms || [];
    const updated = checked
      ? [...current, symptomId]
      : current.filter((item: string) => item !== symptomId);
    
    // Validate selection
    if (updated.length > 8) {
      // Prevent over-selection which might indicate indiscriminate clicking
      return;
    }
    
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
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={symptom.id}
                checked={data.physicalSymptoms?.includes(symptom.id) || false}
                onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                aria-describedby={`${symptom.id}-description`}
              />
              <div className="flex-1">
                <Label 
                  htmlFor={symptom.id} 
                  className="font-medium cursor-pointer"
                >
                  {symptom.label}
                </Label>
                <p 
                  id={`${symptom.id}-description`}
                  className="text-xs text-gray-500 mt-1"
                >
                  {symptom.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedCount > 5 && (
          <Alert className="mt-4 border-amber-200 bg-amber-50">
            <Info className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <p className="font-medium">Multiple Symptoms Selected</p>
              <p className="text-sm mt-1">
                You've selected {selectedCount} symptoms. This suggests significant impact on your quality of life. 
                Your GP will discuss comprehensive management options with you.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Step4PhysicalSymptoms;
