
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
  dateOfBirth?: string;
  occupation?: string;
  primaryConcern?: string;
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

export const calculateAgeFromDOB = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const formatDateOfBirth = (dateOfBirth?: string): string => {
  if (!dateOfBirth) return "Not provided";
  const date = new Date(dateOfBirth);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export const assessAgeRelatedRisks = (age: number): string[] => {
  const risks: string[] = [];
  
  // NICE NG23 age-related risk factors
  if (age < 40) {
    risks.push("Early menopause consideration - specialist referral may be needed");
  }
  
  if (age >= 45 && age < 55) {
    risks.push("Typical perimenopause age range - monitor symptoms");
  }
  
  if (age >= 55) {
    risks.push("Post-menopausal - any bleeding requires urgent investigation");
  }
  
  if (age >= 60) {
    risks.push("Increased cardiovascular and osteoporosis risk - preventive measures important");
  }
  
  return risks;
};

export const processAssessmentData = async (assessmentData: AssessmentData, sessionId: string) => {
  // Get the patient reference that was stored when the assessment was created
  const storedPatientRef = localStorage.getItem(`patient_ref_${sessionId}`);
  
  // Calculate age from date of birth
  const calculatedAge = calculateAgeFromDOB(assessmentData.dateOfBirth);
  const ageRelatedRisks = calculatedAge ? assessAgeRelatedRisks(calculatedAge) : [];
  
  // Normalize data
  const normalizedData = {
    ...assessmentData,
    age: calculatedAge?.toString() || "Unknown",
    ageRelatedRisks,
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
  
  // Use stored patient reference or fallback to DOB-based reference
  const patientReference = storedPatientRef || 
    normalizedData.patientRef || 
    `Patient (DOB: ${formatDateOfBirth(assessmentData.dateOfBirth)})`;
  
  const result = {
    sessionId: sessionId,
    patientRef: patientReference,
    dateOfBirth: formatDateOfBirth(assessmentData.dateOfBirth),
    age: calculatedAge,
    ageRelatedRisks,
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
