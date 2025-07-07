import { useState, useEffect } from "react";
import { calculateRiskLevel, getUrgentFlags } from "@/components/ConditionalQuestionLogic";
import type { PatientAssessmentData } from "@/types/clinicalTypes";

export const useAssessmentState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState<PatientAssessmentData>({
    age: "",
    dateOfBirth: "",
    occupation: "",
    primaryConcern: "",
    menstrualStatus: "unknown",
    periodsStopped: "",
    postmenopausalBleeding: "unsure",
    lastPeriodDate: "",
    menopauseType: "",
    cycleChanges: [],
    periodChanges: "",
    unexplainedWeightLoss: "unsure",
    severePelvicPain: "unsure",
    utiHistory: "",
    hotFlashFrequency: "none",
    nightSweats: "none",
    physicalSymptoms: [],
    moodSymptoms: "none",
    cognitiveSymptoms: "none",
    sleepQuality: "good",
    libidoChanges: "none",
    vaginalSymptoms: "none",
    personalMedicalHistory: [],
    familyHistory: [],
    smokingStatus: "never",
    alcoholConsumption: "none",
    exerciseLevel: "none",
    treatmentPreferences: []
  });
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskLevel, setRiskLevel] = useState("low");

  const totalSteps = 7;
  const steps = [
    "About You",
    "Your Periods & Health", 
    "Hot Flashes & Night Sweats",
    "Physical Symptoms",
    "Mental Health & Wellbeing",
    "Sleep & Intimacy",
    "Medical History & Lifestyle"
  ];

  // Calculate risk level in real-time as data changes
  useEffect(() => {
    const currentRisk = calculateRiskLevel(assessmentData);
    setRiskLevel(currentRisk);
  }, [assessmentData]);

  const handleDataChange = (data: PatientAssessmentData) => {
    setAssessmentData(data);
    // Remove validation to prevent blocking navigation
    setIsValid(true);
  };

  const getRiskBadge = () => {
    const urgentFlags = getUrgentFlags(assessmentData);
    
    if (urgentFlags.length > 0) {
      return { className: "bg-red-500 text-white", text: "Urgent Review Recommended" };
    }
    
    switch (riskLevel) {
      case "urgent":
        return { className: "bg-red-500 text-white", text: "Urgent Care Needed" };
      case "high":
        return { className: "bg-orange-500 text-white", text: "High Priority" };
      case "medium":
        return { className: "bg-yellow-500 text-white", text: "Routine Care" };
      default:
        return { className: "bg-green-500 text-white", text: "Low Risk" };
    }
  };

  const showUrgentWarning = () => {
    const urgentFlags = getUrgentFlags(assessmentData);
    return urgentFlags.length > 0;
  };

  return {
    currentStep,
    setCurrentStep,
    assessmentData,
    setAssessmentData,
    isValid,
    setIsValid,
    isSubmitting,
    setIsSubmitting,
    riskLevel,
    totalSteps,
    steps,
    handleDataChange,
    getRiskBadge,
    showUrgentWarning
  };
};
