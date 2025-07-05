
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
  }
};

export const calculateTransparentScore = (
  symptomSeverity: string,
  medicalHistory: string[],
  age: number,
  patientPreference: string
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

  // Age factor
  if (age < 60) {
    totalScore += 20;
    breakdown.push({
      factor: 'Age <60',
      points: 20,
      reasoning: 'Lower baseline cardiovascular risk in younger women'
    });
  } else if (age >= 60) {
    totalScore -= 10;
    breakdown.push({
      factor: 'Age ≥60',
      points: -10,
      reasoning: 'Increased cardiovascular risk with age'
    });
    uncertaintyFactors.push('Individual cardiovascular risk assessment required');
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

  // Calculate confidence based on uncertainty factors
  let confidence = 90;
  confidence -= uncertaintyFactors.length * 10;
  confidence = Math.max(50, Math.min(95, confidence));

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    breakdown,
    uncertaintyFactors,
    confidence
  };
};
