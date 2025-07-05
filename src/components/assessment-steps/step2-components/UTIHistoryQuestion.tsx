
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UTIHistoryQuestionProps {
  value: string;
  onUpdate: (key: string, value: any) => void;
}

const UTIHistoryQuestion = ({ value, onUpdate }: UTIHistoryQuestionProps) => {
  return (
    <div>
      <Label className="text-base font-medium mb-3 block">
        Have you had frequent urinary tract infections (UTIs) recently?
      </Label>
      <RadioGroup 
        value={value || ""} 
        onValueChange={(value) => onUpdate("utiHistory", value)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="no" id="no-uti" />
          <Label htmlFor="no-uti" className="cursor-pointer">
            No recent UTIs
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="occasional" id="occasional-uti" />
          <Label htmlFor="occasional-uti" className="cursor-pointer">
            Occasional UTIs (1-2 per year)
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="frequent" id="frequent-uti" />
          <Label htmlFor="frequent-uti" className="cursor-pointer">
            Frequent UTIs (3+ per year)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UTIHistoryQuestion;
