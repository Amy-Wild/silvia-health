
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
          {/* Current menstrual status with improved clickability */}
          <div>
            <Label className="text-base font-medium mb-4 block">
              Which best describes your periods currently?
            </Label>
            <RadioGroup 
              value={data.menstrualStatus || ""} 
              onValueChange={handleMenstrualStatusChange}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="regular" id="menstrual-regular" />
                <Label htmlFor="menstrual-regular" className="cursor-pointer flex-1">Regular (monthly cycles)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="irregular" id="menstrual-irregular" />
                <Label htmlFor="menstrual-irregular" className="cursor-pointer flex-1">Irregular (unpredictable timing)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="stopped" id="menstrual-stopped" />
                <Label htmlFor="menstrual-stopped" className="cursor-pointer flex-1">Stopped completely</Label>
              </div>
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
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="no" id="no-bleeding" />
                          <Label htmlFor="no-bleeding" className="cursor-pointer flex-1">No, no bleeding or spotting</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="yes" id="yes-bleeding" />
                          <Label htmlFor="yes-bleeding" className="cursor-pointer flex-1">Yes, I have had bleeding or spotting</Label>
                        </div>
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
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="no-weight-loss" />
                    <Label htmlFor="no-weight-loss" className="cursor-pointer flex-1">No</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="yes-weight-loss" />
                    <Label htmlFor="yes-weight-loss" className="cursor-pointer flex-1">Yes</Label>
                  </div>
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
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="no-pelvic-pain" />
                    <Label htmlFor="no-pelvic-pain" className="cursor-pointer flex-1">No</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="mild" id="mild-pelvic-pain" />
                    <Label htmlFor="mild-pelvic-pain" className="cursor-pointer flex-1">Mild discomfort</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="yes-pelvic-pain" />
                    <Label htmlFor="yes-pelvic-pain" className="cursor-pointer flex-1">Yes, severe or persistent pain</Label>
                  </div>
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
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="no" id="no-uti" />
                <Label htmlFor="no-uti" className="cursor-pointer flex-1">No recent UTIs</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="occasional" id="occasional-uti" />
                <Label htmlFor="occasional-uti" className="cursor-pointer flex-1">Occasional UTIs (1-2 per year)</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="frequent" id="frequent-uti" />
                <Label htmlFor="frequent-uti" className="cursor-pointer flex-1">Frequent UTIs (3+ per year)</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2YourPeriods;
