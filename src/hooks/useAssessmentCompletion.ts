import { useNavigate } from "react-router-dom";
import { processAssessmentData } from "@/utils/assessmentProcessor";
import { generatePatientGuidance } from "@/components/ConditionalQuestionLogic";
import { useToast } from "@/hooks/use-toast";
import { dataStore } from "@/utils/dataStore";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export const useAssessmentCompletion = (sessionId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Decode patient reference from URL parameter
  const decodePatientRef = (encodedRef: string) => {
    try {
      return decodeURIComponent(atob(encodedRef));
    } catch (error) {
      console.warn("Failed to decode patient reference:", error);
      return null;
    }
  };

  const processAssessmentCompletion = async (assessmentData: PatientAssessmentData) => {
    console.log("=== ASSESSMENT COMPLETION HOOK CALLED ===");
    console.log("Session ID:", sessionId);
    console.log("Assessment data:", assessmentData);
    
    if (!sessionId) {
      console.error("No sessionId provided to completion hook");
      return;
    }
    
    console.log("🎯 Assessment completed, processing data:", { sessionId, assessmentData });
    
    try {
      const { result, normalizedData, determinedPath } = await processAssessmentData(assessmentData, sessionId);
      
      console.log("📊 Assessment processed:", { result, determinedPath });
      
      // Get patient reference from multiple sources (URL parameter first, then localStorage backup)
      const urlParams = new URLSearchParams(window.location.search);
      const encodedPatientRef = urlParams.get('patientRef');
      let patientRef = null;
      
      if (encodedPatientRef) {
        patientRef = decodePatientRef(encodedPatientRef);
        console.log("📋 Retrieved patient reference from URL:", patientRef);
      }
      
      // Fallback to localStorage if URL method fails
      if (!patientRef) {
        patientRef = localStorage.getItem(`patient_ref_${sessionId}`);
        console.log("📋 Retrieved patient reference from localStorage:", patientRef);
      }
      
      // Final fallback to assessment data
      if (!patientRef) {
        patientRef = assessmentData.patientRef;
        console.log("📋 Using patient reference from assessment data:", patientRef);
      }

      console.log("=== SAVING COMPLETED ASSESSMENT ===");
      console.log("SessionId:", sessionId);
      console.log("Final patient reference:", patientRef);

      // Save to completed_assessments
      const completedAssessmentData = {
        sessionId,
        patientRef: patientRef || "Anonymous Patient",
        completedAt: new Date().toISOString(),
        riskLevel: result.riskLevel.toLowerCase(),
        urgentFlags: result.urgentFlags || [],
        rawData: result
      };
      // Save to completed_assessments
      const assessments = JSON.parse(localStorage.getItem('completed_assessments') || '[]');      
      assessments.push(completedAssessmentData);
      localStorage.setItem('completed_assessments', JSON.stringify(assessments));
      console.log("✅ Assessment saved to completed_assessments");

      // ALSO store individual assessment for GP results page (keep this for results page compatibility)
      localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(result));
      console.log("💾 Individual assessment also stored for GP results");

      // Update the original assessment link status to "completed"
      console.log("🔄 Updating assessment link status to completed");
      const assessmentLink = dataStore.findAssessmentLinkBySession(sessionId);
      if (assessmentLink) {
        const userEmail = assessmentLink.createdBy;
        const assessmentLinks = dataStore.getAssessmentLinks(userEmail);
        const updatedLinks = assessmentLinks.map(link => 
          link.sessionId === sessionId 
            ? { ...link, status: 'completed' as const }
            : link
        );
        
        // Save updated links back to localStorage
        const userKey = `${userEmail}_assessments`;
        localStorage.setItem(userKey, JSON.stringify(updatedLinks));
        console.log("✅ Assessment link status updated to completed");
      } else {
        console.log("⚠️ No assessment link found for sessionId:", sessionId);
      }

      // Route based on care pathway
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
