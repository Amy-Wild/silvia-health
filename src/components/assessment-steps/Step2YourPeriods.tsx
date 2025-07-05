
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenstrualStatusSelector from "./step2-components/MenstrualStatusSelector";
import PostmenopausalQuestions from "./step2-components/PostmenopausalQuestions";
import PerimenopauseQuestions from "./step2-components/PerimenopauseQuestions";
import RedFlagSymptoms from "./step2-components/RedFlagSymptoms";
import UTIHistoryQuestion from "./step2-components/UTIHistoryQuestion";

interface Step2YourPeriodsProps {
  data: any;
  onUpdate: (key: string, value: any) => void;
}

const Step2YourPeriods = ({ data, onUpdate }: Step2YourPeriodsProps) => {
  const [showPostmenopausalQuestions, setShowPostmenopausalQuestions] = useState(
    data.menstrualStatus === "stopped"
  );
  const [showPerimenopauseQuestions, setShowPerimenopauseQuestions] = useState(
    data.menstrualStatus === "perimenopause"
  );

  const handleMenstrualStatusChange = (value: string) => {
    console.log("Menstrual status changing to:", value);
    onUpdate("menstrualStatus", value);
    
    // Show/hide relevant sections
    setShowPostmenopausalQuestions(value === "stopped");
    setShowPerimenopauseQuestions(value === "perimenopause");
    
    // Clear related fields when status changes
    if (value !== "stopped") {
      onUpdate("periodsStopped", "");
      onUpdate("postmenopausalBleeding", "");
      onUpdate("lastPeriodDate", "");
      onUpdate("menopauseType", "");
    }
    if (value !== "perimenopause") {
      onUpdate("cycleChanges", []);
      onUpdate("periodChanges", "");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Menstrual History & Health Screening</CardTitle>
          <p className="text-sm text-gray-600">
            Based on NICE Clinical Guideline NG23 for Menopause Assessment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <MenstrualStatusSelector 
            value={data.menstrualStatus}
            onValueChange={handleMenstrualStatusChange}
          />

          {showPostmenopausalQuestions && (
            <PostmenopausalQuestions 
              periodsStopped={data.periodsStopped}
              postmenopausalBleeding={data.postmenopausalBleeding}
              lastPeriodDate={data.lastPeriodDate}
              menopauseType={data.menopauseType}
              onUpdate={onUpdate}
            />
          )}

          {showPerimenopauseQuestions && (
            <PerimenopauseQuestions 
              cycleChanges={data.cycleChanges}
              periodChanges={data.periodChanges}
              onUpdate={onUpdate}
            />
          )}

          <RedFlagSymptoms 
            unexplainedWeightLoss={data.unexplainedWeightLoss}
            severePelvicPain={data.severePelvicPain}
            onUpdate={onUpdate}
          />

          <UTIHistoryQuestion 
            value={data.utiHistory}
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2YourPeriods;
