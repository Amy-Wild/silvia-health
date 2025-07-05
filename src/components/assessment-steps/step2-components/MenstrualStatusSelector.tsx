
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MenstrualStatusSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const MenstrualStatusSelector = ({ value, onValueChange }: MenstrualStatusSelectorProps) => {
  console.log("Current menstrual status value:", value);
  
  const handleValueChange = (newValue: string) => {
    console.log("Radio group value changing to:", newValue);
    onValueChange(newValue);
  };
  
  return (
    <div>
      <Label className="text-base font-medium mb-4 block">
        Which best describes your periods currently?
      </Label>
      <RadioGroup 
        value={value || ""} 
        onValueChange={handleValueChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="regular" id="regular" />
          <Label htmlFor="regular" className="cursor-pointer text-sm flex-1">
            Regular (monthly cycles, 21-35 day intervals)
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="irregular" id="irregular" />
          <Label htmlFor="irregular" className="cursor-pointer text-sm flex-1">
            Irregular (unpredictable timing, varying cycle length)
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
          <RadioGroupItem value="stopped" id="stopped" />
          <Label htmlFor="stopped" className="cursor-pointer text-sm flex-1">
            Stopped completely (no periods for 12+ months)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default MenstrualStatusSelector;
