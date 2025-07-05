
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

interface Step2YourPeriodsProps {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step2YourPeriods = ({ data, onUpdate }: Step2YourPeriodsProps) => {
  const [showPostmenopausalQuestions, setShowPostmenopausalQuestions] = useState(
    data.menstrualStatus === "stopped"
  );

  const handleMenstrualStatusChange = (value: string) => {
    console.log("Menstrual status changing to:", value);
    onUpdate("menstrualStatus", value);
    setShowPostmenopausalQuestions(value === "stopped");
    // Clear related fields when status changes
    if (value !== "stopped") {
      onUpdate("periodsStopped", "");
      onUpdate("postmenopausalBleeding", "");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Menstrual History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current menstrual status */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              Which best describes your periods currently?
            </Label>
            <RadioGroup 
              value={data.menstrualStatus || ""} 
              onValueChange={handleMenstrualStatusChange}
              className="space-y-4"
            >
              <Label htmlFor="menstrual-regular" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="regular" id="menstrual-regular" />
                <span>Regular (monthly cycles)</span>
              </Label>
              <Label htmlFor="menstrual-irregular" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="irregular" id="menstrual-irregular" />
                <span>Irregular (unpredictable timing)</span>
              </Label>
              <Label htmlFor="menstrual-stopped" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="stopped" id="menstrual-stopped" />
                <span>Stopped completely</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Enhanced timeline dropdown for stopped periods */}
          {showPostmenopausalQuestions && (
            <>
              <div>
                <Label className="text-base font-medium mb-3 block">
                  How long ago did your periods stop?
                </Label>
                <Select value={data.periodsStopped || ""} onValueChange={(value) => onUpdate("periodsStopped", value)}>
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
              {(data.periodsStopped === "1-2years" || data.periodsStopped === "2-5years" || data.periodsStopped === "5-10years" || data.periodsStopped === "more-than-10years") && (
                <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <Label className="text-base font-medium mb-3 block text-red-800">
                        Important: Have you had any bleeding or spotting since your periods stopped?
                      </Label>
                      <RadioGroup 
                        value={data.postmenopausalBleeding || ""} 
                        onValueChange={(value) => onUpdate("postmenopausalBleeding", value)}
                        className="space-y-3"
                      >
                        <Label htmlFor="no-bleeding" className="flex items-center space-x-3 cursor-pointer">
                          <RadioGroupItem value="no" id="no-bleeding" />
                          <span>No, no bleeding or spotting</span>
                        </Label>
                        <Label htmlFor="yes-bleeding" className="flex items-center space-x-3 cursor-pointer">
                          <RadioGroupItem value="yes" id="yes-bleeding" />
                          <span>Yes, I have had bleeding or spotting</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Red flag symptoms - weight loss */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-base font-medium mb-3 block text-amber-800">
                  Have you experienced unexplained weight loss (more than 10% of your body weight) in the past 6 months?
                </Label>
                <RadioGroup 
                  value={data.unexplainedWeightLoss || ""} 
                  onValueChange={(value) => onUpdate("unexplainedWeightLoss", value)}
                  className="space-y-3"
                >
                  <Label htmlFor="no-weight-loss" className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="no" id="no-weight-loss" />
                    <span>No</span>
                  </Label>
                  <Label htmlFor="yes-weight-loss" className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="yes" id="yes-weight-loss" />
                    <span>Yes</span>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Red flag symptoms - pelvic pain */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <Label className="text-base font-medium mb-3 block text-amber-800">
                  Do you have severe or persistent pelvic pain?
                </Label>
                <RadioGroup 
                  value={data.severePelvicPain || ""} 
                  onValueChange={(value) => onUpdate("severePelvicPain", value)}
                  className="space-y-3"
                >
                  <Label htmlFor="no-pelvic-pain" className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="no" id="no-pelvic-pain" />
                    <span>No</span>
                  </Label>
                  <Label htmlFor="mild-pelvic-pain" className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="mild" id="mild-pelvic-pain" />
                    <span>Mild discomfort</span>
                  </Label>
                  <Label htmlFor="yes-pelvic-pain" className="flex items-center space-x-3 cursor-pointer">
                    <RadioGroupItem value="yes" id="yes-pelvic-pain" />
                    <span>Yes, severe or persistent pain</span>
                  </Label>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* UTI History Question */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Have you had frequent urinary tract infections (UTIs) recently?
            </Label>
            <RadioGroup 
              value={data.utiHistory || ""} 
              onValueChange={(value) => onUpdate("utiHistory", value)}
              className="space-y-3"
            >
              <Label htmlFor="no-uti" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="no" id="no-uti" />
                <span>No recent UTIs</span>
              </Label>
              <Label htmlFor="occasional-uti" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="occasional" id="occasional-uti" />
                <span>Occasional UTIs (1-2 per year)</span>
              </Label>
              <Label htmlFor="frequent-uti" className="flex items-center space-x-3 cursor-pointer">
                <RadioGroupItem value="frequent" id="frequent-uti" />
                <span>Frequent UTIs (3+ per year)</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2YourPeriods;
