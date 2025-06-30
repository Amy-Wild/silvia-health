
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Step2Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step2YourPeriods = ({ data, onUpdate }: Step2Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>How would you describe your periods currently?</Label>
        <RadioGroup
          value={data.menstrualStatus}
          onValueChange={(value) => onUpdate("menstrualStatus", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="regular" />
            <Label htmlFor="regular">Regular - same pattern as usual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="irregular" id="irregular" />
            <Label htmlFor="irregular">Irregular - different timing or flow</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stopped" id="stopped" />
            <Label htmlFor="stopped">My periods have stopped</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hysterectomy" id="hysterectomy" />
            <Label htmlFor="hysterectomy">I've had a hysterectomy</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>If your periods have stopped, how long ago?</Label>
        <Select onValueChange={(value) => onUpdate("periodsStopped", value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3-6months">3-6 months ago</SelectItem>
            <SelectItem value="6-12months">6-12 months ago</SelectItem>
            <SelectItem value="1-2years">1-2 years ago</SelectItem>
            <SelectItem value="2+years">More than 2 years ago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <Label className="text-red-800 font-medium">Important Question</Label>
          </div>
          <div className="mt-3">
            <Label>Have you had any bleeding after your periods stopped for 12+ months?</Label>
            <RadioGroup
              value={data.postmenopausalBleeding}
              onValueChange={(value) => onUpdate("postmenopausalBleeding", value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="bleeding-yes" />
                <Label htmlFor="bleeding-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="bleeding-no" />
                <Label htmlFor="bleeding-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2YourPeriods;
