
import { useNavigate } from "react-router-dom";
import { processAssessmentData } from "@/utils/assessmentProcessor";
import { generatePatientGuidance } from "@/components/ConditionalQuestionLogic";
import { useToast } from "@/hooks/use-toast";
import { storeAssessment } from "@/utils/assessmentStorage";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export const useAssessmentCompletion = (sessionId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const processAssessmentCompletion = async (assessmentData: PatientAssessmentData) => {
    try {
      console.log("🔄 Processing assessment completion for sessionId:", sessionId, "data:", assessmentData);
      
      const { result, normalizedData, determinedPath } = await processAssessmentData(assessmentData, sessionId!);
      
      console.log("✅ Assessment processed, determined path:", determinedPath);
      console.log("📊 Normalized data:", normalizedData);

      // Create assessment object for storage
      const assessmentToStore = {
        id: sessionId!,
        session_id: sessionId!,
        patient_ref: normalizedData.patientInfo?.name || 'Unknown Patient',
        date_of_birth: normalizedData.patientInfo?.dateOfBirth,
        age: normalizedData.patientInfo?.age,
        completed_at: new Date().toISOString(),
        risk_level: result.riskLevel || 'unknown',
        urgent_flags: result.urgentFlags || [],
        clinical_summary: result.clinicalSummary || {},
        recommendations: result.recommendations || {},
        raw_data: assessmentData,
        care_path: determinedPath
      };

      console.log("💾 Assessment completed, saving to storage:", sessionId, assessmentToStore);
      
      // Save the assessment
      const saveResult = await storeAssessment(assessmentToStore);
      console.log("✅ Save result:", saveResult);

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
