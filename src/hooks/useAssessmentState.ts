
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

  const totalSteps = 8;
  const steps = [
    "About You",
    "Your Periods & Health", 
    "Hot Flashes & Night Sweats",
    "Physical Symptoms",
    "Mental Health & Wellbeing",
    "Sleep & Intimacy",
    "Medical History & Lifestyle",
    "Complete Assessment"
  ];

  // Calculate risk level in real-time as data changes
  useEffect(() => {
    console.log("=== RISK CALCULATION EFFECT ===");
    console.log("Assessment data for risk calculation:", assessmentData);
    console.log("Key red flag values:", {
      postmenopausalBleeding: assessmentData.postmenopausalBleeding,
      unexplainedWeightLoss: assessmentData.unexplainedWeightLoss,
      severePelvicPain: assessmentData.severePelvicPain,
      moodSymptoms: assessmentData.moodSymptoms,
      selfHarmRisk: assessmentData.selfHarmRisk
    });
    
    const currentRisk = calculateRiskLevel(assessmentData);
    console.log("=== CALCULATED RISK LEVEL ===");
    console.log("Risk level result:", currentRisk);
    console.log("Setting risk level to:", currentRisk);
    setRiskLevel(currentRisk);
  }, [assessmentData]);

  const handleDataChange = (data: PatientAssessmentData) => {
    console.log("=== DATA CHANGE IN STATE HOOK ===");
    console.log("Previous data:", assessmentData);
    console.log("New data received:", data);
    console.log("Red flag changes:", {
      oldPostmenopausalBleeding: assessmentData.postmenopausalBleeding,
      newPostmenopausalBleeding: data.postmenopausalBleeding,
      oldUnexplainedWeightLoss: assessmentData.unexplainedWeightLoss,
      newUnexplainedWeightLoss: data.unexplainedWeightLoss,
      oldSeverePelvicPain: assessmentData.severePelvicPain,
      newSeverePelvicPain: data.severePelvicPain
    });
    
    setAssessmentData(data);
    setIsValid(true);
  };

  const getRiskBadge = () => {
    console.log("=== GET RISK BADGE ===");
    console.log("Current risk level for badge:", riskLevel);
    
    const urgentFlags = getUrgentFlags(assessmentData);
    console.log("Urgent flags for badge:", urgentFlags);
    
    // NICE NG23 compliant risk mapping
    if (urgentFlags.length > 0) {
      console.log("Badge: Urgent Review (urgent flags present)");
      return { className: "bg-red-500 text-white", text: "Urgent Review Recommended" };
    }
    
    // Map internal risk levels to NICE-compliant display
    switch (riskLevel) {
      case "red":
        console.log("Badge: Urgent Care (red risk level)");
        return { className: "bg-red-500 text-white", text: "Urgent Care Needed" };
      case "urgent":
        console.log("Badge: Urgent Care (urgent risk level)");
        return { className: "bg-red-500 text-white", text: "Urgent Care Needed" };
      case "amber":
        console.log("Badge: High Priority (amber risk level)");
        return { className: "bg-orange-500 text-white", text: "High Priority" };
      case "high":
        console.log("Badge: High Priority (high risk level)");
        return { className: "bg-orange-500 text-white", text: "High Priority" };
      case "medium":
        console.log("Badge: Routine Care (medium risk level)");
        return { className: "bg-yellow-500 text-white", text: "Routine Care" };
      case "green":
        console.log("Badge: Low Risk (green risk level)");
        return { className: "bg-green-500 text-white", text: "Low Risk" };
      case "low":
      default:
        console.log("Badge: Low Risk (default/low risk level)");
        return { className: "bg-green-500 text-white", text: "Low Risk" };
    }
  };

  const showUrgentWarning = () => {
    const urgentFlags = getUrgentFlags(assessmentData);
    console.log("=== SHOW URGENT WARNING CHECK ===");
    console.log("Urgent flags count:", urgentFlags.length);
    console.log("Should show warning:", urgentFlags.length > 0);
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
