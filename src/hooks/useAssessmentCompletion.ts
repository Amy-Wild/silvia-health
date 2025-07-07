

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

      // Route based on care pathway - Updated to redirect to educational website
      if (determinedPath === 'self-care' || determinedPath === 'education') {
        const treatmentPreferences = normalizedData.treatmentPreferences || [];
        const educationUrl = treatmentPreferences.length > 0 
          ? `/education?preferences=${treatmentPreferences.join(',')}&sessionId=${sessionId}&source=assessment`
          : `/education?sessionId=${sessionId}&source=assessment`;
        
        toast({
          title: "Great news! You can manage your symptoms effectively",
          description: "You're being redirected to educational resources to support your wellness journey.",
          duration: 3000
        });
        
        // Redirect to educational website after brief delay
        setTimeout(() => {
          window.location.href = educationUrl;
        }, 2000);
        
        return;
      } else {
        // Show patient guidance for GP appointments
        const patientGuidance = generatePatientGuidance(normalizedData);
        
        toast({
          title: "GP consultation recommended",
          description: patientGuidance,
          duration: 5000
        });
        
        navigate(`/patient-results/${sessionId}`);
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { processAssessmentCompletion };
};

