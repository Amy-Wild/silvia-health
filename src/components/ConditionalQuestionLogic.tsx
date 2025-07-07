
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

// NICE NG23 COMPLIANT RISK CALCULATION
export const calculateRiskLevel = (data: any): string => {
  console.log("=== NICE NG23 COMPLIANT RISK CALCULATION ===");
  console.log("Input data:", data);
  
  // RED FLAGS - IMMEDIATE URGENT CARE (NICE NG23 Section 1.4.19)
  console.log("=== CHECKING RED FLAGS (NICE NG23) ===");
  
  // 1. Postmenopausal bleeding - NICE NG23 Section 1.4.19
  console.log("Checking postmenopausal bleeding:", data.postmenopausalBleeding);
  if (data.postmenopausalBleeding === 'yes') {
    console.log("🚨 RED FLAG DETECTED: Postmenopausal bleeding - NICE NG23 2-week wait referral required");
    return 'red';
  }

  // 2. Unexplained weight loss >5% - NICE CG27
  console.log("Checking unexplained weight loss:", data.unexplainedWeightLoss);
  if (data.unexplainedWeightLoss === 'yes') {
    console.log("🚨 RED FLAG DETECTED: Unexplained weight loss - urgent cancer investigation required");
    return 'red';
  }

  // 3. Severe/persistent pelvic pain - RCOG guidelines
  console.log("Checking severe pelvic pain:", data.severePelvicPain);
  if (data.severePelvicPain === 'yes') {
    console.log("🚨 RED FLAG DETECTED: Severe pelvic pain - urgent gynecology assessment required");
    return 'red';
  }

  // 4. Severe mental health with self-harm risk - NICE CG90/CG91
  console.log("Checking self harm risk:", data.selfHarmRisk);
  if (data.selfHarmRisk === 'frequent') {
    console.log("🚨 RED FLAG DETECTED: Frequent self-harm thoughts - crisis intervention required");
    return 'red';
  }

  // AMBER FLAGS - PRIORITY GP ASSESSMENT (NICE NG23)
  console.log("=== CHECKING AMBER FLAGS (NICE NG23) ===");
  
  // 1. Severe mood symptoms - NICE NG23 Section 1.5.5
  console.log("Checking mood symptoms:", data.moodSymptoms);
  if (data.moodSymptoms === 'severe') {
    console.log("🟠 AMBER FLAG: Severe mood symptoms - priority mental health support needed");
    return 'amber';
  }

  // 2. Occasional self-harm thoughts - NICE CG16
  if (data.selfHarmRisk === 'occasional') {
    console.log("🟠 AMBER FLAG: Occasional self-harm thoughts - mental health assessment needed");
    return 'amber';
  }

  // 3. Severe vasomotor symptoms with significant impact - NICE NG23 Section 1.4.1
  if (data.hotFlashFrequency === 'severe' && data.nightSweats === 'severe') {
    console.log("🟠 AMBER FLAG: Severe vasomotor symptoms - HRT first-line treatment");
    return 'amber';
  }

  // GREEN FLAGS - ROUTINE MANAGEMENT
  console.log("=== NO RED/AMBER FLAGS - ASSESSING GREEN LEVEL ===");
  
  // Moderate symptoms
  if (data.moodSymptoms === 'moderate' || data.hotFlashFrequency === 'moderate') {
    console.log("🟢 GREEN: Moderate symptoms - routine GP management");
    return 'green';
  }

  // Default to low risk
  console.log("🟢 LOW RISK: No significant risk factors identified");
  return 'green';
};

// NICE NG23 COMPLIANT URGENT FLAGS
export const getUrgentFlags = (data: any): string[] => {
  console.log("=== NICE NG23 URGENT FLAGS ASSESSMENT ===");
  console.log("Input data for urgent flags:", data);
  
  const urgentFlags: string[] = [];

  // RED FLAGS requiring immediate action
  if (data.postmenopausalBleeding === 'yes') {
    console.log("Adding RED FLAG: Postmenopausal bleeding");
    urgentFlags.push("🚨 RED FLAG: Postmenopausal bleeding - 2-week wait referral required (NICE NG23)");
  }

  if (data.unexplainedWeightLoss === 'yes') {
    console.log("Adding RED FLAG: Unexplained weight loss");
    urgentFlags.push("🚨 RED FLAG: Unexplained weight loss - urgent cancer investigation required (NICE CG27)");
  }

  if (data.severePelvicPain === 'yes') {
    console.log("Adding RED FLAG: Severe pelvic pain");
    urgentFlags.push("🚨 RED FLAG: Severe pelvic pain - urgent gynecology assessment required");
  }

  if (data.selfHarmRisk === 'frequent') {
    console.log("Adding RED FLAG: Frequent self-harm risk");
    urgentFlags.push("🚨 RED FLAG: Frequent thoughts of self-harm - crisis intervention required");
  }

  // AMBER FLAGS requiring priority assessment
  if (data.moodSymptoms === 'severe') {
    console.log("Adding AMBER FLAG: Severe mood symptoms");
    urgentFlags.push("🟠 AMBER FLAG: Severe mood symptoms - priority mental health support (NICE NG23)");
  }

  if (data.selfHarmRisk === 'occasional') {
    console.log("Adding AMBER FLAG: Occasional self-harm risk");
    urgentFlags.push("🟠 AMBER FLAG: Occasional thoughts of self-harm - mental health assessment required");
  }

  console.log("=== FINAL URGENT FLAGS ===");
  console.log("Total urgent flags:", urgentFlags.length);
  console.log("Urgent flags list:", urgentFlags);
  
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
