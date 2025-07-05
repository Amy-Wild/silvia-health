
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface RedFlagSymptomsProps {
  unexplainedWeightLoss: string;
  severePelvicPain: string;
  onUpdate: (key: string, value: any) => void;
}

const RedFlagSymptoms = ({ 
  unexplainedWeightLoss, 
  severePelvicPain, 
  onUpdate 
}: RedFlagSymptomsProps) => {
  return (
    <>
      {/* Red flag symptoms - weight loss */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <Label className="text-base font-medium mb-3 block text-amber-800">
              Have you experienced unexplained weight loss (more than 10% of your body weight) in the past 6 months?
            </Label>
            <RadioGroup 
              value={unexplainedWeightLoss || ""} 
              onValueChange={(value) => onUpdate("unexplainedWeightLoss", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no-weight-loss" />
                <Label htmlFor="no-weight-loss" className="cursor-pointer">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes-weight-loss" />
                <Label htmlFor="yes-weight-loss" className="cursor-pointer">
                  Yes
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Red flag symptoms - pelvic pain */}
      <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <Label className="text-base font-medium mb-3 block text-amber-800">
              Do you have severe or persistent pelvic pain?
            </Label>
            <RadioGroup 
              value={severePelvicPain || ""} 
              onValueChange={(value) => onUpdate("severePelvicPain", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no-pelvic-pain" />
                <Label htmlFor="no-pelvic-pain" className="cursor-pointer">
                  No
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="mild" id="mild-pelvic-pain" />
                <Label htmlFor="mild-pelvic-pain" className="cursor-pointer">
                  Mild discomfort
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="yes" id="yes-pelvic-pain" />
                <Label htmlFor="yes-pelvic-pain" className="cursor-pointer">
                  Yes, severe or persistent pain
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedFlagSymptoms;
