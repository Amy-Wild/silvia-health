
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

interface PostmenopausalQuestionsProps {
  periodsStopped: string;
  postmenopausalBleeding: string;
  onUpdate: (key: string, value: any) => void;
}

const PostmenopausalQuestions = ({ 
  periodsStopped, 
  postmenopausalBleeding, 
  onUpdate 
}: PostmenopausalQuestionsProps) => {
  return (
    <>
      <div>
        <Label className="text-base font-medium mb-3 block">
          How long ago did your periods stop?
        </Label>
        <Select value={periodsStopped || ""} onValueChange={(value) => onUpdate("periodsStopped", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-6months">Less than 6 months ago</SelectItem>
            <SelectItem value="6-12months">6-12 months ago</SelectItem>
            <SelectItem value="1-2years">1-2 years ago</SelectItem>
            <SelectItem value="2-5years">2-5 years ago</SelectItem>
            <SelectItem value="5-10years">5-10 years ago</SelectItem>
            <SelectItem value="more-than-10years">More than 10 years ago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Critical red flag question - postmenopausal bleeding */}
      {(periodsStopped === "1-2years" || periodsStopped === "2-5years" || periodsStopped === "5-10years" || periodsStopped === "more-than-10years") && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <Label className="text-base font-medium mb-3 block text-red-800">
                Important: Have you had any bleeding or spotting since your periods stopped?
              </Label>
              <RadioGroup 
                value={postmenopausalBleeding || ""} 
                onValueChange={(value) => onUpdate("postmenopausalBleeding", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="no-bleeding" />
                  <Label htmlFor="no-bleeding" className="cursor-pointer">
                    No, no bleeding or spotting
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="yes-bleeding" />
                  <Label htmlFor="yes-bleeding" className="cursor-pointer">
                    Yes, I have had bleeding or spotting
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostmenopausalQuestions;
