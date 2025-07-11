import { PatientAssessmentData } from './clinicalTypes';

// Assessment Step Component Props
export interface AssessmentStepProps {
  data: PatientAssessmentData;
  onUpdate: (key: keyof PatientAssessmentData, value: any) => void;
}

// Form Component Props
export interface AssessmentFormProps {
  data: PatientAssessmentData;
  onDataChange: (data: PatientAssessmentData) => void;
}

// Update callback type for specific value updates
export type AssessmentUpdateCallback = (key: keyof PatientAssessmentData, value: any) => void;

// For array updates (like symptoms, medical history)
export type AssessmentArrayUpdateCallback = (key: keyof PatientAssessmentData, values: string[]) => void;

// Clinical function parameter types
export interface ClinicalFunctionProps {
  data: PatientAssessmentData;
}

// Assessment result types
export interface AssessmentResult {
  clinicalSummary: {
    riskLevel: 'low' | 'medium' | 'high' | 'urgent';
    carePath: 'self-care' | 'education' | 'gp-routine' | 'gp-urgent';
    urgentFlags: string[];
    recommendations: string[];
  };
  patientData: PatientAssessmentData;
  timestamp: string;
  sessionId: string;
}