
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Step4Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step4PhysicalSymptoms = ({ data, onUpdate }: Step4Props) => {
  const physicalSymptomOptions = [
    { id: "joint-pain", label: "Joint aches and pains" },
    { id: "muscle-pain", label: "Muscle aches" },
    { id: "headaches", label: "Headaches or migraines" },
    { id: "fatigue", label: "Tiredness or fatigue" },
    { id: "weight-gain", label: "Weight gain" },
    { id: "bloating", label: "Bloating or digestive issues" },
    { id: "breast-tenderness", label: "Breast tenderness" },
    { id: "skin-changes", label: "Dry skin or hair changes" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label>Which physical symptoms are you experiencing? (Select all that apply)</Label>
        <div className="mt-3 space-y-3">
          {physicalSymptomOptions.map((symptom) => (
            <div key={symptom.id} className="flex items-center space-x-2">
              <Checkbox
                id={symptom.id}
                checked={data.physicalSymptoms?.includes(symptom.id) || false}
                onCheckedChange={(checked) => {
                  const current = data.physicalSymptoms || [];
                  const updated = checked
                    ? [...current, symptom.id]
                    : current.filter((item: string) => item !== symptom.id);
                  onUpdate("physicalSymptoms", updated);
                }}
              />
              <Label htmlFor={symptom.id}>{symptom.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4PhysicalSymptoms;
