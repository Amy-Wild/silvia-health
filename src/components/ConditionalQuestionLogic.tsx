
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
    
    default:
      return true;
  }
};

export const getSymptomScore = (questionId: string, answer: any): number => {
  const scores: { [key: string]: { [key: string]: number } } = {
    // Vasomotor symptoms - NHS severity scoring
    hotFlashFrequency: { 
      none: 0, 
      mild: 3,      // 1-2 per day
      moderate: 6,  // 3-5 per day
      severe: 9     // 6+ per day
    },
    nightSweats: { 
      none: 0, 
      mild: 2,      // Occasionally wake up warm
      moderate: 5,  // Need to change clothes
      severe: 8     // Need to change bedding
    },
    
    // Physical symptoms
    physicalSymptoms: {
      'joint-pain': 2,
      'muscle-pain': 2,
      'headaches': 3,
      'fatigue': 4,
      'weight-gain': 2,
      'bloating': 2,
      'breast-tenderness': 1,
      'skin-changes': 2
    },
    
    // Psychological symptoms - validated scoring
    moodSymptoms: { 
      none: 0, 
      mild: 2,      // Slightly more emotional
      moderate: 5,  // Noticeable mood swings
      severe: 8     // Significant depression/anxiety
    },
    cognitiveSymptoms: {
      none: 0,
      mild: 2,      // Occasional forgetfulness
      moderate: 4,  // Regular memory issues
      severe: 7     // Significant problems
    },
    
    // Sleep and sexual health
    sleepQuality: {
      good: 0,
      fair: 2,
      poor: 5,
      'very-poor': 8
    },
    libidoChanges: {
      'no-change': 0,
      decreased: 3,
      'significantly-decreased': 6
    },
    vaginalSymptoms: {
      none: 0,
      mild: 2,
      moderate: 4,
      severe: 6
    },
    
    // Lifestyle risk factors
    smokingStatus: { 
      never: 0, 
      former: 1, 
      current: 4 
    },
    alcoholConsumption: { 
      none: 0, 
      "1-7": 0, 
      "8-14": 1, 
      "15-21": 2, 
      "22+": 4 
    },
    exerciseLevel: { 
      high: 0, 
      moderate: 1, 
      light: 3, 
      none: 5 
    }
  };
  
  if (questionId === 'physicalSymptoms' && Array.isArray(answer)) {
    return answer.reduce((total, symptom) => total + (scores[questionId][symptom] || 0), 0);
  }
  
  return scores[questionId]?.[answer] || 0;
};

export const calculateRiskLevel = (data: AssessmentData): string => {
  // Red flags that immediately trigger urgent review - NHS guidelines
  if (data.postmenopausalBleeding === "yes") return "red";
  if (data.unexplainedWeightLoss === "yes") return "red";
  if (data.severePelvicPain === "yes") return "red";
  
  // Calculate weighted symptom score
  let totalScore = 0;
  Object.keys(data).forEach(key => {
    totalScore += getSymptomScore(key, data[key]);
  });
  
  // Age-based risk adjustment (NHS menopause guidelines)
  const age = parseInt(data.age || "0");
  if (age > 60) totalScore += 3;
  else if (age > 55) totalScore += 2;
  else if (age > 50) totalScore += 1;
  
  // BMI-based cardiovascular risk
  const bmi = parseFloat(data.bmi || "0");
  if (bmi > 35) totalScore += 4;
  else if (bmi > 30) totalScore += 3;
  else if (bmi > 25) totalScore += 1;
  
  // Risk stratification based on NICE guidelines
  if (totalScore >= 20) return "red";    // High risk - urgent review needed
  if (totalScore >= 12) return "amber";  // Moderate risk - routine appointment
  return "green";                        // Low risk - lifestyle advice
};

export const generateClinicalSummary = (data: AssessmentData) => {
  const vasomotorScore = getSymptomScore('hotFlashFrequency', data.hotFlashFrequency) + 
                        getSymptomScore('nightSweats', data.nightSweats);
  
  const psychologicalScore = getSymptomScore('moodSymptoms', data.moodSymptoms) + 
                           getSymptomScore('cognitiveSymptoms', data.cognitiveSymptoms);
  
  const physicalScore = getSymptomScore('physicalSymptoms', data.physicalSymptoms) +
                       getSymptomScore('sleepQuality', data.sleepQuality);
  
  const sexualScore = getSymptomScore('libidoChanges', data.libidoChanges) +
                     getSymptomScore('vaginalSymptoms', data.vaginalSymptoms);
  
  return {
    vasomotor: {
      score: vasomotorScore,
      severity: vasomotorScore >= 8 ? 'Severe' : vasomotorScore >= 4 ? 'Moderate' : 'Mild',
      symptoms: {
        hotFlashes: data.hotFlashFrequency || 'Not assessed',
        nightSweats: data.nightSweats || 'Not assessed'
      }
    },
    psychological: {
      score: psychologicalScore,
      severity: psychologicalScore >= 8 ? 'Severe' : psychologicalScore >= 4 ? 'Moderate' : 'Mild',
      symptoms: {
        mood: data.moodSymptoms || 'Not assessed',
        cognitive: data.cognitiveSymptoms || 'Not assessed'
      }
    },
    physical: {
      score: physicalScore,
      severity: physicalScore >= 8 ? 'Severe' : physicalScore >= 4 ? 'Moderate' : 'Mild',
      symptoms: data.physicalSymptoms || []
    },
    sexual: {
      score: sexualScore,
      severity: sexualScore >= 6 ? 'Severe' : sexualScore >= 3 ? 'Moderate' : 'Mild',
      symptoms: {
        libido: data.libidoChanges || 'Not assessed',
        vaginal: data.vaginalSymptoms || 'Not assessed'
      }
    },
    lifestyle: {
      smoking: data.smokingStatus || 'Not assessed',
      alcohol: data.alcoholConsumption || 'Not assessed',
      exercise: data.exerciseLevel || 'Not assessed',
      bmi: data.bmi || 'Not calculated'
    }
  };
};

export const generateNHSRecommendations = (data: AssessmentData, riskLevel: string): string[] => {
  const recommendations = [];
  
  // Red flag recommendations (NICE NG23)
  if (riskLevel === "red") {
    recommendations.push("URGENT: 2-week wait referral recommended for postmenopausal bleeding");
    recommendations.push("Comprehensive gynaecological examination required");
    recommendations.push("Consider transvaginal ultrasound and endometrial biopsy");
  }
  
  // Vasomotor symptoms (NICE NG23 recommendations)
  const hotFlashScore = getSymptomScore('hotFlashFrequency', data.hotFlashFrequency);
  const nightSweatScore = getSymptomScore('nightSweats', data.nightSweats);
  
  if (hotFlashScore >= 6 || nightSweatScore >= 5) {
    recommendations.push("Consider HRT - first-line treatment for moderate-severe vasomotor symptoms");
    recommendations.push("Discuss benefits/risks of HRT including VTE and breast cancer risk");
  } else if (hotFlashScore >= 3 || nightSweatScore >= 2) {
    recommendations.push("Lifestyle modifications for mild vasomotor symptoms");
    recommendations.push("Consider cognitive behavioural therapy (CBT)");
  }
  
  // Psychological symptoms
  const moodScore = getSymptomScore('moodSymptoms', data.moodSymptoms);
  if (moodScore >= 5) {
    recommendations.push("Consider mental health assessment - use PHQ-9 or GAD-7");
    recommendations.push("HRT may help mood symptoms if perimenopausal");
    recommendations.push("Consider referral to mental health services if severe");
  }
  
  // Physical symptoms and lifestyle
  if (data.smokingStatus === "current") {
    recommendations.push("Smoking cessation support - reduces cardiovascular and VTE risk");
  }
  
  if (data.exerciseLevel === "none") {
    recommendations.push("Exercise prescription - 150 mins moderate activity per week");
    recommendations.push("Weight-bearing exercise for bone health");
  }
  
  if (data.alcoholConsumption === "22+") {
    recommendations.push("Alcohol reduction advice - max 14 units per week");
  }
  
  // Sexual health
  const vaginalScore = getSymptomScore('vaginalSymptoms', data.vaginalSymptoms);
  if (vaginalScore >= 4) {
    recommendations.push("Topical oestrogen for vaginal atrophy - first-line treatment");
    recommendations.push("Non-hormonal vaginal moisturizers and lubricants");
  }
  
  // Follow-up recommendations based on risk level
  if (riskLevel === "amber") {
    recommendations.push("Routine follow-up in 3 months to assess symptom progression");
    recommendations.push("Consider specialist menopause clinic referral if symptoms persist");
  } else if (riskLevel === "green") {
    recommendations.push("Self-management strategies and lifestyle advice");
    recommendations.push("Return if symptoms worsen or new concerning symptoms develop");
  }
  
  // Standard NICE recommendations
  recommendations.push("Provide patient information leaflet on menopause");
  recommendations.push("Ensure up-to-date cervical and breast screening");
  
  return recommendations;
};
