
// Enhanced TypeScript definitions for NHS-compliant clinical data
export interface PatientAssessmentData {
  // Core Demographics
  patientRef?: string;
  age: string;
  occupation?: string;
  
  // Clinical History
  menstrualStatus: 'regular' | 'irregular' | 'stopped' | 'unknown';
  periodsStopped?: string;
  
  // Red Flag Symptoms (NICE NG23)
  postmenopausalBleeding: 'yes' | 'no' | 'unsure';
  unexplainedWeightLoss: 'yes' | 'no' | 'unsure';
  severePelvicPain: 'yes' | 'no' | 'unsure';
  
  // Vasomotor Symptoms
  hotFlashFrequency: 'none' | 'mild' | 'moderate' | 'severe';
  nightSweats: 'none' | 'mild' | 'moderate' | 'severe';
  vasomotorImpact?: string;
  
  // Physical Symptoms
  physicalSymptoms: string[];
  
  // Psychological Assessment
  moodSymptoms: 'none' | 'mild' | 'moderate' | 'severe';
  cognitiveSymptoms: 'none' | 'mild' | 'moderate' | 'severe';
  moodImpact?: string;
  
  // Quality of Life
  sleepQuality: 'good' | 'fair' | 'poor' | 'very-poor';
  libidoChanges: 'none' | 'decreased' | 'increased';
  vaginalSymptoms: 'none' | 'mild' | 'moderate' | 'severe';
  
  // Medical History
  personalMedicalHistory: string[];
  familyHistory: string[];
  
  // Lifestyle Factors
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | '1-7' | '8-14' | '15-21' | '22+';
  exerciseLevel: 'none' | 'light' | 'moderate' | 'vigorous';
  
  // Anthropometric Data
  height?: string;
  weight?: string;
  bmi?: string;
  
  // Treatment Preferences
  treatmentPreferences: string[];
  
  // Additional Information
  primaryConcern?: string;
  additionalInfo?: string;
  
  // Consent and Metadata
  consentData?: ConsentData;
  completedAt?: string;
  sessionId?: string;
}

export interface ConsentData {
  dataProcessing: boolean;
  clinicalAssessment: boolean;
  dataSharing: boolean;
  communicationPreferences: boolean;
  timestamp: string;
}

export interface ClinicalRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'urgent';
  riskScore: number;
  urgentFlags: string[];
  riskFactors: string[];
  clinicalEvidence: string[];
}

export interface TreatmentRecommendation {
  treatment: string;
  suitability: number; // 0-100
  evidence: string;
  contraindications: string[];
  monitoring: string[];
}

export interface ClinicalSummary {
  patientId: string;
  assessmentDate: string;
  riskAssessment: ClinicalRiskAssessment;
  symptoms: {
    vasomotor: { severity: string; impact: string };
    psychological: { severity: string; impact: string };
    physical: string[];
  };
  recommendations: TreatmentRecommendation[];
  followUp: string;
  clinicalNotes: string[];
}

// Validation schemas
export const VALID_SYMPTOM_SEVERITIES = ['none', 'mild', 'moderate', 'severe'] as const;
export const VALID_YES_NO_UNSURE = ['yes', 'no', 'unsure'] as const;
export const VALID_MENSTRUAL_STATUS = ['regular', 'irregular', 'stopped', 'unknown'] as const;

// Clinical constants based on NICE guidelines
export const CLINICAL_THRESHOLDS = {
  BMI_UNDERWEIGHT: 18.5,
  BMI_OVERWEIGHT: 25,
  BMI_OBESE: 30,
  AGE_EARLY_MENOPAUSE: 45,
  AGE_PERIMENOPAUSE: 40,
  HIGH_RISK_SCORE: 25,
  URGENT_RISK_SCORE: 40
} as const;
