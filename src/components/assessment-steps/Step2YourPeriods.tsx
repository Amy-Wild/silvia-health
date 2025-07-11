
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenstrualStatusSelector from "./step2-components/MenstrualStatusSelector";
import PostmenopausalQuestions from "./step2-components/PostmenopausalQuestions";
import RedFlagSymptoms from "./step2-components/RedFlagSymptoms";
import UTIHistoryQuestion from "./step2-components/UTIHistoryQuestion";
import { AssessmentStepProps } from "@/types/componentTypes";

type Step2YourPeriodsProps = AssessmentStepProps;

const Step2YourPeriods = ({ data, onUpdate }: Step2YourPeriodsProps) => {
  const [showPostmenopausalQuestions, setShowPostmenopausalQuestions] = useState(
    data.menstrualStatus === "stopped"
  );

  const handleMenstrualStatusChange = (value: string) => {
    console.log("Menstrual status changing to:", value);
    
    // Update the parent state immediately
    onUpdate("menstrualStatus", value);
    
    // Show/hide relevant sections
    setShowPostmenopausalQuestions(value === "stopped");
    
    // Clear related fields when status changes
    if (value !== "stopped") {
      onUpdate("periodsStopped", "");
      onUpdate("postmenopausalBleeding", "");
      onUpdate("lastPeriodDate", "");
      onUpdate("menopauseType", "");
    }
  };

  // Update showPostmenopausalQuestions when data.menstrualStatus changes
  useEffect(() => {
    setShowPostmenopausalQuestions(data.menstrualStatus === "stopped");
  }, [data.menstrualStatus]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Menstrual History & Health Screening</CardTitle>
          <p className="text-sm text-gray-600">
            Understanding your menstrual health helps us provide better guidance
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <MenstrualStatusSelector 
            value={data.menstrualStatus || ""}
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
