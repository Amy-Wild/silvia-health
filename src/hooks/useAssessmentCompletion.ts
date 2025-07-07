
import { useNavigate } from "react-router-dom";
import { processAssessmentData } from "@/utils/assessmentProcessor";
import { generatePatientGuidance } from "@/components/ConditionalQuestionLogic";
import { useToast } from "@/hooks/use-toast";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export const useAssessmentCompletion = (sessionId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const processAssessmentCompletion = async (assessmentData: PatientAssessmentData) => {
    console.log("=== ASSESSMENT COMPLETION HOOK CALLED ===");
    console.log("Session ID:", sessionId);
    console.log("Assessment data:", assessmentData);
    console.log("About to save to localStorage");
    
    console.log("🎯 Assessment completed, processing data:", { sessionId, assessmentData });
    
    try {
      const { result, normalizedData, determinedPath } = await processAssessmentData(assessmentData, sessionId!);
      
      console.log("📊 Assessment processed:", { result, determinedPath });
      
      // Save assessment to localStorage
      const assessment = {
        id: sessionId!,
        patientName: assessmentData.patientRef || "Anonymous Patient",
        dateOfBirth: assessmentData.dateOfBirth || "",
        completedAt: new Date().toISOString(),
        riskLevel: result.riskLevel.toLowerCase(),
        urgentFlags: result.urgentFlags || [],
        status: "completed"
      };

      console.log("=== SAVING ASSESSMENT ===");
      console.log("Current assessments:", localStorage.getItem('assessments'));
      console.log("New assessment to save:", assessment);

      // Get existing assessments and add new one
      const existingAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
      console.log("Existing assessments parsed:", existingAssessments);
      
      existingAssessments.push(assessment);
      localStorage.setItem('assessments', JSON.stringify(existingAssessments));
      
      console.log("💾 Assessment saved to localStorage:", assessment);
      console.log("Final assessments array:", JSON.parse(localStorage.getItem('assessments') || '[]'));

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
      console.error("❌ Error processing assessment:", error);
      toast({
        title: "Error", 
        description: "Failed to process assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { processAssessmentCompletion };
};
