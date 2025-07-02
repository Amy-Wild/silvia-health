interface AssessmentData {
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
  cognitiveSymptoms?: string;
  sleepQuality?: string;
  libidoChanges?: string;
  vaginalSymptoms?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  exerciseLevel?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  familyHistory?: string[];
  personalMedicalHistory?: string[];
  treatmentPreferences?: string[];
  [key: string]: any;
}

// Enhanced red flag detection with comprehensive medical history
export const getRedFlags = (data: AssessmentData): string[] => {
  const flags = [];
  
  // Urgent red flags requiring immediate referral
  if (data.postmenopausalBleeding === "yes") {
    flags.push("🚨 URGENT: Postmenopausal bleeding - 2-week wait gynae cancer referral required");
  }
  
  if (data.unexplainedWeightLoss === "yes") {
    flags.push("🚨 URGENT: Unexplained weight loss - investigate for malignancy");
  }
  
  if (data.severePelvicPain === "yes") {
    flags.push("🚨 URGENT: Severe pelvic pain - urgent gynecological assessment required");
  }
  
  // Personal medical history red flags
  const personalHistory = data.personalMedicalHistory || [];
  if (personalHistory.includes('breast-cancer')) {
    flags.push("⚠️ CAUTION: Personal history of breast cancer - specialist menopause clinic referral recommended");
  }
  
  if (personalHistory.includes('blood-clots')) {
    flags.push("⚠️ CAUTION: Personal history of VTE - thrombophilia screen and hematology input advised");
  }
  
  if (personalHistory.includes('liver-disease')) {
    flags.push("⚠️ CAUTION: Liver disease history - avoid oral HRT, consider transdermal options");
  }
  
  // Family history considerations
  const familyHistory = data.familyHistory || [];
  if (familyHistory.includes('breast-cancer') || familyHistory.includes('ovarian-cancer')) {
    flags.push("⚠️ GENETICS: Strong family history of breast/ovarian cancer - consider genetic counseling");
  }
  
  if (familyHistory.includes('blood-clots')) {
    flags.push("⚠️ GENETICS: Family history of VTE - increased thrombotic risk for HRT");
  }
  
  // High-risk lifestyle factors
  if (data.smokingStatus === 'current') {
    flags.push("⚠️ RISK: Current smoker - significantly increases VTE and cardiovascular risks");
  }
  
  const bmi = calculateBMI(data.height, data.weight);
  if (bmi && bmi > 35) {
    flags.push("⚠️ RISK: BMI >35 - significantly increased VTE risk, weight management priority");
  }
  
  return flags;
};

export const calculateBMI = (height?: string, weight?: string): number | null => {
  if (!height || !weight) return null;
  const h = parseFloat(height) / 100; // Convert cm to meters
  const w = parseFloat(weight);
  if (h > 0 && w > 0) {
    return w / (h * h);
  }
  return null;
};

// Enhanced risk calculation with medical history weighting
export const calculateRiskLevel = (data: AssessmentData): string => {
  // Immediate red flags - highest priority
  if (data.postmenopausalBleeding === "yes" || 
      data.unexplainedWeightLoss === "yes" || 
      data.severePelvicPain === "yes") {
    return "red";
  }
  
  // Personal history red flags
  const personalHistory = data.personalMedicalHistory || [];
  if (personalHistory.includes('breast-cancer') || 
      personalHistory.includes('blood-clots') || 
      personalHistory.includes('liver-disease')) {
    return "red"; // Requires specialist input
  }
  
  // Calculate symptom-based score
  let totalScore = 0;
  
  // Vasomotor symptoms (weighted highly)
  const vasomotorScore = (getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + 
                         getSymptomScore('nightSweats', data.nightSweats)) * 1.3;
  totalScore += vasomotorScore;
  
  // Psychological symptoms with depression history consideration
  const psychScore = (getSymptomScore('moodSymptoms', data.moodSymptoms) + 
                     getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms)) * 1.2;
  if (personalHistory.includes('depression')) {
    totalScore += psychScore * 1.5; // Increase weight if history of depression
  } else {
    totalScore += psychScore;
  }
  
  // Physical symptoms
  totalScore += getSymptomScore('physicalSymptoms', data.physicalSymptoms);
  
  // Sleep and sexual health
  totalScore += getSymptomScore('sleepQuality', data.sleepQuality);
  totalScore += getSymptomScore('libidoChanges', data.libidoChanges) * 0.8;
  totalScore += getSymptomScore('vaginalSymptoms', data.vaginalSymptoms) * 0.8;
  
  // Lifestyle and medical history risk factors
  totalScore += getSymptomScore('smokingStatus', data.smokingStatus) * 1.5;
  totalScore += getSymptomScore('alcoholConsumption', data.alcoholConsumption);
  totalScore += getSymptomScore('exerciseLevel', data.exerciseLevel);
  
  // Age-based risk with enhanced weighting
  const age = parseInt(data.age || "0");
  if (age > 60) totalScore += 5;
  else if (age > 55) totalScore += 3;
  else if (age > 50) totalScore += 2;
  else if (age > 45) totalScore += 1;
  else if (age < 40) totalScore += 3; // Early menopause concern
  
  // BMI-based risk
  const bmi = calculateBMI(data.height, data.weight);
  if (bmi) {
    if (bmi > 35) totalScore += 6;
    else if (bmi > 30) totalScore += 4;
    else if (bmi > 25) totalScore += 2;
    else if (bmi < 18.5) totalScore += 3; // Underweight concern
  }
  
  // Family history risk adjustment
  const familyHistory = data.familyHistory || [];
  if (familyHistory.includes('breast-cancer') || familyHistory.includes('ovarian-cancer')) {
    totalScore += 4;
  }
  if (familyHistory.includes('blood-clots') || familyHistory.includes('heart-disease')) {
    totalScore += 3;
  }
  
  // Risk stratification with enhanced thresholds
  if (totalScore >= 35) return "red";    // High complexity requiring specialist input
  if (totalScore >= 20) return "amber";  // Moderate risk - structured GP management
  return "green";                        // Low risk - lifestyle and monitoring
};

export const getSymptomScore = (questionId: string, answer: any): number => {
  const scores: { [key: string]: { [key: string]: number } } = {
    hotFlashFrequency: { 
      none: 0, 
      mild: 4,
      moderate: 7,
      severe: 10
    },
    nightSweats: { 
      none: 0, 
      mild: 3,
      moderate: 6,
      severe: 9
    },
    physicalSymptoms: {
      'joint-pain': 3,
      'muscle-pain': 2,
      'headaches': 4,
      'fatigue': 5,
      'weight-gain': 2,
      'bloating': 2,
      'breast-tenderness': 2,
      'skin-changes': 3
    },
    moodSymptoms: { 
      none: 0, 
      mild: 3,
      moderate: 6,
      severe: 9
    },
    cognitiveSymptoms: {
      none: 0,
      mild: 2,
      moderate: 5,
      severe: 8
    },
    sleepQuality: {
      good: 0,
      fair: 3,
      poor: 6,
      'very-poor': 9
    },
    libidoChanges: {
      'no-change': 0,
      decreased: 4,
      'significantly-decreased': 7
    },
    vaginalSymptoms: {
      none: 0,
      mild: 3,
      moderate: 5,
      severe: 8
    },
    smokingStatus: { 
      never: 0, 
      former: 1,
      current: 6
    },
    alcoholConsumption: { 
      none: 0, 
      "1-7": 0,
      "8-14": 1,
      "15-21": 3,
      "22+": 5
    },
    exerciseLevel: { 
      high: 0,
      moderate: 1,
      light: 4,
      none: 7
    }
  };
  
  if (questionId === 'physicalSymptoms' && Array.isArray(answer)) {
    return answer.reduce((total, symptom) => total + (scores[questionId][symptom] || 0), 0);
  }
  
  return scores[questionId]?.[answer] || 0;
};

// Enhanced clinical summary generation
export const generateClinicalSummary = (data: AssessmentData) => {
  const bmi = calculateBMI(data.height, data.weight);
  const redFlags = getRedFlags(data);
  
  return {
    vasomotor: {
      score: getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + getSymptomScore('nightSweats', data.nightSweats),
      severity: calculateSeverity(getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + getSymptomScore('nightSweats', data.nightSweats), [0, 7, 12]),
      symptoms: {
        hotFlashes: data.hotFlashFrequency || 'Not assessed',
        nightSweats: data.nightSweats || 'Not assessed'
      },
      clinicalNotes: generateVasomotorNotes(data)
    },
    psychological: {
      score: getSymptomScore('moodSymptoms', data.moodSymptoms) + getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms),
      severity: calculateSeverity(getSymptomScore('moodSymptoms', data.moodSymptoms) + getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms), [0, 8, 12]),
      symptoms: {
        mood: data.moodSymptoms || 'Not assessed',
        cognitive: data.cognitiveSymptoms || 'Not assessed'
      },
      clinicalNotes: generatePsychologicalNotes(data)
    },
    medicalHistory: {
      personal: data.personalMedicalHistory || [],
      family: data.familyHistory || [],
      riskLevel: assessMedicalHistoryRisk(data.personalMedicalHistory, data.familyHistory),
      clinicalNotes: generateMedicalHistoryNotes(data.personalMedicalHistory, data.familyHistory)
    },
    treatmentPreferences: {
      selected: data.treatmentPreferences || [],
      educationNeeded: (data.treatmentPreferences || []).length > 0,
      clinicalNotes: generateTreatmentPreferenceNotes(data.treatmentPreferences)
    },
    lifestyle: {
      smoking: data.smokingStatus || 'Not assessed',
      alcohol: data.alcoholConsumption || 'Not assessed',
      exercise: data.exerciseLevel || 'Not assessed',
      bmi: bmi ? bmi.toFixed(1) : 'Not calculated',
      riskLevel: calculateLifestyleRisk(data),
      clinicalNotes: generateLifestyleNotes(data, bmi)
    },
    redFlags: redFlags,
    overallComplexity: calculateOverallComplexity(data, redFlags)
  };
};

const calculateSeverity = (score: number, thresholds: number[]): string => {
  if (score >= thresholds[2]) return 'Severe';
  if (score >= thresholds[1]) return 'Moderate';
  if (score >= thresholds[0]) return 'Mild';
  return 'None';
};

const generateVasomotorNotes = (data: AssessmentData): string => {
  const score = getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + getSymptomScore('nightSweats', data.nightSweats);
  if (score >= 12) return 'Severe vasomotor symptoms - HRT first-line treatment strongly recommended';
  if (score >= 7) return 'Moderate symptoms - discuss HRT benefits/risks vs lifestyle interventions';
  if (score >= 3) return 'Mild symptoms - lifestyle modifications may be sufficient, monitor progression';
  return 'No significant vasomotor symptoms reported';
};

const generatePsychologicalNotes = (data: AssessmentData): string => {
  const score = getSymptomScore('moodSymptoms', data.moodSymptoms) + getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms);
  const hasDepressionHistory = (data.personalMedicalHistory || []).includes('depression');
  
  let notes = '';
  if (score >= 12) notes = 'Severe psychological symptoms - consider mental health referral';
  else if (score >= 8) notes = 'Moderate symptoms - monitor closely';
  else if (score >= 4) notes = 'Mild symptoms - provide support resources';
  else notes = 'No significant psychological symptoms';
  
  if (hasDepressionHistory) {
    notes += '. Previous depression history - enhanced monitoring required';
  }
  
  return notes;
};

const assessMedicalHistoryRisk = (personal?: string[], family?: string[]): string => {
  const personalRisk = personal || [];
  const familyRisk = family || [];
  
  if (personalRisk.includes('breast-cancer') || personalRisk.includes('blood-clots') || personalRisk.includes('liver-disease')) {
    return 'High';
  }
  
  if (familyRisk.includes('breast-cancer') || familyRisk.includes('ovarian-cancer') || familyRisk.includes('blood-clots')) {
    return 'Moderate';
  }
  
  return 'Low';
};

const generateMedicalHistoryNotes = (personal?: string[], family?: string[]): string => {
  const notes = [];
  
  if (personal && personal.includes('breast-cancer')) {
    notes.push('Personal breast cancer history - specialist menopause clinic referral recommended');
  }
  
  if (personal && personal.includes('blood-clots')) {
    notes.push('VTE history - avoid oral HRT, consider transdermal options with thrombophilia screen');
  }
  
  if (family && (family.includes('breast-cancer') || family.includes('ovarian-cancer'))) {
    notes.push('Strong family cancer history - genetic counseling consideration');
  }
  
  return notes.length > 0 ? notes.join('. ') : 'No significant medical history concerns identified';
};

const generateTreatmentPreferenceNotes = (preferences?: string[]): string => {
  if (!preferences || preferences.length === 0) {
    return 'No treatment preferences specified - discuss all options at consultation';
  }
  
  const preferenceMap: { [key: string]: string } = {
    'hrt': 'Patient interested in HRT - provide comprehensive education and risk-benefit discussion',
    'cbt': 'Patient interested in CBT - refer to psychological therapy resources',
    'non-hormonal': 'Patient prefers non-hormonal approaches - focus on lifestyle and alternative treatments'
  };
  
  return preferences.map(pref => preferenceMap[pref] || pref).join('. ');
};

const generateLifestyleNotes = (data: AssessmentData, bmi?: number | null): string => {
  const notes = [];
  
  if (data.smokingStatus === 'current') {
    notes.push('Current smoker - priority for cessation support, significantly affects HRT safety');
  }
  
  if (data.alcoholConsumption === '22+') {
    notes.push('High alcohol consumption - reduction counseling needed');
  }
  
  if (data.exerciseLevel === 'none') {
    notes.push('Sedentary lifestyle - exercise prescription recommended for bone and cardiovascular health');
  }
  
  if (bmi && bmi > 30) {
    notes.push(`BMI ${bmi.toFixed(1)} - weight management support needed, affects HRT choices`);
  }
  
  return notes.length > 0 ? notes.join('. ') : 'Generally healthy lifestyle profile';
};

const calculateLifestyleRisk = (data: AssessmentData): string => {
  let risk = 0;
  if (data.smokingStatus === 'current') risk += 3;
  if (data.alcoholConsumption === '22+') risk += 2;
  if (data.exerciseLevel === 'none') risk += 2;
  
  const bmi = calculateBMI(data.height, data.weight);
  if (bmi && bmi > 30) risk += 2;
  
  return risk >= 5 ? 'High' : risk >= 3 ? 'Moderate' : 'Low';
};

const calculateOverallComplexity = (data: AssessmentData, redFlags: string[]): string => {
  if (redFlags.some(flag => flag.includes('🚨 URGENT'))) return 'High - Urgent referral required';
  if (redFlags.some(flag => flag.includes('⚠️ CAUTION'))) return 'Moderate - Specialist input advised';
  if (redFlags.length > 2) return 'Moderate - Multiple considerations required';
  return 'Low - Routine GP management appropriate';
};

// Enhanced NHS recommendations with treatment preferences
export const generateNHSRecommendations = (data: AssessmentData, riskLevel: string): string[] => {
  const recommendations = [];
  const redFlags = getRedFlags(data);
  const clinicalSummary = generateClinicalSummary(data);
  
  // Handle urgent red flags first
  const urgentFlags = redFlags.filter(flag => flag.includes('🚨 URGENT'));
  if (urgentFlags.length > 0) {
    urgentFlags.forEach(flag => recommendations.push(flag));
    recommendations.push("⚠️ SAFETY NET: Advise patient to return immediately if symptoms worsen");
    recommendations.push("📅 URGENT FOLLOW-UP: Arrange within 48-72 hours or as clinically indicated");
    return recommendations;
  }
  
  // Treatment preference-based recommendations
  const preferences = data.treatmentPreferences || [];
  if (preferences.includes('hrt')) {
    recommendations.push("📚 EDUCATION PRIORITY: Patient interested in HRT - provide comprehensive information pack");
    recommendations.push("⚖️ RISK-BENEFIT: Detailed discussion of individual risks and benefits required");
  }
  
  if (preferences.includes('cbt')) {
    recommendations.push("🧠 CBT REFERRAL: Patient interested in psychological approaches - refer to appropriate services");
    recommendations.push("📱 RESOURCES: Provide CBT self-help resources and apps");
  }
  
  if (preferences.includes('non-hormonal')) {
    recommendations.push("🌿 NON-HORMONAL FOCUS: Patient prefers alternative approaches - lifestyle and complementary options");
  }
  
  // Medical history-based cautions
  redFlags.filter(flag => flag.includes('⚠️')).forEach(flag => recommendations.push(flag));
  
  // Core clinical recommendations based on symptoms
  if (clinicalSummary.vasomotor.severity === 'Severe') {
    recommendations.push("💊 HRT RECOMMENDED: First-line treatment for severe vasomotor symptoms (NICE NG23)");
    recommendations.push("🔄 MONITORING: Start with lowest effective dose, review at 3 months");
  } else if (clinicalSummary.vasomotor.severity === 'Moderate') {
    recommendations.push("💭 DISCUSS HRT: Offer as first-line treatment option vs lifestyle modifications");
  }
  
  // Psychological health recommendations
  if (clinicalSummary.psychological.severity === 'Severe') {
    recommendations.push("🧠 MENTAL HEALTH: PHQ-9/GAD-7 screening and consider mental health referral");
  }
  
  // Lifestyle interventions
  if (data.smokingStatus === 'current') {
    recommendations.push("🚭 PRIORITY: Smoking cessation - affects all treatment options and outcomes");
  }
  
  if (clinicalSummary.lifestyle.riskLevel === 'High') {
    recommendations.push("🏃 LIFESTYLE INTERVENTION: Comprehensive lifestyle modification program indicated");
  }
  
  // Follow-up based on complexity
  if (clinicalSummary.overallComplexity.includes('High')) {
    recommendations.push("🏥 SPECIALIST REFERRAL: Consider menopause specialist clinic for complex case management");
    recommendations.push("📅 FOLLOW-UP: Review in 2-4 weeks");
  } else if (clinicalSummary.overallComplexity.includes('Moderate')) {
    recommendations.push("📅 FOLLOW-UP: Structured review in 6-8 weeks");
  } else {
    recommendations.push("📅 FOLLOW-UP: Routine review in 3 months");
  }
  
  // Standard care recommendations
  recommendations.push("🔍 SCREENING: Ensure up-to-date cervical and breast screening");
  recommendations.push("📖 PATIENT RESOURCES: Provide NICE patient decision aids and reputable information sources");
  
  return recommendations;
};

export const shouldShowQuestion = (questionId: string, data: AssessmentData): boolean => {
  switch (questionId) {
    case "periodsStopped":
      return data.menstrualStatus === "stopped";
    
    case "postmenopausalBleeding":
      return data.menstrualStatus === "stopped" && 
             (data.periodsStopped === "1-2years" || data.periodsStopped === "2+years");
    
    case "cigarettesPerDay":
      return data.smokingStatus === "current";
    
    case "boneHealthConcerns":
      return parseInt(data.age || "0") > 45;
    
    case "cardiovascularRisk":
      return parseInt(data.age || "0") > 50 || data.smokingStatus === "current" || 
             data.alcoholConsumption === "22+" || (calculateBMI(data.height, data.weight) || 0) > 30;
    
    case "hrtSuitability":
      return data.menstrualStatus === "stopped" || data.menstrualStatus === "irregular";
    
    case "urgentReferralNeeded":
      return data.postmenopausalBleeding === "yes" || 
             data.unexplainedWeightLoss === "yes" || 
             data.severePelvicPain === "yes";
    
    default:
      return true;
  }
};
