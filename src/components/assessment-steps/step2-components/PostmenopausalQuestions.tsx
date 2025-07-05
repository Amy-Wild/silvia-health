
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Info } from "lucide-react";

interface PostmenopausalQuestionsProps {
  periodsStopped: string;
  postmenopausalBleeding: string;
  lastPeriodDate: string;
  menopauseType: string;
  onUpdate: (key: string, value: any) => void;
}

const PostmenopausalQuestions = ({ 
  periodsStopped, 
  postmenopausalBleeding,
  lastPeriodDate,
  menopauseType,
  onUpdate 
}: PostmenopausalQuestionsProps) => {
  return (
    <>
      <div>
        <Label className="text-base font-medium mb-3 block">
          How long ago did your periods stop completely?
        </Label>
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Natural menopause is confirmed after 12 months without periods
            </p>
          </div>
        </div>
        <Select value={periodsStopped || ""} onValueChange={(value) => onUpdate("periodsStopped", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="less-than-12months">Less than 12 months ago</SelectItem>
            <SelectItem value="12-24months">12-24 months ago</SelectItem>
            <SelectItem value="2-5years">2-5 years ago</SelectItem>
            <SelectItem value="5-10years">5-10 years ago</SelectItem>
            <SelectItem value="more-than-10years">More than 10 years ago</SelectItem>
            <SelectItem value="unsure">I'm not sure of the exact timing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">
          How did your menopause occur?
        </Label>
        <RadioGroup 
          value={menopauseType || ""} 
          onValueChange={(value) => onUpdate("menopauseType", value)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="natural" id="natural-menopause" />
            <Label htmlFor="natural-menopause" className="cursor-pointer flex-1">
              Natural menopause (periods gradually stopped)
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="surgical" id="surgical-menopause" />
            <Label htmlFor="surgical-menopause" className="cursor-pointer flex-1">
              Surgical menopause (ovaries removed)
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="medical" id="medical-menopause" />
            <Label htmlFor="medical-menopause" className="cursor-pointer flex-1">
              Medical menopause (treatment-induced)
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="unknown" id="unknown-menopause" />
            <Label htmlFor="unknown-menopause" className="cursor-pointer flex-1">
              I'm not sure
            </Label>
          </div>
        </RadioGroup>
      </div>

      {(periodsStopped === "12-24months" || periodsStopped === "2-5years" || periodsStopped === "5-10years" || periodsStopped === "more-than-10years") && (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <Label className="text-base font-medium mb-3 block text-red-800">
                🚨 Important Health Question: Have you had any bleeding or spotting since your periods stopped completely?
              </Label>
              <div className="bg-red-100 p-2 rounded mb-3">
                <p className="text-xs text-red-700">
                  Any bleeding after 12+ months without periods requires urgent medical attention
                </p>
              </div>
              <RadioGroup 
                value={postmenopausalBleeding || ""} 
                onValueChange={(value) => onUpdate("postmenopausalBleeding", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="no" id="no-bleeding" />
                  <Label htmlFor="no-bleeding" className="cursor-pointer flex-1">
                    No, no bleeding or spotting at all
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="yes" id="yes-bleeding" />
                  <Label htmlFor="yes-bleeding" className="cursor-pointer flex-1 font-medium text-red-700">
                    ⚠️ Yes, I have had bleeding or spotting
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="unsure" id="unsure-bleeding" />
                  <Label htmlFor="unsure-bleeding" className="cursor-pointer flex-1">
                    I'm not sure / can't remember
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )}

      {menopauseType === "natural" && (periodsStopped === "less-than-12months" || periodsStopped === "12-24months") && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <Label className="text-base font-medium mb-2 block text-amber-800">
                Additional Information Needed
              </Label>
              <p className="text-sm text-amber-700 mb-3">
                For accurate assessment, please provide more detail about when your last period occurred.
              </p>
              <Label className="text-sm font-medium mb-2 block">
                Approximately when was your last period?
              </Label>
              <Select value={lastPeriodDate || ""} onValueChange={(value) => onUpdate("lastPeriodDate", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3months">1-3 months ago</SelectItem>
                  <SelectItem value="3-6months">3-6 months ago</SelectItem>
                  <SelectItem value="6-9months">6-9 months ago</SelectItem>
                  <SelectItem value="9-12months">9-12 months ago</SelectItem>
                  <SelectItem value="over-12months">Over 12 months ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostmenopausalQuestions;
