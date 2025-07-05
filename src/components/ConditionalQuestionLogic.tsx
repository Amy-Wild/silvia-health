
import { calculateBMI } from "@/utils/assessmentProcessor";

// Function to determine the appropriate care path based on assessment data
export const determineCarePath = (data: any): 'self-care' | 'education' | 'gp-routine' | 'gp-urgent' => {
  // Check for urgent flags first
  if (getUrgentFlags(data).length > 0) {
    return 'gp-urgent';
  }

  // Check for high-risk factors or specific preferences that require GP attention
  if (calculateRiskLevel(data) === 'red' || calculateRiskLevel(data) === 'urgent' || data.treatmentPreferences?.includes('hrt')) {
    return 'gp-routine';
  }

  // If the patient has indicated a preference for lifestyle interventions or has moderate risk factors, suggest education
  if (data.treatmentPreferences?.includes('lifestyle') || calculateRiskLevel(data) === 'amber') {
    return 'education';
  }

  // Default to self-care for low-risk cases
  return 'self-care';
};

// Function to generate a clinical summary based on assessment data
export const generateClinicalSummary = (data: any) => {
  // Vasomotor Symptoms
  const vasomotor = {
    severity: data.hotFlashFrequency || 'None',
    impact: data.vasomotorImpact || 'No significant impact'
  };

  // Psychological Symptoms
  const psychological = {
    severity: data.moodSymptoms || 'None',
    additionalNotes: data.mentalWellbeing || 'No concerns raised'
  };

  // Medical History - only include actual selections
  const personalHistory = data.personalMedicalHistory || [];
  const familyHistory = data.familyHistory || [];
  
  const medicalHistory = {
    riskLevel: personalHistory.length > 0 ? 'Medium' : 'Low',
    personal: personalHistory.map((condition: string) => {
      // Map condition codes to readable names
      const conditionMap: { [key: string]: string } = {
        'breast-cancer': 'Breast cancer',
        'blood-clots': 'Blood clots/VTE',
        'liver-disease': 'Liver disease',
        'heart-disease': 'Heart disease',
        'stroke': 'Stroke',
        'diabetes': 'Diabetes',
        'high-blood-pressure': 'High blood pressure',
        'migraines': 'Migraines',
        'depression': 'Depression',
        'osteoporosis': 'Osteoporosis',
        'recurrent-utis': 'Recurrent UTIs'
      };
      return conditionMap[condition] || condition;
    }),
    family: familyHistory.map((condition: string) => {
      const conditionMap: { [key: string]: string } = {
        'breast-cancer': 'Breast cancer',
        'heart-disease': 'Heart disease',
        'osteoporosis': 'Osteoporosis',
        'stroke': 'Stroke',
        'diabetes': 'Diabetes'
      };
      return conditionMap[condition] || condition;
    }),
    clinicalNotes: personalHistory.length === 0 && familyHistory.length === 0 
      ? 'No significant medical history recorded - standard contraindication screening completed' 
      : `Medical history noted: ${personalHistory.length} personal, ${familyHistory.length} family conditions`
  };

  // Treatment Preferences
  const treatmentPreferences = {
    selected: data.treatmentPreferences || [],
    educationNeeded: data.treatmentPreferences?.includes('hrt'),
    clinicalNotes: data.treatmentPreferences?.includes('hrt') ? 'Patient interested in HRT education' : 'No specific treatment preferences indicated'
  };

  // Lifestyle Factors
  const lifestyle = {
    smoking: data.smokingStatus || 'never',
    exercise: data.exerciseLevel || 'moderate',
    alcohol: data.alcoholConsumption || '1-7',
    bmi: data.bmi || calculateBMI(data.height, data.weight)?.toFixed(1) || 'Not calculated',
    height: data.height || 'Not recorded',
    weight: data.weight || 'Not recorded',
    riskLevel: 'Low', // This can be expanded based on specific criteria
    clinicalNotes: 'Good lifestyle profile' // This can be expanded based on specific criteria
  };

  const patientComments = data.patientComments || '';

  return {
    vasomotor,
    psychological,
    medicalHistory,
    treatmentPreferences,
    lifestyle,
    patientComments,
    overallComplexity: 'Low - Routine GP management appropriate' // Can be expanded based on complexity scoring
  };
};

// Function to generate NHS recommendations based on assessment data and risk level
export const generateNHSRecommendations = (data: any, riskLevel: string): string[] => {
  const recommendations: string[] = [];

  if (riskLevel === 'red' || riskLevel === 'urgent') {
    recommendations.push("🚨 URGENT ACTION REQUIRED: Immediate referral to specialist");
  } else if (data.treatmentPreferences?.includes('hrt')) {
    recommendations.push("💊 DISCUSS HRT: First-line treatment recommended");
    recommendations.push("📅 FOLLOW-UP: Review in 6-8 weeks");
  } else {
    recommendations.push("🌱 LIFESTYLE: Recommend lifestyle modifications");
    recommendations.push("ℹ️ EDUCATION: Provide patient education resources");
  }

  return recommendations;
};

// Function to generate patient guidance based on assessment data
export const generatePatientGuidance = (data: any): string => {
  let guidance = "Based on your assessment, here's some general guidance:\n\n";

  if (data.hotFlashFrequency === 'severe') {
    guidance += "- Consider discussing HRT with your GP to manage severe hot flashes.\n";
  } else {
    guidance += "- Lifestyle modifications such as regular exercise and a balanced diet can help manage mild symptoms.\n";
  }

  if (data.moodSymptoms === 'severe') {
    guidance += "- Seek psychological support or counseling to address severe mood symptoms.\n";
  } else {
    guidance += "- Practice relaxation techniques and mindfulness to improve mental wellbeing.\n";
  }

  return guidance;
};

// Function to calculate the risk level based on assessment data
export const calculateRiskLevel = (data: any): string => {
  // Check for high-risk factors first
  if (data.postmenopausalBleeding === 'yes' || data.unexplainedWeightLoss === 'yes' || data.severePelvicPain === 'yes') {
    return 'red';
  }

  // Check for severe mental health symptoms
  if (data.moodSymptoms === 'severe' || data.selfHarmRisk === 'frequent') {
    return 'red';
  }

  // Check for moderate mental health symptoms  
  if (data.moodSymptoms === 'moderate' || data.selfHarmRisk === 'occasional') {
    return 'amber';
  }

  // Check for mild symptoms
  if (data.moodSymptoms === 'mild') {
    return 'green';
  }

  // Default to low risk
  return 'green';
};

// Function to get urgent flags based on assessment data
export const getUrgentFlags = (data: any): string[] => {
  const urgentFlags: string[] = [];

  if (data.postmenopausalBleeding === 'yes') {
    urgentFlags.push("🚨 RED FLAG: Postmenopausal bleeding");
  }

  if (data.unexplainedWeightLoss === 'yes') {
    urgentFlags.push("🚨 RED FLAG: Unexplained weight loss");
  }

  if (data.severePelvicPain === 'yes') {
    urgentFlags.push("🚨 RED FLAG: Severe pelvic pain");
  }

  if (data.selfHarmRisk === 'frequent') {
    urgentFlags.push("🚨 RED FLAG: Patient reports frequent thoughts of self-harm");
  }

  if (data.moodSymptoms === 'severe') {
    urgentFlags.push("🟠 AMBER FLAG: Severe mood symptoms requiring urgent support");
  }

  if (data.selfHarmRisk === 'occasional') {
    urgentFlags.push("🟠 AMBER FLAG: Patient reports occasional thoughts of self-harm");
  }

  return urgentFlags;
};

// Function to get red flags based on assessment data
export const getRedFlags = (data: any): string[] => {
    const redFlags: string[] = [];
  
    if (data.postmenopausalBleeding === 'yes') {
      redFlags.push("🚨 RED FLAG: Postmenopausal bleeding");
    }
  
    if (data.unexplainedWeightLoss === 'yes') {
      redFlags.push("🚨 RED FLAG: Unexplained weight loss");
    }
  
    if (data.severePelvicPain === 'yes') {
      redFlags.push("🚨 RED FLAG: Severe pelvic pain");
    }

    if (data.selfHarmRisk === 'frequent') {
      redFlags.push("🚨 RED FLAG: Frequent thoughts of self-harm");
    }
  
    return redFlags;
  };
