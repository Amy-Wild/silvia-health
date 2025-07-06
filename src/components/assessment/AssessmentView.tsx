
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PatientAssessmentForm from "@/components/PatientAssessmentForm";
import { useAssessmentState } from "@/hooks/useAssessmentState";
import { useAssessmentCompletion } from "@/hooks/useAssessmentCompletion";
import AssessmentHeader from "@/components/assessment/AssessmentHeader";
import AssessmentProgress from "@/components/assessment/AssessmentProgress";
import AssessmentNavigation from "@/components/assessment/AssessmentNavigation";

interface AssessmentViewProps {
  sessionId: string;
  assessmentLink: any;
}

const AssessmentView = ({ sessionId, assessmentLink }: AssessmentViewProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use assessment state management
  const {
    currentStep,
    setCurrentStep,
    assessmentData,
    isValid,
    totalSteps,
    steps,
    handleDataChange,
    getRiskBadge,
    showUrgentWarning
  } = useAssessmentState();

  const { processAssessmentCompletion } = useAssessmentCompletion(sessionId);

  const handleSubmit = async () => {
    if (!sessionId) return;
    
    setIsSubmitting(true);
    try {
      // Store assessment data locally for GP results
      const assessmentResult = {
        sessionId,
        rawData: assessmentData,
        completedAt: new Date().toISOString(),
        patientRef: assessmentLink?.patient_identifier || 'Patient Assessment'
      };
      
      localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(assessmentResult));
      
      // Update assessment link status - properly cast to Json
      await supabase
        .from('assessment_links')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          session_data: assessmentData as any
        })
        .eq('id', sessionId);

      await processAssessmentCompletion(assessmentData);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gentle-blue/30 to-soft-coral/20">
      <div className="container mx-auto px-4 py-8">
        <AssessmentHeader 
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitle={steps[currentStep - 1]}
          riskBadge={getRiskBadge()}
          showUrgentWarning={showUrgentWarning()}
        />
        
        <AssessmentProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />

        <div className="mt-8">
          <PatientAssessmentForm
            step={currentStep}
            data={assessmentData}
            onDataChange={handleDataChange}
          />
        </div>

        <AssessmentNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onPrevious={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
          onNext={() => currentStep < totalSteps && setCurrentStep(currentStep + 1)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AssessmentView;
