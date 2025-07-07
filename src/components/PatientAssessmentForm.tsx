
import { useState, useEffect } from "react";
import Step1AboutYou from "./assessment-steps/Step1AboutYou";
import Step2YourPeriods from "./assessment-steps/Step2YourPeriods";
import Step3HotFlashes from "./assessment-steps/Step3HotFlashes";
import Step4PhysicalSymptoms from "./assessment-steps/Step4PhysicalSymptoms";
import Step5MentalHealth from "./assessment-steps/Step5MentalHealth";
import Step6SleepIntimacy from "./assessment-steps/Step6SleepIntimacy";
import Step7Lifestyle from "./assessment-steps/Step7Lifestyle";
import Step8Complete from "./assessment-steps/Step8Complete";
import PatientConsentForm from "./PatientConsentForm";
import { validateClinicalAssessment } from "@/utils/clinicalValidation";
import { useToast } from "@/hooks/use-toast";
import type { PatientAssessmentData, ConsentData } from "@/types/clinicalTypes";

interface PatientAssessmentFormProps {
  step: number;
  data: PatientAssessmentData;
  onDataChange: (data: PatientAssessmentData) => void;
}

const PatientAssessmentForm = ({ step, data, onDataChange }: PatientAssessmentFormProps) => {
  const [formData, setFormData] = useState<PatientAssessmentData>(data);
  const [showConsent, setShowConsent] = useState(!data.consentData);
  const { toast } = useToast();

  console.log("=== PATIENT ASSESSMENT FORM ===");
  console.log("Current step:", step);
  console.log("Form data:", formData);

  const updateData = (key: string, value: any) => {
    console.log("=== UPDATING FORM DATA ===");
    console.log("Key:", key);
    console.log("Value:", value);
    
    const newData = { ...formData, [key]: value };
    console.log("New form data:", newData);
    
    setFormData(newData);
    onDataChange(newData);
  };

  const handleConsentGiven = (consentData: ConsentData) => {
    console.log("=== CONSENT GIVEN ===");
    console.log("Consent data:", consentData);
    
    const newData = { ...formData, consentData };
    setFormData(newData);
    onDataChange(newData);
    setShowConsent(false);
    
    toast({
      title: "Consent Recorded",
      description: "Your consent preferences have been saved securely.",
    });
  };

  // Clinical validation on step completion
  useEffect(() => {
    if (step > 1) {
      const clinicalValidation = validateClinicalAssessment(formData);
      if (clinicalValidation.warnings.length > 0) {
        console.log('Clinical warnings:', clinicalValidation.warnings);
      }
    }
  }, [step, formData]);

  // Show consent form first
  if (showConsent) {
    return <PatientConsentForm onConsentGiven={handleConsentGiven} />;
  }

  const renderStep = () => {
    console.log("=== RENDERING STEP ===");
    console.log("Step number:", step);
    
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
        return <Step5MentalHealth data={formData} onUpdate={updateData} />;
      case 6:
        return <Step6SleepIntimacy data={formData} onUpdate={updateData} />;
      case 7:
        return <Step7Lifestyle data={formData} onUpdate={updateData} />;
      case 8:
        console.log("=== STEP 8 COMPLETE - CALLING COMPLETION ===");
        return <Step8Complete data={formData} onUpdate={updateData} />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div>
      {renderStep()}
    </div>
  );
};

export default PatientAssessmentForm;
