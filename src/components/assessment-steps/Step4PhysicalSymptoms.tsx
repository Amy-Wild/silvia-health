
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

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

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <Label className="text-red-800 font-medium">Important Questions</Label>
          </div>
          <div className="mt-3 space-y-4">
            <div>
              <Label>Have you experienced unexplained weight loss (more than 10% of body weight)?</Label>
              <RadioGroup
                value={data.unexplainedWeightLoss}
                onValueChange={(value) => onUpdate("unexplainedWeightLoss", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="weight-loss-yes" />
                  <Label htmlFor="weight-loss-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="weight-loss-no" />
                  <Label htmlFor="weight-loss-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label>Do you have severe pelvic pain?</Label>
              <RadioGroup
                value={data.severePelvicPain}
                onValueChange={(value) => onUpdate("severePelvicPain", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="pelvic-pain-yes" />
                  <Label htmlFor="pelvic-pain-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="pelvic-pain-no" />
                  <Label htmlFor="pelvic-pain-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4PhysicalSymptoms;
