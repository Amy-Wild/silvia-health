
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface Step1Props {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step1AboutYou = ({ data, onUpdate }: Step1Props) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Your age</Label>
          <Input
            id="age"
            type="number"
            value={data.age || ""}
            onChange={(e) => onUpdate("age", e.target.value)}
            placeholder="e.g., 45"
          />
        </div>
        <div>
          <Label htmlFor="occupation">Your occupation (optional)</Label>
          <Input
            id="occupation"
            value={data.occupation || ""}
            onChange={(e) => onUpdate("occupation", e.target.value)}
            placeholder="e.g., Teacher, Manager"
          />
        </div>
      </div>

      <div>
        <Label>What brings you to see your GP today?</Label>
        <Textarea
          value={data.primaryConcern || ""}
          onChange={(e) => onUpdate("primaryConcern", e.target.value)}
          placeholder="Tell us about your main concerns or symptoms..."
          className="mt-2"
        />
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">About This Assessment</span>
          </div>
          <p className="text-blue-700 text-sm">
            This assessment follows NHS guidelines to help your GP understand your symptoms and provide the best care. Your answers are confidential and will only be shared with your healthcare team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step1AboutYou;
