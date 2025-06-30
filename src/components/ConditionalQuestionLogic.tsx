
interface AssessmentData {
  age?: string;
  menstrualStatus?: string;
  periodsStopped?: string;
  postmenopausalBleeding?: string;
  hotFlashFrequency?: string;
  nightSweats?: string;
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
    
    case "utiFrequency":
      return parseInt(data.age || "0") > 50;
    
    case "sleepProblems":
      return data.hotFlashFrequency !== "none" || data.nightSweats !== "none";
    
    case "moodSymptoms":
      return data.menstrualStatus === "irregular" || data.menstrualStatus === "stopped";
    
    case "libidoChanges":
      return data.menstrualStatus !== "regular";
    
    case "weightGain":
      return data.menstrualStatus === "irregular" || data.menstrualStatus === "stopped";
    
    case "jointPains":
      return parseInt(data.age || "0") > 45;
    
    case "headacheChanges":
      return data.menstrualStatus === "irregular";
    
    case "skinChanges":
      return data.menstrualStatus !== "regular";
    
    default:
      return true;
  }
};

export const getQuestionWeight = (questionId: string, answer: any): number => {
  const weights: { [key: string]: { [key: string]: number } } = {
    postmenopausalBleeding: { yes: 10, no: 0 },
    hotFlashFrequency: { none: 0, mild: 2, moderate: 4, severe: 6 },
    nightSweats: { none: 0, mild: 2, moderate: 4, severe: 6 },
    moodSymptoms: { none: 0, mild: 1, moderate: 3, severe: 5 },
    smokingStatus: { never: 0, former: 1, current: 3 },
    alcoholConsumption: { none: 0, "1-7": 0, "8-14": 1, "15-21": 2, "22+": 3 },
    exerciseLevel: { high: 0, moderate: 1, light: 2, none: 3 }
  };
  
  return weights[questionId]?.[answer] || 0;
};

export const calculateRiskLevel = (data: AssessmentData): string => {
  // Red flags that immediately trigger red risk level
  if (data.postmenopausalBleeding === "yes") return "red";
  if (data.unexplainedWeightLoss === "yes") return "red";
  if (data.severePelvicPain === "yes") return "red";
  
  // Calculate weighted score
  let score = 0;
  Object.keys(data).forEach(key => {
    score += getQuestionWeight(key, data[key]);
  });
  
  // Age-based risk adjustment
  const age = parseInt(data.age || "0");
  if (age > 60) score += 2;
  else if (age > 50) score += 1;
  
  // BMI-based risk adjustment
  const bmi = parseFloat(data.bmi || "0");
  if (bmi > 35) score += 3;
  else if (bmi > 30) score += 2;
  else if (bmi > 25) score += 1;
  
  if (score >= 15) return "red";
  if (score >= 8) return "amber";
  return "green";
};
