
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentNavigation from "@/components/assessment/AssessmentNavigation";
import WelcomeMessage from "@/components/assessment/WelcomeMessage";
import RiskBadgeDisplay from "@/components/assessment/RiskBadgeDisplay";
import UrgentWarning from "@/components/assessment/UrgentWarning";
import AssessmentFormSection from "@/components/assessment/AssessmentFormSection";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentCompletion } from "@/hooks/useAssessmentCompletion";

const PatientAssessment = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { processAssessmentCompletion } = useAssessmentCompletion(sessionId);
  
  const {
    currentStep,
    setCurrentStep,
    assessmentData,
    isValid,
    isSubmitting,
    setIsSubmitting,
    totalSteps,
    steps,
    handleDataChange,
    getRiskBadge,
    showUrgentWarning
  } = useAssessmentState();

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  const handleNext = async () => {
    console.log("=== HANDLE NEXT CLICKED ===");
    console.log("Current step:", currentStep);
    console.log("Total steps:", totalSteps);
    console.log("Assessment data:", assessmentData);
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("=== FINAL STEP - PROCESSING COMPLETION ===");
      console.log("Session ID:", sessionId);
      console.log("Assessment data before completion:", assessmentData);
      
      setIsSubmitting(true);
      try {
        await processAssessmentCompletion(assessmentData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const riskBadge = getRiskBadge();
  const shouldShowRiskBadge = riskBadge.className !== "bg-green-500 text-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <AssessmentHeader />

      {shouldShowRiskBadge && <RiskBadgeDisplay riskBadge={riskBadge} />}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <WelcomeMessage show={currentStep === 1} />

          <UrgentWarning show={showUrgentWarning()} />

          <AssessmentProgress 
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />

          <AssessmentFormSection
            currentStep={currentStep}
            steps={steps}
            assessmentData={assessmentData}
            onDataChange={handleDataChange}
          />

          <AssessmentNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            isValid={isValid}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientAssessment;
