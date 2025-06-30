
import { useState } from "react";
import Step1AboutYou from "./assessment-steps/Step1AboutYou";
import Step2YourPeriods from "./assessment-steps/Step2YourPeriods";
import Step3HotFlashes from "./assessment-steps/Step3HotFlashes";
import Step4PhysicalSymptoms from "./assessment-steps/Step4PhysicalSymptoms";
import Step5MoodMemory from "./assessment-steps/Step5MoodMemory";
import Step6SleepIntimacy from "./assessment-steps/Step6SleepIntimacy";
import Step7Lifestyle from "./assessment-steps/Step7Lifestyle";
import Step8Complete from "./assessment-steps/Step8Complete";

interface PatientAssessmentFormProps {
  step: number;
  data: any;
  onDataChange: (data: any) => void;
}

const PatientAssessmentForm = ({ step, data, onDataChange }: PatientAssessmentFormProps) => {
  const [formData, setFormData] = useState(data);

  const updateData = (key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1AboutYou data={formData} onUpdate={updateData} />;
      case 2:
        return <Step2YourPeriods data={formData} onUpdate={updateData} />;
      case 3:
        return <Step3HotFlashes data={formData} onUpdate={updateData} />;
      case 4:
        return <Step4PhysicalSymptoms data={formData} onUpdate={updateData} />;
      case 5:
        return <Step5MoodMemory data={formData} onUpdate={updateData} />;
      case 6:
        return <Step6SleepIntimacy data={formData} onUpdate={updateData} />;
      case 7:
        return <Step7Lifestyle data={formData} onUpdate={updateData} />;
      case 8:
        return <Step8Complete data={formData} onUpdate={updateData} />;
      default:
        return <div>Step not found</div>;
    }
  };

  return <div>{renderStep()}</div>;
};

export default PatientAssessmentForm;
