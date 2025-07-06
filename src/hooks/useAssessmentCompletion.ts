
import { useNavigate } from "react-router-dom";
import { processAssessmentData } from "@/utils/assessmentProcessor";
import { generatePatientGuidance } from "@/components/ConditionalQuestionLogic";
import { useToast } from "@/hooks/use-toast";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export const useAssessmentCompletion = (sessionId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const processAssessmentCompletion = async (assessmentData: PatientAssessmentData) => {
    try {
      const { result, normalizedData, determinedPath } = await processAssessmentData(assessmentData, sessionId!);

      // Show completion message
      toast({
        title: "Assessment Complete!",
        description: "Your assessment has been submitted successfully. Thank you for completing the evaluation.",
        duration: 5000
      });

      // For now, show a completion message instead of redirecting
      // The GP can access results through the GP Results page using the session ID
      setTimeout(() => {
        toast({
          title: "Next Steps",
          description: "Your healthcare provider can now review your assessment results. Please follow up as directed.",
          duration: 8000
        });
      }, 2000);

    } catch (error) {
      console.error('Assessment completion error:', error);
      toast({
        title: "Error", 
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { processAssessmentCompletion };
};
