
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
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="regular" id="menstrual-regular" />
          <Label htmlFor="menstrual-regular" className="cursor-pointer">
            Regular (monthly cycles)
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="irregular" id="menstrual-irregular" />
          <Label htmlFor="menstrual-irregular" className="cursor-pointer">
            Irregular (unpredictable timing)
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="stopped" id="menstrual-stopped" />
          <Label htmlFor="menstrual-stopped" className="cursor-pointer">
            Stopped completely
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MenstrualStatusSelector;
