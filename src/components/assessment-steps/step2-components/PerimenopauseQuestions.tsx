
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

interface PerimenopauseQuestionsProps {
  cycleChanges: string[];
  periodChanges: string;
  onUpdate: (key: string, value: any) => void;
}

const PerimenopauseQuestions = ({ 
  cycleChanges, 
  periodChanges,
  onUpdate 
}: PerimenopauseQuestionsProps) => {
  const handleCycleChangesUpdate = (change: string, checked: boolean) => {
    const currentChanges = cycleChanges || [];
    if (checked) {
      onUpdate("cycleChanges", [...currentChanges, change]);
    } else {
      onUpdate("cycleChanges", currentChanges.filter(c => c !== change));
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <Label className="text-base font-medium mb-2 block text-blue-800">
              Perimenopause Assessment
            </Label>
            <p className="text-sm text-blue-700">
              Perimenopause typically begins with changes to menstrual cycle length and flow, 
              usually in the 40s but can start earlier.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">
          What changes have you noticed in your menstrual cycle? (Select all that apply)
        </Label>
        <div className="space-y-3">
          {[
            { id: 'shorter-cycles', label: 'Cycles getting shorter (less than 21 days)' },
            { id: 'longer-cycles', label: 'Cycles getting longer (more than 35 days)' },
            { id: 'missed-periods', label: 'Missed periods (skipping months)' },
            { id: 'irregular-timing', label: 'Very unpredictable timing' },
            { id: 'flow-changes', label: 'Changes in flow (heavier or lighter)' },
            { id: 'spotting', label: 'Spotting between periods' }
          ].map((change) => (
            <div key={change.id} className="flex items-center space-x-3">
              <Checkbox
                id={change.id}
                checked={cycleChanges?.includes(change.id) || false}
                onCheckedChange={(checked) => handleCycleChangesUpdate(change.id, checked as boolean)}
              />
              <Label htmlFor={change.id} className="cursor-pointer flex-1">
                {change.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">
          How long have you been experiencing these menstrual changes?
        </Label>
        <RadioGroup 
          value={periodChanges || ""} 
          onValueChange={(value) => onUpdate("periodChanges", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="less-than-6months" id="changes-recent" />
            <Label htmlFor="changes-recent" className="cursor-pointer flex-1">
              Less than 6 months
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="6-12months" id="changes-moderate" />
            <Label htmlFor="changes-moderate" className="cursor-pointer flex-1">
              6-12 months
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="1-2years" id="changes-established" />
            <Label htmlFor="changes-established" className="cursor-pointer flex-1">
              1-2 years
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="more-than-2years" id="changes-long" />
            <Label htmlFor="changes-long" className="cursor-pointer flex-1">
              More than 2 years
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default PerimenopauseQuestions;
