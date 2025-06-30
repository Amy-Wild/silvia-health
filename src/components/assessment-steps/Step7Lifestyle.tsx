
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface Step7Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step7Lifestyle = ({ data, onUpdate }: Step7Props) => {
  return (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Lifestyle & Health Information</span>
          </div>
          <p className="text-green-700 text-sm">
            These questions help your GP understand your overall health and provide personalized care.
          </p>
        </CardContent>
      </Card>

      <div>
        <Label>Do you currently smoke?</Label>
        <RadioGroup
          value={data.smokingStatus}
          onValueChange={(value) => onUpdate("smokingStatus", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="never" id="smoke-never" />
            <Label htmlFor="smoke-never">Never smoked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="former" id="smoke-former" />
            <Label htmlFor="smoke-former">Used to smoke but quit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="current" id="smoke-current" />
            <Label htmlFor="smoke-current">Yes, I currently smoke</Label>
          </div>
        </RadioGroup>
      </div>

      {data.smokingStatus === "current" && (
        <div>
          <Label htmlFor="cigarettes-per-day">How many cigarettes per day?</Label>
          <Input
            id="cigarettes-per-day"
            type="number"
            value={data.cigarettesPerDay || ""}
            onChange={(e) => onUpdate("cigarettesPerDay", e.target.value)}
            placeholder="e.g., 10"
            className="mt-1"
          />
        </div>
      )}

      <div>
        <Label>How much alcohol do you drink per week?</Label>
        <Select onValueChange={(value) => onUpdate("alcoholConsumption", value)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select your alcohol consumption" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">I don't drink alcohol</SelectItem>
            <SelectItem value="1-7">1-7 units per week</SelectItem>
            <SelectItem value="8-14">8-14 units per week</SelectItem>
            <SelectItem value="15-21">15-21 units per week</SelectItem>
            <SelectItem value="22+">22+ units per week</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-600 mt-1">
          1 unit = small glass of wine, half pint of beer, or single measure of spirits
        </p>
      </div>

      <div>
        <Label>How much exercise do you do per week?</Label>
        <RadioGroup
          value={data.exerciseLevel}
          onValueChange={(value) => onUpdate("exerciseLevel", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="exercise-none" />
            <Label htmlFor="exercise-none">Little to no exercise</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="exercise-light" />
            <Label htmlFor="exercise-light">Light exercise (1-2 times per week)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="exercise-moderate" />
            <Label htmlFor="exercise-moderate">Moderate exercise (3-4 times per week)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="exercise-high" />
            <Label htmlFor="exercise-high">Regular exercise (5+ times per week)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Have you had frequent urinary tract infections (UTIs) recently?</Label>
        <RadioGroup
          value={data.frequentUTIs}
          onValueChange={(value) => onUpdate("frequentUTIs", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="uti-no" />
            <Label htmlFor="uti-no">No, not recently</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="some" id="uti-some" />
            <Label htmlFor="uti-some">Yes, 1-2 in the past year</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="frequent" id="uti-frequent" />
            <Label htmlFor="uti-frequent">Yes, 3 or more in the past year</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Any family history of bone problems (osteoporosis/fractures)?</Label>
        <RadioGroup
          value={data.familyBoneHistory}
          onValueChange={(value) => onUpdate("familyBoneHistory", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="bone-no" />
            <Label htmlFor="bone-no">No family history</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="bone-yes" />
            <Label htmlFor="bone-yes">Yes, in mother/sister</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="bone-unsure" />
            <Label htmlFor="bone-unsure">I'm not sure</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step7Lifestyle;
