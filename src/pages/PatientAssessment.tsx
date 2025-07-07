
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
  
  // Generate a proper unique session ID if one isn't provided or is the placeholder
  const actualSessionId = (sessionId && sessionId !== ':sessionId') 
    ? sessionId 
    : `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log("=== PATIENT ASSESSMENT COMPONENT ===");
  console.log("Raw sessionId from params:", sessionId);
  console.log("Actual sessionId being used:", actualSessionId);
  
  const { processAssessmentCompletion } = useAssessmentCompletion(actualSessionId);
  
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
    // If sessionId is invalid, redirect after generating a new one
    if (!sessionId || sessionId === ':sessionId') {
      console.log("Invalid sessionId, redirecting with new sessionId:", actualSessionId);
      navigate(`/patient-assessment/${actualSessionId}`, { replace: true });
    }
  }, [sessionId, navigate, actualSessionId]);

  const handleNext = async () => {
    console.log("=== HANDLE NEXT CLICKED ===");
    console.log("Next clicked, step:", currentStep, "of", totalSteps);
    console.log("Assessment data:", assessmentData);
    console.log("Using sessionId:", actualSessionId);
    
    // Check if this is the final step
    if (currentStep === totalSteps) {
      console.log("=== FINAL STEP - PROCESSING COMPLETION ===");
      console.log("Session ID:", actualSessionId);
      console.log("Assessment data before completion:", assessmentData);
      
      setIsSubmitting(true);
      try {
        await processAssessmentCompletion(assessmentData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("=== MOVING TO NEXT STEP ===");
      setCurrentStep(currentStep + 1);
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
