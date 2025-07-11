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
      return decodeURIComponent(encodedRef);
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
      console.log("🔍 Current URL:", window.location.href);
      const urlParams = new URLSearchParams(window.location.search);
      console.log("🔍 URL search params:", window.location.search);
      const encodedPatientRef = urlParams.get('patientRef');
      console.log("🔍 Encoded patientRef from URL:", encodedPatientRef);
      let patientRef = null;
      
      if (encodedPatientRef) {
        patientRef = decodePatientRef(encodedPatientRef);
        console.log("📋 Retrieved patient reference from URL:", patientRef);
      } else {
        console.log("⚠️ No patientRef found in URL parameters");
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
      const assessmentLink = dataStore.findAssessmentLinkBySession(sessionId);
      console.log("Found assessment link:", assessmentLink);

      // Generate patient reference from assessment link if available
      let finalPatientRef = patientRef;
      if (!finalPatientRef && assessmentLink) {
        console.log("Using assessment link data for patient name:", {
          firstName: assessmentLink.firstName,
          surname: assessmentLink.surname
        });
        if (assessmentLink.firstName && assessmentLink.surname) {
          finalPatientRef = `${assessmentLink.firstName} ${assessmentLink.surname}`;
        } else if (assessmentLink.firstName) {
          finalPatientRef = assessmentLink.firstName;
        }
      }
      console.log("Final patient reference will be:", finalPatientRef);

      // Save to completed_assessments
      const completedAssessmentData = {
        sessionId,
        patientRef: finalPatientRef || "Anonymous Patient",
        completedAt: new Date().toISOString(),
        riskLevel: result.riskLevel.toLowerCase(),
        urgentFlags: result.urgentFlags || [],
        rawData: result
      };
      // Save to completed_assessments - multiple keys for dashboard compatibility
      const keys = ['completed_assessments', 'all_assessments', 'gp_assessments', 'sylvia_completed_assessments'];

      keys.forEach(key => {
        try {
          const existingAssessments = JSON.parse(localStorage.getItem(key) || '[]');
          existingAssessments.push(completedAssessmentData);
          localStorage.setItem(key, JSON.stringify(existingAssessments));
          console.log(`✅ Assessment saved to ${key}`);
        } catch (error) {
          console.error(`❌ Failed to save to ${key}:`, error);
        }
      });

      // Also ensure the assessment appears in the GP's personal list
      if (assessmentLink) {
        try {
          const userEmail = assessmentLink.createdBy;
          const userCompletedKey = `${userEmail}_completed_assessments`;
          const userCompleted = JSON.parse(localStorage.getItem(userCompletedKey) || '[]');
          userCompleted.push(completedAssessmentData);
          localStorage.setItem(userCompletedKey, JSON.stringify(userCompleted));
          console.log(`✅ Also saved to ${userEmail} personal completed list`);
        } catch (error) {
          console.error('Failed to save to user-specific list:', error);
        }
      }
      // ALSO store individual assessment for GP results page (keep this for results page compatibility)
      localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(result));
      console.log("💾 Individual assessment also stored for GP results");

      // Update the original assessment link status to "completed"
      console.log("🔄 Updating assessment link status to completed");
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
      console.log("🛤️ Determined care pathway:", determinedPath);
      console.log("🎯 Risk level for routing:", result.riskLevel);
      
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
        
        console.log("🔄 Navigating to patient results page:", `/patient-results/${sessionId}`);
        // Small delay to ensure data is saved before navigation
        setTimeout(() => {
          navigate(`/patient-results/${sessionId}`);
        }, 500);
      }
      
      // Clean up temporary patient reference storage (now that assessment is complete)
      localStorage.removeItem(`patient_ref_${sessionId}`);
      console.log("🧹 Cleaned up temporary patient reference storage");
      
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
