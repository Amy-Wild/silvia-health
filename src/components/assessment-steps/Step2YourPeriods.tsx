
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenstrualStatusSelector from "./step2-components/MenstrualStatusSelector";
import PostmenopausalQuestions from "./step2-components/PostmenopausalQuestions";
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
          <MenstrualStatusSelector 
            value={data.menstrualStatus}
            onValueChange={handleMenstrualStatusChange}
          />

          {showPostmenopausalQuestions && (
            <PostmenopausalQuestions 
              periodsStopped={data.periodsStopped}
              postmenopausalBleeding={data.postmenopausalBleeding}
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
