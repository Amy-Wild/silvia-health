
// Clinical Evidence Base - Mapped to NICE Guidelines and Published Studies
export interface EvidenceSource {
  guideline: string;
  reference: string;
  grade: 'A' | 'B' | 'C' | 'D';
  studyType: string;
  confidence: number; // 0-100
}

export interface ClinicalRule {
  condition: string;
  recommendation: string;
  evidence: EvidenceSource;
  contraindications: string[];
  uncertaintyFactors: string[];
}

export const NICE_EVIDENCE_BASE: Record<string, ClinicalRule> = {
  'hrt-vasomotor-severe': {
    condition: 'Severe vasomotor symptoms in perimenopause/menopause',
    recommendation: 'HRT first-line treatment',
    evidence: {
      guideline: 'NICE NG23',
      reference: 'Menopause: diagnosis and management (2015, updated 2019)',
      grade: 'A',
      studyType: 'Systematic review + RCTs',
      confidence: 95
    },
    contraindications: ['Active breast cancer', 'Active VTE', 'Acute liver disease'],
    uncertaintyFactors: []
  },
  'hrt-vasomotor-moderate': {
    condition: 'Moderate vasomotor symptoms affecting quality of life',
    recommendation: 'Consider HRT after discussing benefits/risks',
    evidence: {
      guideline: 'NICE NG23',
      reference: 'Menopause: diagnosis and management (2015, updated 2019)',
      grade: 'A',
      studyType: 'Systematic review + RCTs',
      confidence: 85
    },
    contraindications: ['Active breast cancer', 'Active VTE', 'Acute liver disease'],
    uncertaintyFactors: ['Individual risk tolerance', 'Comorbidities']
  },
  'lifestyle-general': {
    condition: 'All menopausal women',
    recommendation: 'Lifestyle interventions for symptom management',
    evidence: {
      guideline: 'NICE NG23 + WHI Study',
      reference: 'Multiple RCTs on diet, exercise, stress management',
      grade: 'A',
      studyType: 'Multiple RCTs',
      confidence: 90
    },
    contraindications: [],
    uncertaintyFactors: ['Individual adherence', 'Baseline fitness level']
  },
  'cbt-psychological': {
    condition: 'Psychological symptoms or vasomotor symptoms',
    recommendation: 'CBT effective for mood and vasomotor symptoms',
    evidence: {
      guideline: 'NICE NG23',
      reference: 'Hunter et al. (2019) - CBT for menopause RCT',
      grade: 'B',
      studyType: 'RCT',
      confidence: 80
    },
    contraindications: [],
    uncertaintyFactors: ['Access to trained therapists', 'Patient motivation']
  },
  'hrt-contraindicated': {
    condition: 'History of breast cancer or VTE',
    recommendation: 'HRT generally contraindicated - consider alternatives',
    evidence: {
      guideline: 'NICE NG23 + MHRA guidance',
      reference: 'Breast cancer: NICE CG164, VTE: multiple cohort studies',
      grade: 'A',
      studyType: 'Cohort studies + Expert consensus',
      confidence: 95
    },
    contraindications: ['All HRT preparations'],
    uncertaintyFactors: ['Time since cancer treatment', 'Individual risk assessment']
  },
  'uti-risk-assessment': {
    condition: 'Recurrent UTIs in menopausal women',
    recommendation: 'Vaginal estrogen reduces UTI recurrence risk',
    evidence: {
      guideline: 'Cochrane Review 2023',
      reference: 'Perrotta et al. (2023) - Estrogen for preventing recurrent UTI',
      grade: 'A',
      studyType: 'Systematic review + Meta-analysis',
      confidence: 92
    },
    contraindications: ['Active breast cancer', 'Unexplained vaginal bleeding'],
    uncertaintyFactors: ['Individual infection patterns', 'Antibiotic resistance history']
  },
  'bone-health-assessment': {
    condition: 'Postmenopausal women at fracture risk',
    recommendation: 'DEXA scan if high risk; consider HRT for bone protection',
    evidence: {
      guideline: 'NICE CG146 + International Osteoporosis Foundation',
      reference: 'FRAX algorithm validation studies (2024)',
      grade: 'A',
      studyType: 'Population cohort studies',
      confidence: 88
    },
    contraindications: [],
    uncertaintyFactors: ['Individual fracture risk factors', 'Family history accuracy']
  },
  'cardiovascular-risk': {
    condition: 'Cardiovascular risk in menopause',
    recommendation: 'HRT timing hypothesis - early initiation preferred',
    evidence: {
      guideline: 'WHI + ELITE studies',
      reference: 'Hodis et al. (2023) - Timing hypothesis validation',
      grade: 'B',
      studyType: 'RCT + Long-term follow-up',
      confidence: 75
    },
    contraindications: ['Established CVD', 'High thrombosis risk'],
    uncertaintyFactors: ['Time since menopause', 'Baseline cardiovascular health']
  }
};

export const calculateTransparentScore = (
  symptomSeverity: string,
  medicalHistory: string[],
  age: number,
  patientPreference: string,
  additionalFactors?: {
    recurringUTIs?: boolean;
    boneHealthRisk?: string;
    cardiovascularRisk?: string;
  }
): {
  score: number;
  breakdown: { factor: string; points: number; reasoning: string }[];
  uncertaintyFactors: string[];
  confidence: number;
} => {
  const breakdown: { factor: string; points: number; reasoning: string }[] = [];
  let totalScore = 0;
  const uncertaintyFactors: string[] = [];
  
  // Base score from symptom severity
  if (symptomSeverity === 'Severe') {
    totalScore += 40;
    breakdown.push({
      factor: 'Severe Symptoms',
      points: 40,
      reasoning: 'NICE NG23: HRT first-line for severe vasomotor symptoms'
    });
  } else if (symptomSeverity === 'Moderate') {
    totalScore += 25;
    breakdown.push({
      factor: 'Moderate Symptoms',
      points: 25,
      reasoning: 'NICE NG23: Consider HRT for moderate symptoms affecting QoL'
    });
    uncertaintyFactors.push('Individual quality of life impact assessment needed');
  } else {
    totalScore += 10;
    breakdown.push({
      factor: 'Mild/No Symptoms',
      points: 10,
      reasoning: 'Limited evidence for HRT in mild symptoms'
    });
    uncertaintyFactors.push('Benefit-risk balance unclear for mild symptoms');
  }

  // Age factor - refined based on latest evidence
  if (age < 50) {
    totalScore += 25;
    breakdown.push({
      factor: 'Age <50 (Early menopause)',
      points: 25,
      reasoning: 'Strong indication for HRT - prevents premature health risks'
    });
  } else if (age < 60) {
    totalScore += 20;
    breakdown.push({
      factor: 'Age 50-59 (Window of opportunity)',
      points: 20,
      reasoning: 'Optimal timing for HRT initiation - cardiovascular protective'
    });
  } else if (age < 65) {
    totalScore += 5;
    breakdown.push({
      factor: 'Age 60-64',
      points: 5,
      reasoning: 'Individual risk-benefit assessment required'
    });
    uncertaintyFactors.push('Cardiovascular risk assessment needed');
  } else {
    totalScore -= 10;
    breakdown.push({
      factor: 'Age ≥65',
      points: -10,
      reasoning: 'Increased risks outweigh benefits for initiation'
    });
    uncertaintyFactors.push('Consider non-hormonal alternatives');
  }

  // Medical history modifiers
  if (medicalHistory.includes('breast-cancer')) {
    totalScore -= 50;
    breakdown.push({
      factor: 'Breast Cancer History',
      points: -50,
      reasoning: 'NICE NG23: HRT generally contraindicated'
    });
  }

  if (medicalHistory.includes('blood-clots')) {
    totalScore -= 30;
    breakdown.push({
      factor: 'VTE History',
      points: -30,
      reasoning: 'Increased thrombotic risk - transdermal route preferred if HRT used'
    });
    uncertaintyFactors.push('Specialist haematology input may be needed');
  }

  // NEW: UTI risk factor
  if (additionalFactors?.recurringUTIs) {
    totalScore += 15;
    breakdown.push({
      factor: 'Recurrent UTIs',
      points: 15,
      reasoning: 'Cochrane 2023: Vaginal estrogen reduces UTI recurrence by 61%'
    });
  }

  // NEW: Bone health risk
  if (additionalFactors?.boneHealthRisk === 'high') {
    totalScore += 20;
    breakdown.push({
      factor: 'High Fracture Risk',
      points: 20,
      reasoning: 'HRT provides significant bone protection - reduces fractures by 30-40%'
    });
  } else if (additionalFactors?.boneHealthRisk === 'moderate') {
    totalScore += 10;
    breakdown.push({
      factor: 'Moderate Fracture Risk',
      points: 10,
      reasoning: 'Consider HRT for bone health benefits alongside symptom relief'
    });
  }

  // NEW: Cardiovascular considerations
  if (additionalFactors?.cardiovascularRisk === 'low' && age < 60) {
    totalScore += 10;
    breakdown.push({
      factor: 'Low CV Risk + Early Menopause',
      points: 10,
      reasoning: 'WHI reanalysis: HRT may be cardioprotective when started early'
    });
  } else if (additionalFactors?.cardiovascularRisk === 'high') {
    totalScore -= 15;
    breakdown.push({
      factor: 'High Cardiovascular Risk',
      points: -15,
      reasoning: 'Increased stroke/VTE risk - careful risk-benefit analysis needed'
    });
    uncertaintyFactors.push('Cardiology consultation may be beneficial');
  }

  // Patient preference modifier
  if (patientPreference === 'hrt') {
    totalScore += 10;
    breakdown.push({
      factor: 'Patient Preference: HRT',
      points: 10,
      reasoning: 'Shared decision-making - patient preference considered'
    });
  } else if (patientPreference === 'non-hrt') {
    totalScore -= 15;
    breakdown.push({
      factor: 'Patient Preference: Non-HRT',
      points: -15,
      reasoning: 'Patient preference for alternatives respected'
    });
  }

  // Calculate confidence based on uncertainty factors and evidence quality
  let confidence = 90;
  confidence -= uncertaintyFactors.length * 8;
  
  // Reduce confidence for edge cases
  if (age > 65 || medicalHistory.length > 2) {
    confidence -= 10;
  }
  
  confidence = Math.max(60, Math.min(95, confidence));

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    breakdown,
    uncertaintyFactors,
    confidence
  };
};

// NEW: UTI Risk Assessment
export const assessUTIRisk = (rawData: any): {
  riskLevel: 'Low' | 'Moderate' | 'High';
  factors: string[];
  recommendation: string;
} => {
  const factors: string[] = [];
  let riskScore = 0;
  
  // Vaginal symptoms increase UTI risk
  if (rawData.vaginalSymptoms === 'severe') {
    riskScore += 3;
    factors.push('Severe vaginal dryness/atrophy');
  } else if (rawData.vaginalSymptoms === 'moderate') {
    riskScore += 2;
    factors.push('Moderate vaginal symptoms');
  }
  
  // Personal history of UTIs
  if (rawData.personalMedicalHistory?.includes('recurrent-utis')) {
    riskScore += 3;
    factors.push('History of recurrent UTIs');
  }
  
  // Diabetes increases risk
  if (rawData.personalMedicalHistory?.includes('diabetes')) {
    riskScore += 2;
    factors.push('Diabetes mellitus');
  }
  
  // Age factor
  if (parseInt(rawData.age || "50") > 65) {
    riskScore += 1;
    factors.push('Advanced age');
  }
  
  let riskLevel: 'Low' | 'Moderate' | 'High';
  let recommendation: string;
  
  if (riskScore >= 5) {
    riskLevel = 'High';
    recommendation = 'Consider vaginal estrogen therapy - reduces UTI recurrence by 61%';
  } else if (riskScore >= 3) {
    riskLevel = 'Moderate';
    recommendation = 'Monitor symptoms; consider vaginal estrogen if UTIs develop';
  } else {
    riskLevel = 'Low';
    recommendation = 'Standard menopause management appropriate';
  }
  
  return { riskLevel, factors, recommendation };
};

// NEW: Bone Health Risk Assessment
export const assessBoneHealthRisk = (rawData: any): {
  riskLevel: 'Low' | 'Moderate' | 'High';
  factors: string[];
  recommendation: string;
  dexaIndicated: boolean;
} => {
  const factors: string[] = [];
  let riskScore = 0;
  
  const age = parseInt(rawData.age || "50");
  
  // Age-based risk
  if (age > 65) {
    riskScore += 3;
    factors.push('Age >65 years');
  } else if (age > 60) {
    riskScore += 2;
    factors.push('Age 60-65 years');
  }
  
  // Early menopause
  if (rawData.menstrualStatus === 'stopped' && age < 45) {
    riskScore += 3;
    factors.push('Premature menopause');
  }
  
  // Family history
  if (rawData.familyHistory?.includes('osteoporosis')) {
    riskScore += 2;
    factors.push('Family history of osteoporosis');
  }
  
  // Lifestyle factors
  if (rawData.smokingStatus === 'current') {
    riskScore += 2;
    factors.push('Current smoking');
  }
  
  if (rawData.exerciseLevel === 'none') {
    riskScore += 1;
    factors.push('Sedentary lifestyle');
  }
  
  // Low BMI
  const bmi = parseFloat(rawData.bmi || "25");
  if (bmi < 19) {
    riskScore += 2;
    factors.push('Low BMI (<19)');
  }
  
  // Medical history
  if (rawData.personalMedicalHistory?.includes('rheumatoid-arthritis')) {
    riskScore += 2;
    factors.push('Rheumatoid arthritis');
  }
  
  let riskLevel: 'Low' | 'Moderate' | 'High';
  let recommendation: string;
  let dexaIndicated: boolean;
  
  if (riskScore >= 5) {
    riskLevel = 'High';
    recommendation = 'DEXA scan recommended; HRT provides significant bone protection';
    dexaIndicated = true;
  } else if (riskScore >= 3) {
    riskLevel = 'Moderate';
    recommendation = 'Consider DEXA scan; HRT may provide bone health benefits';
    dexaIndicated = true;
  } else {
    riskLevel = 'Low';
    recommendation = 'Standard bone health advice; reassess in 5 years';
    dexaIndicated = false;
  }
  
  return { riskLevel, factors, recommendation, dexaIndicated };
};
