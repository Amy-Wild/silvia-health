
// Enhanced clinical validation based on NICE Guidelines NG23
// Evidence-based validation for menopause assessment data

export interface ClinicalValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  clinicalNotes: string[];
}

// Risk assessment scoring based on NICE NG23 + latest evidence
export const calculateEnhancedRiskScore = (data: any): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'urgent';
  factors: string[];
  evidence: string[];
} => {
  let score = 0;
  const factors: string[] = [];
  const evidence: string[] = [];

  // RED FLAGS - Immediate medical attention (NICE NG23)
  if (data.postmenopausalBleeding === 'yes') {
    score += 50;
    factors.push('Postmenopausal bleeding');
    evidence.push('NICE NG23: Urgent referral required - exclude malignancy');
  }

  if (data.unexplainedWeightLoss === 'yes') {
    score += 45;
    factors.push('Unexplained weight loss');
    evidence.push('NICE CG27: Weight loss >5% warrants investigation');
  }

  if (data.severePelvicPain === 'yes') {
    score += 40;
    factors.push('Severe pelvic pain');
    evidence.push('Clinical assessment needed to exclude pathology');
  }

  // AMBER FLAGS - Priority assessment
  if (data.moodSymptoms === 'severe') {
    score += 25;
    factors.push('Severe mood symptoms');
    evidence.push('NICE NG23: Severe psychological symptoms need urgent support');
  }

  // Enhanced scoring for vasomotor symptoms (2024 evidence update)
  if (data.hotFlashFrequency === 'severe' && data.nightSweats === 'severe') {
    score += 20;
    factors.push('Severe vasomotor symptoms');
    evidence.push('NICE NG23 + WHI 2024: Severe symptoms significantly impact QoL - HRT first-line');
  }

  // NEW: UTI risk assessment (Cochrane 2023)
  if (data.vaginalSymptoms === 'severe' && data.personalMedicalHistory?.includes('recurrent-utis')) {
    score += 15;
    factors.push('High UTI risk with severe vaginal symptoms');
    evidence.push('Cochrane 2023: Vaginal estrogen reduces UTI recurrence by 61%');
  }

  // Age-based risk stratification
  const age = parseInt(data.age || '50');
  if (age < 45 && data.menstrualStatus === 'stopped') {
    score += 20;
    factors.push('Premature menopause');
    evidence.push('NICE NG23: Early menopause requires specialist input');
  }

  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'urgent';
  if (score >= 40) level = 'urgent';
  else if (score >= 25) level = 'high';
  else if (score >= 15) level = 'medium';
  else level = 'low';

  return { score, level, factors, evidence };
};

// Validate clinical data completeness and accuracy
export const validateClinicalAssessment = (data: any): ClinicalValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];
  const clinicalNotes: string[] = [];

  // Essential clinical information checks
  if (!data.age) {
    errors.push('Age is required for menopause assessment');
  } else {
    const age = parseInt(data.age);
    if (age < 40) {
      warnings.push('Early menopause assessment - consider specialist referral');
      clinicalNotes.push('Patient under 40 - premature ovarian insufficiency to be excluded');
    }
  }

  // Menstrual status validation
  if (!data.menstrualStatus) {
    errors.push('Menstrual status is essential for diagnosis');
  }

  // Symptom severity cross-validation
  if (data.hotFlashFrequency === 'severe' && !data.vasomotorImpact) {
    warnings.push('Severe symptoms but no impact description - consider quality of life assessment');
  }

  // Medical history completeness
  if (!data.personalMedicalHistory || data.personalMedicalHistory.length === 0) {
    warnings.push('No medical history recorded - ensure contraindications are assessed');
    clinicalNotes.push('Consider screening for contraindications to HRT');
  }

  // BMI calculation and validation
  if (data.height && data.weight) {
    const bmi = parseFloat(data.weight) / Math.pow(parseFloat(data.height) / 100, 2);
    if (bmi < 18.5) {
      warnings.push('BMI <18.5 - increased osteoporosis risk');
      clinicalNotes.push('Low BMI increases fracture risk - consider bone health assessment');
    } else if (bmi > 30) {
      warnings.push('BMI >30 - consider cardiovascular risk assessment');
      clinicalNotes.push('Obesity may affect HRT delivery method choice');
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    clinicalNotes
  };
};

// Evidence-based treatment pathway validation
export const validateTreatmentPathway = (data: any, riskLevel: string): {
  pathway: 'urgent' | 'gp-routine' | 'education' | 'self-care';
  rationale: string[];
  evidence: string[];
} => {
  const rationale: string[] = [];
  const evidence: string[] = [];

  // Urgent pathway triggers
  if (data.postmenopausalBleeding === 'yes') {
    return {
      pathway: 'urgent',
      rationale: ['Postmenopausal bleeding requires urgent investigation'],
      evidence: ['NICE NG23: 2-week wait referral for postmenopausal bleeding']
    };
  }

  // GP routine pathway
  if (data.treatmentPreferences?.includes('hrt') || riskLevel === 'high') {
    rationale.push('HRT interest or high symptom severity');
    evidence.push('NICE NG23: GP assessment for HRT suitability');
    return { pathway: 'gp-routine', rationale, evidence };
  }

  // Education pathway
  if (data.treatmentPreferences?.includes('lifestyle') && riskLevel === 'medium') {
    rationale.push('Lifestyle preference with moderate symptoms');
    evidence.push('NICE NG23: Lifestyle interventions effective for symptom management');
    return { pathway: 'education', rationale, evidence };
  }

  // Default to self-care for low-risk cases
  rationale.push('Low-risk profile suitable for self-management');
  evidence.push('NICE NG23: Self-care appropriate for mild symptoms');
  return { pathway: 'self-care', rationale, evidence };
};
