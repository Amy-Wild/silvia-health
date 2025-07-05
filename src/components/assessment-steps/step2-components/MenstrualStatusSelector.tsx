
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
        <Label htmlFor="regular" className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="regular" id="regular" className="cursor-pointer" />
          <span className="flex-1 text-sm">
            Regular (monthly cycles, 21-35 day intervals)
          </span>
        </Label>
        
        <Label htmlFor="irregular" className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="irregular" id="irregular" className="cursor-pointer" />
          <span className="flex-1 text-sm">
            Irregular (unpredictable timing, varying cycle length)
          </span>
        </Label>
        
        <Label htmlFor="stopped" className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="stopped" id="stopped" className="cursor-pointer" />
          <span className="flex-1 text-sm">
            Stopped completely (no periods for 12+ months)
          </span>
        </Label>
      </RadioGroup>
    </div>
  );
};

export default MenstrualStatusSelector;
