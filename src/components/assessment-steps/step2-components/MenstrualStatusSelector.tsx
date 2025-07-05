
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MenstrualStatusSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const MenstrualStatusSelector = ({ value, onValueChange }: MenstrualStatusSelectorProps) => {
  return (
    <div>
      <Label className="text-base font-medium mb-4 block">
        Which best describes your periods currently?
      </Label>
      <RadioGroup 
        value={value || ""} 
        onValueChange={onValueChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 cursor-pointer">
          <RadioGroupItem value="regular" id="regular" className="cursor-pointer" />
          <Label htmlFor="regular" className="cursor-pointer flex-1 text-sm">
            Regular (monthly cycles, 21-35 day intervals)
          </Label>
        </div>
        <div className="flex items-center space-x-3 cursor-pointer">
          <RadioGroupItem value="irregular" id="irregular" className="cursor-pointer" />
          <Label htmlFor="irregular" className="cursor-pointer flex-1 text-sm">
            Irregular (unpredictable timing, varying cycle length)
          </Label>
        </div>
        <div className="flex items-center space-x-3 cursor-pointer">
          <RadioGroupItem value="stopped" id="stopped" className="cursor-pointer" />
          <Label htmlFor="stopped" className="cursor-pointer flex-1 text-sm">
            Stopped completely (no periods for 12+ months)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MenstrualStatusSelector;
