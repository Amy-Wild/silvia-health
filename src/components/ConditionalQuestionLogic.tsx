
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
  bmi?: string;
  familyHistory?: string;
  medicationHistory?: string;
  [key: string]: any;
}

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
             data.alcoholConsumption === "22+" || parseFloat(data.bmi || "0") > 30;
    
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

export const getSymptomScore = (questionId: string, answer: any): number => {
  const scores: { [key: string]: { [key: string]: number } } = {
    // Vasomotor symptoms - NHS validated scoring (NICE NG23)
    hotFlashFrequency: { 
      none: 0, 
      mild: 4,      // 1-2 per day - moderate impact
      moderate: 7,  // 3-5 per day - significant impact
      severe: 10    // 6+ per day - severe impact on QoL
    },
    nightSweats: { 
      none: 0, 
      mild: 3,      // Occasionally wake up warm
      moderate: 6,  // Need to change clothes - sleep disrupted
      severe: 9     // Need to change bedding - severe sleep disruption
    },
    
    // Physical symptoms - weighted by clinical significance
    physicalSymptoms: {
      'joint-pain': 3,        // Common perimenopause symptom
      'muscle-pain': 2,       // Related to hormonal changes
      'headaches': 4,         // Can be severe, affects QoL
      'fatigue': 5,           // Major impact on daily function
      'weight-gain': 2,       // Metabolic changes
      'bloating': 2,          // Digestive/hormonal
      'breast-tenderness': 2, // Hormonal fluctuation
      'skin-changes': 3       // Estrogen deficiency related
    },
    
    // Psychological symptoms - validated scales adapted
    moodSymptoms: { 
      none: 0, 
      mild: 3,      // Slight mood changes
      moderate: 6,  // Noticeable mood swings affecting relationships
      severe: 9     // Significant depression/anxiety requiring intervention
    },
    cognitiveSymptoms: {
      none: 0,
      mild: 2,      // Occasional forgetfulness
      moderate: 5,  // Regular memory/concentration issues
      severe: 8     // Significant cognitive problems affecting work/life
    },
    
    // Sleep and sexual health - QoL impact weighted
    sleepQuality: {
      good: 0,
      fair: 3,      // Some sleep disruption
      poor: 6,      // Regular sleep problems
      'very-poor': 9 // Severe insomnia
    },
    libidoChanges: {
      'no-change': 0,
      decreased: 4,              // Mild decrease
      'significantly-decreased': 7 // Major impact on relationships
    },
    vaginalSymptoms: {
      none: 0,
      mild: 3,      // Slight dryness
      moderate: 5,  // Discomfort affecting intimacy
      severe: 8     // Painful, significant impact
    },
    
    // Lifestyle risk factors - cardiovascular/bone health weighted
    smokingStatus: { 
      never: 0, 
      former: 1,    // Reduced risk after cessation
      current: 6    // Major risk factor for CVD and osteoporosis
    },
    alcoholConsumption: { 
      none: 0, 
      "1-7": 0,     // Within guidelines
      "8-14": 1,    // Upper limit of guidelines
      "15-21": 3,   // Above recommended
      "22+": 5      // Significant health risk
    },
    exerciseLevel: { 
      high: 0,      // Protective factor
      moderate: 1,  // Good baseline
      light: 4,     // Room for improvement
      none: 7       // Major risk factor
    }
  };
  
  if (questionId === 'physicalSymptoms' && Array.isArray(answer)) {
    return answer.reduce((total, symptom) => total + (scores[questionId][symptom] || 0), 0);
  }
  
  return scores[questionId]?.[answer] || 0;
};

export const calculateRiskLevel = (data: AssessmentData): string => {
  // RED FLAGS - immediate urgent referral (NICE NG23)
  if (data.postmenopausalBleeding === "yes") return "red";
  if (data.unexplainedWeightLoss === "yes") return "red";
  if (data.severePelvicPain === "yes") return "red";
  
  // Calculate comprehensive symptom score
  let totalScore = 0;
  
  // Vasomotor symptoms (high weight - primary menopause symptoms)
  const vasomotorScore = (getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + 
                         getSymptomScore('nightSweats', data.nightSweats)) * 1.2;
  totalScore += vasomotorScore;
  
  // Psychological symptoms (high clinical significance)
  const psychScore = (getSymptomScore('moodSymptoms', data.moodSymptoms) + 
                     getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms)) * 1.1;
  totalScore += psychScore;
  
  // Physical symptoms
  totalScore += getSymptomScore('physicalSymptoms', data.physicalSymptoms);
  
  // Sleep and sexual health
  totalScore += getSymptomScore('sleepQuality', data.sleepQuality);
  totalScore += getSymptomScore('libidoChanges', data.libidoChanges);
  totalScore += getSymptomScore('vaginalSymptoms', data.vaginalSymptoms);
  
  // Lifestyle risk factors
  totalScore += getSymptomScore('smokingStatus', data.smokingStatus);
  totalScore += getSymptomScore('alcoholConsumption', data.alcoholConsumption);
  totalScore += getSymptomScore('exerciseLevel', data.exerciseLevel);
  
  // Age-based risk adjustment (NHS menopause guidelines)
  const age = parseInt(data.age || "0");
  if (age > 60) totalScore += 4;      // Post-menopause complications
  else if (age > 55) totalScore += 3; // Late menopause
  else if (age > 50) totalScore += 2; // Typical menopause age
  else if (age > 45) totalScore += 1; // Early perimenopause
  
  // BMI-based cardiovascular risk (NICE guidance)
  const bmi = parseFloat(data.bmi || "0");
  if (bmi > 35) totalScore += 5;      // Obesity class II+
  else if (bmi > 30) totalScore += 4; // Obesity class I
  else if (bmi > 25) totalScore += 2; // Overweight
  
  // Risk stratification based on NICE guidelines
  if (totalScore >= 30) return "red";    // High risk - urgent review needed
  if (totalScore >= 18) return "amber";  // Moderate risk - routine appointment within 2 weeks
  return "green";                        // Low risk - lifestyle advice and monitoring
};

export const generateClinicalSummary = (data: AssessmentData) => {
  const vasomotorScore = getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + 
                        getSymptomScore('nightSweats', data.nightSweats);
  
  const psychologicalScore = getSymptomScore('moodSymptoms', data.moodSymptoms) + 
                           getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms);
  
  const physicalScore = getSymptomScore('physicalSymptoms', data.physicalSymptoms);
  
  const sleepScore = getSymptomScore('sleepQuality', data.sleepQuality);
  
  const sexualScore = getSymptomScore('libidoChanges', data.libidoChanges) +
                     getSymptomScore('vaginalSymptoms', data.vaginalSymptoms);
  
  return {
    vasomotor: {
      score: vasomotorScore,
      severity: vasomotorScore >= 12 ? 'Severe' : vasomotorScore >= 7 ? 'Moderate' : vasomotorScore >= 3 ? 'Mild' : 'None',
      symptoms: {
        hotFlashes: data.hotFlashFrequency || 'Not assessed',
        nightSweats: data.nightSweats || 'Not assessed'
      },
      clinicalNotes: vasomotorScore >= 12 ? 'Severe vasomotor symptoms - HRT first-line treatment recommended' :
                     vasomotorScore >= 7 ? 'Moderate symptoms - discuss HRT vs lifestyle interventions' :
                     'Mild symptoms - lifestyle modifications may be sufficient'
    },
    psychological: {
      score: psychologicalScore,
      severity: psychologicalScore >= 12 ? 'Severe' : psychologicalScore >= 8 ? 'Moderate' : psychologicalScore >= 4 ? 'Mild' : 'None',
      symptoms: {
        mood: data.moodSymptoms || 'Not assessed',
        cognitive: data.cognitiveSymptoms || 'Not assessed'
      },
      clinicalNotes: psychologicalScore >= 12 ? 'Severe psychological symptoms - consider mental health referral + HRT' :
                     psychologicalScore >= 8 ? 'Moderate symptoms - HRT may help if perimenopausal' :
                     'Mild symptoms - monitor and provide support resources'
    },
    physical: {
      score: physicalScore,
      severity: physicalScore >= 15 ? 'Severe' : physicalScore >= 10 ? 'Moderate' : physicalScore >= 5 ? 'Mild' : 'None',
      symptoms: Array.isArray(data.physicalSymptoms) ? data.physicalSymptoms : [],
      clinicalNotes: physicalScore >= 15 ? 'Multiple severe physical symptoms - comprehensive assessment needed' :
                     physicalScore >= 10 ? 'Moderate physical symptoms - targeted interventions required' :
                     'Mild symptoms - lifestyle advice and monitoring'
    },
    sexual: {
      score: sexualScore,
      severity: sexualScore >= 12 ? 'Severe' : sexualScore >= 8 ? 'Moderate' : sexualScore >= 3 ? 'Mild' : 'None',
      symptoms: {
        libido: data.libidoChanges || 'Not assessed',
        vaginal: data.vaginalSymptoms || 'Not assessed'
      },
      clinicalNotes: sexualScore >= 12 ? 'Severe sexual health impact - topical estrogen + counseling' :
                     sexualScore >= 8 ? 'Moderate impact - discuss treatment options' :
                     'Mild impact - education and self-management advice'
    },
    lifestyle: {
      smoking: data.smokingStatus || 'Not assessed',
      alcohol: data.alcoholConsumption || 'Not assessed',
      exercise: data.exerciseLevel || 'Not assessed',
      bmi: data.bmi || 'Not calculated',
      riskLevel: calculateLifestyleRisk(data)
    }
  };
};

const calculateLifestyleRisk = (data: AssessmentData): string => {
  let risk = 0;
  if (data.smokingStatus === 'current') risk += 3;
  if (data.alcoholConsumption === '22+') risk += 2;
  if (data.exerciseLevel === 'none') risk += 2;
  const bmi = parseFloat(data.bmi || "0");
  if (bmi > 30) risk += 2;
  
  return risk >= 5 ? 'High' : risk >= 3 ? 'Moderate' : 'Low';
};

export const generateNHSRecommendations = (data: AssessmentData, riskLevel: string): string[] => {
  const recommendations = [];
  
  // RED FLAG MANAGEMENT (NICE NG23)
  if (riskLevel === "red") {
    if (data.postmenopausalBleeding === "yes") {
      recommendations.push("🚨 URGENT: 2-week wait referral for postmenopausal bleeding (suspected gynae cancer pathway)");
      recommendations.push("📋 Arrange transvaginal ultrasound +/- endometrial biopsy before referral if possible");
    }
    if (data.unexplainedWeightLoss === "yes") {
      recommendations.push("🚨 URGENT: Investigate unexplained weight loss - consider cancer pathway referral");
    }
    if (data.severePelvicPain === "yes") {
      recommendations.push("🚨 URGENT: Gynecological assessment for severe pelvic pain within 48 hours");
    }
    recommendations.push("⚠️ Safety net: Advise patient to return immediately if symptoms worsen");
    return recommendations;
  }
  
  // VASOMOTOR SYMPTOMS MANAGEMENT
  const clinicalSummary = generateClinicalSummary(data);
  const vasomotorSeverity = clinicalSummary.vasomotor.severity;
  
  if (vasomotorSeverity === 'Severe') {
    recommendations.push("💊 HRT RECOMMENDED: First-line treatment for severe vasomotor symptoms");
    recommendations.push("📊 Discuss individual benefits/risks: VTE risk (~3/1000), breast cancer risk (small increase)");
    recommendations.push("🔄 Start with lowest effective dose - typically estradiol + progesterone if uterus intact");
  } else if (vasomotorSeverity === 'Moderate') {
    recommendations.push("💭 DISCUSS HRT: Offer as first-line treatment vs lifestyle modifications");
    recommendations.push("🧘 Consider CBT if patient prefers non-hormonal approach initially");
  } else if (vasomotorSeverity === 'Mild') {
    recommendations.push("🏃 LIFESTYLE FIRST: Weight management, regular exercise, avoid triggers");
    recommendations.push("❄️ Cooling techniques, layered clothing, mindfulness for symptom management");
  }
  
  // PSYCHOLOGICAL SYMPTOMS
  const psychSeverity = clinicalSummary.psychological.severity;
  if (psychSeverity === 'Severe') {
    recommendations.push("🧠 MENTAL HEALTH ASSESSMENT: Use PHQ-9 and GAD-7 screening tools");
    recommendations.push("🏥 Consider referral to mental health services if score indicates moderate-severe depression/anxiety");
    recommendations.push("💊 HRT may help mood symptoms if perimenopausal - discuss alongside mental health treatment");
  } else if (psychSeverity === 'Moderate') {
    recommendations.push("📈 MONITOR MOOD: Provide depression/anxiety self-assessment tools");
    recommendations.push("🧘 Recommend CBT resources - online CBT programmes available");
  }
  
  // SEXUAL HEALTH
  const sexualSeverity = clinicalSummary.sexual.severity;
  if (sexualSeverity === 'Moderate' || sexualSeverity === 'Severe') {
    recommendations.push("🌸 TOPICAL ESTROGEN: First-line for vaginal atrophy - can use alongside systemic HRT");
    recommendations.push("💧 NON-HORMONAL OPTIONS: Vaginal moisturizers (Replens) and lubricants");
    recommendations.push("👥 RELATIONSHIP SUPPORT: Psychosexual counseling if relationship impact significant");
  }
  
  // LIFESTYLE INTERVENTIONS
  if (data.smokingStatus === "current") {
    recommendations.push("🚭 SMOKING CESSATION: Refer to local stop smoking service - reduces CVD and VTE risk");
    recommendations.push("⚠️ Smoking increases HRT risks - prioritize cessation before starting HRT if possible");
  }
  
  if (data.exerciseLevel === "none") {
    recommendations.push("🏃 EXERCISE PRESCRIPTION: 150 mins moderate activity/week (NICE guidelines)");
    recommendations.push("🦴 WEIGHT-BEARING EXERCISE: Essential for bone health - resistance training 2x/week");
  }
  
  if (data.alcoholConsumption === "22+") {
    recommendations.push("🍷 ALCOHOL REDUCTION: Current consumption exceeds 14 units/week guideline");
    recommendations.push("📱 Refer to alcohol reduction resources/apps");
  }
  
  const bmi = parseFloat(data.bmi || "0");
  if (bmi > 30) {
    recommendations.push("⚖️ WEIGHT MANAGEMENT: BMI >30 increases cardiovascular risk and may affect HRT choice");
    recommendations.push("🥗 Refer to weight management services/dietitian");
  }
  
  // BONE HEALTH (age-based)
  const age = parseInt(data.age || "0");
  if (age > 50) {
    recommendations.push("🦴 BONE HEALTH: Ensure adequate calcium (1000mg/day) and Vitamin D (800IU/day)");
    if (data.exerciseLevel === "none" || data.smokingStatus === "current") {
      recommendations.push("🩻 Consider DEXA scan if multiple risk factors for osteoporosis");
    }
  }
  
  // CARDIOVASCULAR RISK
  if (age > 50 || data.smokingStatus === "current" || bmi > 30) {
    recommendations.push("❤️ CARDIOVASCULAR ASSESSMENT: Check BP, lipids, diabetes risk");
    recommendations.push("💊 Consider cardioprotective effects of HRT in appropriate candidates");
  }
  
  // FOLLOW-UP BASED ON RISK LEVEL
  if (riskLevel === "amber") {
    recommendations.push("📅 FOLLOW-UP: Review in 3 months to assess treatment response");
    recommendations.push("🏥 Consider specialist menopause clinic referral if symptoms persist despite treatment");
  } else if (riskLevel === "green") {
    recommendations.push("📅 FOLLOW-UP: Routine review in 6 months or if symptoms worsen");
    recommendations.push("📚 Provide menopause information leaflets and self-management resources");
  }
  
  // STANDARD NICE RECOMMENDATIONS
  recommendations.push("🔍 HEALTH SCREENING: Ensure up-to-date cervical and breast screening");
  recommendations.push("📖 PATIENT EDUCATION: Provide NICE patient decision aid for menopause treatment options");
  recommendations.push("🌐 RESOURCES: British Menopause Society patient information, Menopause Matters website");
  
  return recommendations;
};
