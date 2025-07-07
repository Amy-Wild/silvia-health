
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export interface AssessmentResult {
  sessionId: string;
  patientRef: string;
  dateOfBirth: string;
  completedAt: string;
  riskLevel: string;
  urgentFlags: string[];
  clinicalSummary: any;
  recommendations: string[];
  rawData: PatientAssessmentData;
  carePath: string;
}

export const saveAssessment = async (sessionId: string, assessmentData: PatientAssessmentData, result: AssessmentResult): Promise<void> => {
  console.log("💾 Saving assessment to localStorage:", { sessionId, assessmentData, result });
  
  try {
    // Save to localStorage instead of Supabase
    localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(result));
    
    // Also save a list of all assessments for the dashboard
    const existingAssessments = JSON.parse(localStorage.getItem('all_assessments') || '[]');
    const assessmentSummary = {
      sessionId,
      patientRef: result.patientRef,
      completedAt: result.completedAt,
      riskLevel: result.riskLevel
    };
    
    // Add or update the assessment
    const existingIndex = existingAssessments.findIndex((a: any) => a.sessionId === sessionId);
    if (existingIndex >= 0) {
      existingAssessments[existingIndex] = assessmentSummary;
    } else {
      existingAssessments.push(assessmentSummary);
    }
    
    localStorage.setItem('all_assessments', JSON.stringify(existingAssessments));
    
    console.log("✅ Assessment saved successfully to localStorage");
  } catch (error) {
    console.error("❌ Error saving assessment to localStorage:", error);
    throw error;
  }
};

export const getAssessment = async (sessionId: string): Promise<AssessmentResult | null> => {
  console.log("📖 Loading assessment from localStorage:", sessionId);
  
  try {
    const stored = localStorage.getItem(`assessment_${sessionId}`);
    if (stored) {
      const result = JSON.parse(stored);
      console.log("✅ Assessment loaded from localStorage:", result);
      return result;
    }
    
    console.log("ℹ️ No assessment found in localStorage for sessionId:", sessionId);
    return null;
  } catch (error) {
    console.error("❌ Error loading assessment from localStorage:", error);
    return null;
  }
};

export const getAllAssessments = async (): Promise<any[]> => {
  console.log("📋 Loading all assessments from localStorage");
  
  try {
    const stored = localStorage.getItem('all_assessments');
    const assessments = stored ? JSON.parse(stored) : [];
    console.log("✅ All assessments loaded from localStorage:", assessments);
    return assessments;
  } catch (error) {
    console.error("❌ Error loading assessments from localStorage:", error);
    return [];
  }
};
