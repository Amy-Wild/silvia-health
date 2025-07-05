interface AssessmentData {
  age?: string;
  menstrualStatus?: string;
  periodsStopped?: string;
  postmenopausalBleeding?: string;
  unexplainedWeightLoss?: string;
  severePelvicPain?: string;
  utiHistory?: string;
  selfHarmRisk?: string;
  mentalWellbeing?: string;
  hotFlashFrequency?: string;
  nightSweats?: string;
  physicalSymptoms?: string[];
  moodSymptoms?: string;
  cognitiveSymptoms?: string;
  moodImpact?: string;
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
  vasomotorImpact?: string;
  primaryConcern?: string;
  occupation?: string;
  additionalInfo?: string;
  [key: string]: any;
}

// Enhanced care pathway determination with NHS/NICE NG23 compliance
export const determineCarePath = (data: AssessmentData): 'gp-urgent' | 'gp-routine' | 'self-care' | 'education-first' => {
  const urgentFlags = getUrgentFlags(data);
  const riskFactors = assessRiskFactors(data);
  const preferences = data.treatmentPreferences || [];
  
  // URGENT GP appointment needed - RED FLAGS (NICE NG23)
  if (urgentFlags.length > 0) {
    return 'gp-urgent';
  }
  
  // HIGH PRIORITY - AMBER FLAGS
  const amberFlags = getAmberFlags(data);
  if (amberFlags.length > 0) {
    return 'gp-routine';
  }
  
  // CBT preference with psychological symptoms - ROUTINE GP
  if (preferences.includes('cbt') && (data.moodSymptoms === 'moderate' || data.moodSymptoms === 'severe')) {
    return 'gp-routine';
  }
  
  // HRT interest - ROUTINE GP
  if (preferences.includes('hrt')) {
    return 'gp-routine';
  }
  
  // Moderate to severe vasomotor symptoms - ROUTINE GP
  if (data.hotFlashFrequency === 'severe' || data.nightSweats === 'severe') {
    return 'gp-routine';
  }
  
  // Complex medical history - ROUTINE GP
  if (hasComplexMedicalHistory(data)) {
    return 'gp-routine';
  }
  
  // Self-care preferences with mild symptoms
  if (preferences.includes('non-hormonal') || preferences.includes('lifestyle')) {
    const symptomSeverity = calculateSymptomSeverity(data);
    return symptomSeverity === 'mild' ? 'education-first' : 'gp-routine';
  }
  
  // Default pathway based on overall complexity
  const overallComplexity = calculateOverallComplexity(data, getRedFlags(data));
  if (overallComplexity.includes('Low') && riskFactors.length === 0) {
    return 'self-care';
  }
  
  return 'gp-routine';
};

// URGENT RED FLAGS - NHS/NICE NG23 Compliant
export const getUrgentFlags = (data: AssessmentData): string[] => {
  const flags = [];
  
  // Cancer red flags
  if (data.postmenopausalBleeding === "yes") {
    flags.push("Postmenopausal bleeding requires urgent gynecological assessment");
  }
  
  if (data.unexplainedWeightLoss === "yes") {
    flags.push("Unexplained weight loss requires urgent investigation");
  }
  
  if (data.severePelvicPain === "yes") {
    flags.push("Severe pelvic pain requires urgent gynecological review");
  }

  // Mental health red flags
  if (data.selfHarmRisk === "frequent") {
    flags.push("Active suicidal ideation requires immediate mental health assessment");
  }

  // Recurrent infections
  if (data.utiHistory === "frequent" && data.vaginalSymptoms === "severe") {
    flags.push("Frequent UTIs with severe symptoms may indicate serious pathology");
  }
  
  return flags;
};

// AMBER FLAGS - High priority but not urgent
export const getAmberFlags = (data: AssessmentData): string[] => {
  const flags = [];
  
  // Psychological amber flags
  if (data.selfHarmRisk === "occasional") {
    flags.push("Suicidal thoughts require mental health review and safety planning");
  }
  
  if (data.moodSymptoms === "severe") {
    flags.push("Severe mood symptoms require priority mental health assessment");
  }
  
  // Early menopause
  const age = parseInt(data.age || "50");
  if (age < 45 && data.menstrualStatus === "stopped") {
    flags.push("Premature menopause requires specialist endocrine assessment");
  }
  
  // High-risk medical history
  const personalHistory = data.personalMedicalHistory || [];
  if (personalHistory.includes('breast-cancer')) {
    flags.push("Breast cancer history requires specialist menopause clinic referral");
  }
  
  if (personalHistory.includes('blood-clots')) {
    flags.push("VTE history requires thrombophilia assessment before HRT");
  }
  
  // Severe vasomotor symptoms affecting quality of life
  if ((data.hotFlashFrequency === 'severe' || data.nightSweats === 'severe') && data.vasomotorImpact === 'severe') {
    flags.push("Severe vasomotor symptoms significantly impacting quality of life");
  }
  
  return flags;
};

// Enhanced complex medical history assessment
const hasComplexMedicalHistory = (data: AssessmentData): boolean => {
  const personalHistory = data.personalMedicalHistory || [];
  const familyHistory = data.familyHistory || [];
  
  // High-risk personal history
  const highRiskConditions = ['breast-cancer', 'blood-clots', 'liver-disease', 'heart-disease', 'stroke'];
  if (personalHistory.some(condition => highRiskConditions.includes(condition))) {
    return true;
  }
  
  // Multiple conditions
  if (personalHistory.length >= 3) {
    return true;
  }
  
  // Strong family history
  const strongFamilyHistory = ['breast-cancer', 'ovarian-cancer', 'blood-clots'];
  if (familyHistory.some(condition => strongFamilyHistory.includes(condition))) {
    return true;
  }
  
  return false;
};

// GP-facing clinical red flags with proper color coding
export const getRedFlags = (data: AssessmentData): string[] => {
  const flags = [];
  
  // 🚨 RED - URGENT (within 24-48 hours)
  if (data.postmenopausalBleeding === "yes") {
    flags.push("🚨 RED: Postmenopausal bleeding - 2-week wait gynae cancer referral required (NICE NG23)");
  }
  
  if (data.unexplainedWeightLoss === "yes") {
    flags.push("🚨 RED: Unexplained weight loss - urgent investigation for malignancy required");
  }
  
  if (data.severePelvicPain === "yes") {
    flags.push("🚨 RED: Severe pelvic pain - urgent gynecological assessment required");
  }

  if (data.selfHarmRisk === "frequent") {
    flags.push("🚨 RED: Active suicidal ideation - immediate mental health crisis assessment required");
  }

  // 🟠 AMBER - HIGH PRIORITY (within 1-2 weeks)
  if (data.selfHarmRisk === "occasional") {
    flags.push("🟠 AMBER: Suicidal thoughts - mental health review and safety planning within 1 week");
  }
  
  const age = parseInt(data.age || "50");
  if (age < 45 && data.menstrualStatus === "stopped") {
    flags.push("🟠 AMBER: Premature menopause - specialist endocrine referral required");
  }
  
  if (data.moodSymptoms === "severe") {
    flags.push("🟠 AMBER: Severe mood symptoms - priority mental health assessment required");
  }
  
  // Personal medical history amber flags
  const personalHistory = data.personalMedicalHistory || [];
  if (personalHistory.includes('breast-cancer')) {
    flags.push("🟠 AMBER: Breast cancer history - specialist menopause clinic referral recommended");
  }
  
  if (personalHistory.includes('blood-clots')) {
    flags.push("🟠 AMBER: VTE history - thrombophilia screen and hematology input before HRT");
  }
  
  if (personalHistory.includes('liver-disease')) {
    flags.push("🟠 AMBER: Liver disease - avoid oral HRT, hepatology review if considering hormones");
  }
  
  // 🟡 YELLOW - MODERATE PRIORITY (routine)
  if (data.utiHistory === "frequent") {
    flags.push("🟡 YELLOW: Frequent UTIs - investigate underlying causes, consider vaginal estrogen");
  }
  
  if (data.smokingStatus === 'current') {
    flags.push("🟡 YELLOW: Current smoker - cessation priority, affects all treatment safety profiles");
  }
  
  const bmi = calculateBMI(data.height, data.weight);
  if (bmi && bmi > 35) {
    flags.push("🟡 YELLOW: BMI >35 - weight management priority, affects treatment choices");
  }
  
  // CBT mapping - NOT urgent, routine priority
  if (data.treatmentPreferences?.includes('cbt') && (data.moodSymptoms === 'moderate' || data.moodSymptoms === 'severe')) {
    flags.push("🟡 YELLOW: CBT requested for psychological symptoms - routine mental health referral appropriate");
  }
  
  return flags;
};

// Calculate BMI utility
export const calculateBMI = (height?: string, weight?: string): number | null => {
  if (!height || !weight) return null;
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  if (h > 0 && w > 0) {
    return w / (h * h);
  }
  return null;
};

// Enhanced risk level calculation
export const calculateRiskLevel = (data: AssessmentData): 'red' | 'amber' | 'yellow' | 'green' => {
  // RED - Immediate urgent care needed
  if (data.postmenopausalBleeding === "yes" || 
      data.unexplainedWeightLoss === "yes" || 
      data.severePelvicPain === "yes" ||
      data.selfHarmRisk === "frequent") {
    return "red";
  }
  
  // AMBER - High priority
  const age = parseInt(data.age || "50");
  if (age < 45 && data.menstrualStatus === "stopped" ||
      data.selfHarmRisk === "occasional" ||
      data.moodSymptoms === "severe" ||
      (data.personalMedicalHistory || []).includes('breast-cancer') ||
      (data.personalMedicalHistory || []).includes('blood-clots')) {
    return "amber";
  }
  
  // YELLOW - Moderate priority
  if (data.hotFlashFrequency === "severe" ||
      data.nightSweats === "severe" ||
      data.utiHistory === "frequent" ||
      data.smokingStatus === 'current' ||
      (calculateBMI(data.height, data.weight) || 0) > 35) {
    return "yellow";
  }
  
  // GREEN - Low risk
  return "green";
};

const calculateSymptomSeverity = (data: AssessmentData): 'mild' | 'moderate' | 'severe' => {
  const vasomotorScore = getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + 
                        getSymptomScore('nightSweats', data.nightSweats);
  const psychScore = getSymptomScore('moodSymptoms', data.moodSymptoms) + 
                    getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms);
  const totalScore = vasomotorScore + psychScore;
  
  if (totalScore >= 15) return 'severe';
  if (totalScore >= 8) return 'moderate';
  return 'mild';
};

const assessRiskFactors = (data: AssessmentData): string[] => {
  const factors = [];
  
  if (data.smokingStatus === 'current') factors.push('smoking');
  if (data.exerciseLevel === 'none') factors.push('sedentary');
  
  const bmi = calculateBMI(data.height, data.weight);
  if (bmi && bmi > 30) factors.push('high-bmi');
  
  const personalHistory = data.personalMedicalHistory || [];
  const familyHistory = data.familyHistory || [];
  
  if (personalHistory.length > 0) factors.push('personal-history');
  if (familyHistory.length > 0) factors.push('family-history');
  
  return factors;
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
    moodImpact: {
      none: 0,
      mild: 2,
      moderate: 5,
      severe: 8
    },
    mentalWellbeing: {
      excellent: 0,
      good: 1,
      fair: 4,
      poor: 8
    },
    selfHarmRisk: {
      no: 0,
      occasional: 6,
      frequent: 10
    },
    utiHistory: {
      no: 0,
      occasional: 3,
      frequent: 6
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
  if (score >= 12) return 'Severe vasomotor symptoms - HRT first-line treatment strongly recommended (NICE NG23)';
  if (score >= 7) return 'Moderate symptoms - discuss HRT benefits/risks vs lifestyle interventions';
  if (score >= 3) return 'Mild symptoms - lifestyle modifications may be sufficient, monitor progression';
  return 'No significant vasomotor symptoms reported';
};

const generatePsychologicalNotes = (data: AssessmentData): string => {
  const score = getSymptomScore('moodSymptoms', data.moodSymptoms) + getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms);
  const hasDepressionHistory = (data.personalMedicalHistory || []).includes('depression');
  
  let notes = '';
  if (score >= 12) notes = 'Severe psychological symptoms - consider mental health referral';
  else if (score >= 8) notes = 'Moderate symptoms - monitor closely, consider CBT referral';
  else if (score >= 4) notes = 'Mild symptoms - provide support resources';
  else notes = 'No significant psychological symptoms';
  
  if (hasDepressionHistory) {
    notes += '. Previous depression history - enhanced monitoring required';
  }
  
  // CBT preference mapping
  if (data.treatmentPreferences?.includes('cbt')) {
    notes += '. Patient interested in CBT - routine mental health referral appropriate';
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
    'cbt': 'Patient interested in CBT - routine mental health referral for psychological therapy',
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
  if (redFlags.some(flag => flag.includes('🚨 RED'))) return 'High - Urgent referral required';
  if (redFlags.some(flag => flag.includes('🟠 AMBER'))) return 'Moderate - Specialist input advised';
  if (redFlags.length > 2) return 'Moderate - Multiple considerations required';
  return 'Low - Routine GP management appropriate';
};

export const generateNHSRecommendations = (data: AssessmentData, riskLevel: string): string[] => {
  const recommendations = [];
  const redFlags = getRedFlags(data);
  const clinicalSummary = generateClinicalSummary(data);
  
  // Handle urgent red flags first
  const urgentFlags = redFlags.filter(flag => flag.includes('🚨 RED'));
  if (urgentFlags.length > 0) {
    urgentFlags.forEach(flag => recommendations.push(flag.replace('🚨 RED:', '🚨 URGENT ACTION:')));
    recommendations.push("⚠️ SAFETY NET: Advise patient to return immediately if symptoms worsen");
    recommendations.push("📅 URGENT FOLLOW-UP: Arrange within 24-48 hours or as clinically indicated");
    return recommendations;
  }
  
  // Handle amber flags
  const amberFlags = redFlags.filter(flag => flag.includes('🟠 AMBER'));
  amberFlags.forEach(flag => recommendations.push(flag.replace('🟠 AMBER:', '🟠 HIGH PRIORITY:')));
  
  // Treatment recommendations based on preferences and symptoms
  const preferences = data.treatmentPreferences || [];
  if (preferences.includes('hrt')) {
    recommendations.push("📚 HRT EDUCATION: Patient interested in HRT - provide comprehensive information and risk-benefit discussion");
    if (clinicalSummary.vasomotor.severity === 'Severe') {
      recommendations.push("💊 HRT RECOMMENDED: First-line treatment for severe vasomotor symptoms (NICE NG23)");
    }
  }
  
  if (preferences.includes('cbt')) {
    recommendations.push("🧠 CBT REFERRAL: Patient interested in psychological approaches - routine mental health referral");
    recommendations.push("📱 CBT RESOURCES: Provide self-help resources while awaiting formal therapy");
  }
  
  // Core clinical recommendations
  if (clinicalSummary.vasomotor.severity === 'Severe' && !preferences.includes('hrt')) {
    recommendations.push("💭 DISCUSS HRT: Consider offering as first-line treatment for severe symptoms");
  }
  
  // Yellow flag recommendations
  const yellowFlags = redFlags.filter(flag => flag.includes('🟡 YELLOW'));
  yellowFlags.forEach(flag => recommendations.push(flag.replace('🟡 YELLOW:', '🟡 ROUTINE PRIORITY:')));
  
  // Standard follow-up
  if (urgentFlags.length > 0) {
    recommendations.push("📅 FOLLOW-UP: Review in 24-48 hours");
  } else if (amberFlags.length > 0) {
    recommendations.push("📅 FOLLOW-UP: Review in 1-2 weeks");
  } else {
    recommendations.push("📅 FOLLOW-UP: Routine review in 6-8 weeks");
  }
  
  // Standard care
  recommendations.push("🔍 SCREENING: Ensure up-to-date cervical and breast screening");
  recommendations.push("📖 PATIENT RESOURCES: Provide NICE patient decision aids");
  
  return recommendations;
};

// Generate patient-friendly guidance messages
export const generatePatientGuidance = (carePath: string, data: AssessmentData): {
  title: string;
  description: string;
  nextSteps: string[];
  urgency: 'low' | 'medium' | 'high';
} => {
  const preferences = data.treatmentPreferences || [];
  
  switch (carePath) {
    case 'gp-urgent':
      return {
        title: "We recommend booking an appointment with your GP soon",
        description: "Based on your answers, it would be helpful for your GP to review your symptoms and provide personalized guidance.",
        nextSteps: [
          "Contact your GP practice to book an appointment",
          "Mention you've completed a menopause assessment",
          "Take a note of your main concerns to discuss"
        ],
        urgency: 'high'
      };
      
    case 'gp-routine':
      return {
        title: preferences.includes('hrt') 
          ? "Great choice exploring HRT - let's get you the right support"
          : "A GP appointment would be helpful for your next steps",
        description: preferences.includes('hrt')
          ? "Since you're interested in hormone replacement therapy, your GP can discuss options that might work well for you."
          : "Your symptoms and preferences suggest a conversation with your GP would help create the right plan for you.",
        nextSteps: [
          "Book a routine appointment with your GP",
          "You've already learned about your preferred treatment options",
          "Prepare questions about what you'd like to try first"
        ],
        urgency: 'medium'
      };
      
    case 'education-first':
      return {
        title: "You're taking a great approach to managing your symptoms",
        description: "Based on your preferences for natural approaches, we have resources that can help you get started right away.",
        nextSteps: [
          "Explore the educational resources for your chosen approaches",
          "Try the suggested lifestyle changes and techniques",
          "Consider booking a routine GP appointment in 2-3 months to review progress"
        ],
        urgency: 'low'
      };
      
    case 'self-care':
    default:
      return {
        title: "You have options to start managing your symptoms today",
        description: "Your assessment suggests several self-care approaches that could help improve how you're feeling.",
        nextSteps: [
          "Review the lifestyle and wellness resources available",
          "Track your symptoms to see what helps most",
          "Book a GP appointment if you'd like to discuss treatment options"
        ],
        urgency: 'low'
      };
  }
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
