
import { 
  calculateRiskLevel, 
  generateClinicalSummary, 
  generateNHSRecommendations, 
  determineCarePath, 
  generatePatientGuidance,
  getUrgentFlags 
} from "@/components/ConditionalQuestionLogic";
import { EmailService } from "@/services/EmailService";

interface AssessmentData {
  patientRef?: string;
  age?: string;
  menstrualStatus?: string;
  periodsStopped?: string;
  postmenopausalBleeding?: string;
  unexplainedWeightLoss?: string;
  severePelvicPain?: string;
  hotFlashFrequency?: string;
  nightSweats?: string;
  physicalSymptoms?: string[];
  moodSymptoms?: string;
  libidoChanges?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  exerciseLevel?: string;
  bmi?: string;
  treatmentPreferences?: string[];
  personalMedicalHistory?: string[];
  familyHistory?: string[];
  height?: string;
  weight?: string;
  sleepQuality?: string;
  vaginalSymptoms?: string;
  cognitiveSymptoms?: string;
  [key: string]: any;
}

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

export const processAssessmentData = async (assessmentData: AssessmentData, sessionId: string) => {
  // Get the patient reference that was stored when the assessment was created
  const storedPatientRef = localStorage.getItem(`patient_ref_${sessionId}`);
  
  // Normalize data
  const normalizedData = {
    ...assessmentData,
    physicalSymptoms: Array.isArray(assessmentData.physicalSymptoms) 
      ? assessmentData.physicalSymptoms 
      : assessmentData.physicalSymptoms 
        ? [assessmentData.physicalSymptoms] 
        : [],
    bmi: calculateBMI(assessmentData.height, assessmentData.weight)?.toFixed(1)
  };

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
    `Patient (DOB: ${normalizedData.dateOfBirth || getDOBFromAge(normalizedData.age)})`;
  
  const result = {
    sessionId: sessionId,
    patientRef: patientReference,
    dateOfBirth: normalizedData.dateOfBirth || getDOBFromAge(normalizedData.age),
    completedAt: new Date().toISOString(),
    riskLevel,
    urgentFlags,
    clinicalSummary,
    recommendations,
    rawData: normalizedData,
    carePath: determinedPath
  };

  // Store result for GP access
  localStorage.setItem(`assessment_${sessionId}`, JSON.stringify(result));
  
  // Clean up the patient reference storage (no longer needed)
  localStorage.removeItem(`patient_ref_${sessionId}`);
  
  // Send email to GP (only for cases requiring GP attention)
  if (determinedPath === 'gp-urgent' || determinedPath === 'gp-routine') {
    const gpEmail = "gp@example.com";
    await EmailService.sendAssessmentResults(gpEmail, result);
  }

  return { result, normalizedData, determinedPath };
};
