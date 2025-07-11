
import { 
  calculateRiskLevel, 
  generateClinicalSummary, 
  generateNHSRecommendations, 
  determineCarePath, 
  generatePatientGuidance,
  getUrgentFlags 
} from "@/components/ConditionalQuestionLogic";
import { EmailService } from "@/services/EmailService";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

// Using PatientAssessmentData from clinical types instead of duplicate interface

export const calculateBMI = (height?: string, weight?: string): number | null => {
  if (!height || !weight) return null;
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  if (h > 0 && w > 0) {
    return w / (h * h);
  }
  return null;
};

export const getDOBFromAge = (age?: string): string => {
  if (!age) return "Not provided";
  const currentDate = new Date();
  const birthYear = currentDate.getFullYear() - parseInt(age);
  return `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${birthYear}`;
};

// Helper function to ensure enum values are valid
const normalizeEnumValue = <T extends string>(value: string | undefined, validValues: readonly T[], defaultValue: T): T => {
  if (!value) return defaultValue;
  return validValues.includes(value as T) ? (value as T) : defaultValue;
};

export const processAssessmentData = async (assessmentData: AssessmentData, sessionId: string) => {
  console.log("🔧 Processing assessment data:", { sessionId, assessmentData });
  
  // Get the patient reference that was stored when the assessment was created
  const storedPatientRef = localStorage.getItem(`patient_ref_${sessionId}`);
  
  // Calculate dateOfBirth from age if not provided
  const dateOfBirth = assessmentData.dateOfBirth || getDOBFromAge(assessmentData.age);
  
  // Ensure age is always present - if not provided, calculate from dateOfBirth or use default
  const age = assessmentData.age || "50"; // Default age if not provided
  
  // Normalize data with required fields for PatientAssessmentData and proper enum types
  const normalizedData: PatientAssessmentData = {
    ...assessmentData,
    age: age,
    dateOfBirth: dateOfBirth,
    menstrualStatus: normalizeEnumValue(assessmentData.menstrualStatus, ['regular', 'irregular', 'stopped', 'unknown'] as const, 'unknown'),
    postmenopausalBleeding: normalizeEnumValue(assessmentData.postmenopausalBleeding, ['yes', 'no', 'unsure'] as const, 'no'),
    unexplainedWeightLoss: normalizeEnumValue(assessmentData.unexplainedWeightLoss, ['yes', 'no', 'unsure'] as const, 'no'),
    severePelvicPain: normalizeEnumValue(assessmentData.severePelvicPain, ['yes', 'no', 'unsure'] as const, 'no'),
    hotFlashFrequency: normalizeEnumValue(assessmentData.hotFlashFrequency, ['none', 'mild', 'moderate', 'severe'] as const, 'none'),
    nightSweats: normalizeEnumValue(assessmentData.nightSweats, ['none', 'mild', 'moderate', 'severe'] as const, 'none'),
    moodSymptoms: normalizeEnumValue(assessmentData.moodSymptoms, ['none', 'mild', 'moderate', 'severe'] as const, 'none'),
    cognitiveSymptoms: normalizeEnumValue(assessmentData.cognitiveSymptoms, ['none', 'mild', 'moderate', 'severe'] as const, 'none'),
    sleepQuality: normalizeEnumValue(assessmentData.sleepQuality, ['good', 'fair', 'poor', 'very-poor'] as const, 'good'),
    libidoChanges: normalizeEnumValue(assessmentData.libidoChanges, ['none', 'decreased', 'increased'] as const, 'none'),
    vaginalSymptoms: normalizeEnumValue(assessmentData.vaginalSymptoms, ['none', 'mild', 'moderate', 'severe'] as const, 'none'),
    smokingStatus: normalizeEnumValue(assessmentData.smokingStatus, ['never', 'former', 'current'] as const, 'never'),
    alcoholConsumption: normalizeEnumValue(assessmentData.alcoholConsumption, ['none', '1-7', '8-14', '15-21', '22+'] as const, 'none'),
    exerciseLevel: normalizeEnumValue(assessmentData.exerciseLevel, ['none', 'light', 'moderate', 'vigorous'] as const, 'none'),
    physicalSymptoms: Array.isArray(assessmentData.physicalSymptoms) 
      ? assessmentData.physicalSymptoms 
      : assessmentData.physicalSymptoms 
        ? [assessmentData.physicalSymptoms] 
        : [],
    treatmentPreferences: Array.isArray(assessmentData.treatmentPreferences)
      ? assessmentData.treatmentPreferences
      : assessmentData.treatmentPreferences
        ? [assessmentData.treatmentPreferences]
        : [],
    personalMedicalHistory: Array.isArray(assessmentData.personalMedicalHistory)
      ? assessmentData.personalMedicalHistory
      : assessmentData.personalMedicalHistory
        ? [assessmentData.personalMedicalHistory]
        : [],
    familyHistory: Array.isArray(assessmentData.familyHistory)
      ? assessmentData.familyHistory
      : assessmentData.familyHistory
        ? [assessmentData.familyHistory]
        : [],
    bmi: calculateBMI(assessmentData.height, assessmentData.weight)?.toFixed(1)
  };

  console.log("📊 Normalized data with proper types:", normalizedData);

  // Determine care pathway
  const determinedPath = determineCarePath(normalizedData);

  // Generate clinical results for GP
  const riskLevel = calculateRiskLevel(normalizedData);
  const clinicalSummary = generateClinicalSummary(normalizedData);
  const recommendations = generateNHSRecommendations(normalizedData, riskLevel);
  const urgentFlags = getUrgentFlags(normalizedData);
  
  // Use stored patient reference or fallback to age-based reference
  const patientReference = storedPatientRef || 
    normalizedData.patientRef || 
    `Patient (DOB: ${dateOfBirth})`;
  
  const result = {
    sessionId: sessionId,
    patientRef: patientReference,
    dateOfBirth: dateOfBirth,
    completedAt: new Date().toISOString(),
    riskLevel,
    urgentFlags,
    clinicalSummary,
    recommendations,
    rawData: normalizedData,
    carePath: determinedPath
  };

  console.log("✅ Assessment result generated:", result);

  // Store result for GP access
  localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(result));
  
  // Note: Keep patient_ref_${sessionId} for completion hook - it will be cleaned up later
  
  console.log("💾 Assessment stored in localStorage");
  
  // Send email to GP (only for cases requiring GP attention)
  if (determinedPath === 'gp-urgent' || determinedPath === 'gp-routine') {
    const gpEmail = "gp@example.com";
    await EmailService.sendAssessmentResults(gpEmail, result);
  }

  return { result, normalizedData, determinedPath };
};
