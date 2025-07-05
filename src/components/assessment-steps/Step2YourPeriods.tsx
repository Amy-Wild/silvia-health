
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
            <Label className="text-base font-medium mb-3 block">
              Which best describes your periods currently?
            </Label>
            <RadioGroup 
              value={data.menstrualStatus || ""} 
              onValueChange={handleMenstrualStatusChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular (monthly cycles)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="irregular" id="irregular" />
                <Label htmlFor="irregular">Irregular (unpredictable timing)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stopped" id="stopped" />
                <Label htmlFor="stopped">Stopped completely</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Follow-up questions for stopped periods */}
          {showPostmenopausalQuestions && (
            <>
              <div>
                <Label className="text-base font-medium mb-3 block">
                  How long ago did your periods stop?
                </Label>
                <RadioGroup 
                  value={data.periodsStopped || ""} 
                  onValueChange={(value) => onUpdate("periodsStopped", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-than-1year" id="less-1year" />
                    <Label htmlFor="less-1year">Less than 1 year ago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-2years" id="1-2years" />
                    <Label htmlFor="1-2years">1-2 years ago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2+years" id="2plus-years" />
                    <Label htmlFor="2plus-years">More than 2 years ago</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Critical red flag question - postmenopausal bleeding */}
              {(data.periodsStopped === "1-2years" || data.periodsStopped === "2+years") && (
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
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no-bleeding" />
                          <Label htmlFor="no-bleeding">No, no bleeding or spotting</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes-bleeding" />
                          <Label htmlFor="yes-bleeding">Yes, I have had bleeding or spotting</Label>
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-weight-loss" />
                    <Label htmlFor="no-weight-loss">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-weight-loss" />
                    <Label htmlFor="yes-weight-loss">Yes</Label>
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-pelvic-pain" />
                    <Label htmlFor="no-pelvic-pain">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild-pelvic-pain" />
                    <Label htmlFor="mild-pelvic-pain">Mild discomfort</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-pelvic-pain" />
                    <Label htmlFor="yes-pelvic-pain">Yes, severe or persistent pain</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2YourPeriods;
