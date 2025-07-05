
// Security validation utilities for NHS-compliant data handling
export const sanitizeInput = (input: string): string => {
  // Remove potential XSS vectors while preserving clinical data integrity
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

export const validateAge = (age: string): { isValid: boolean; error?: string } => {
  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge < 18 || numAge > 120) {
    return { isValid: false, error: 'Age must be between 18 and 120' };
  }
  return { isValid: true };
};

export const validateHeight = (height: string): { isValid: boolean; error?: string } => {
  const numHeight = parseFloat(height);
  if (isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
    return { isValid: false, error: 'Height must be between 100-250cm' };
  }
  return { isValid: true };
};

export const validateWeight = (weight: string): { isValid: boolean; error?: string } => {
  const numWeight = parseFloat(weight);
  if (isNaN(numWeight) || numWeight < 30 || numWeight > 300) {
    return { isValid: false, error: 'Weight must be between 30-300kg' };
  }
  return { isValid: true };
};

// Clinical data validation based on NHS standards
export const validateClinicalData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Age validation (critical for menopause assessment)
  if (data.age) {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) {
      errors.push(ageValidation.error!);
    }
  }
  
  // BMI component validation
  if (data.height) {
    const heightValidation = validateHeight(data.height);
    if (!heightValidation.isValid) {
      errors.push(heightValidation.error!);
    }
  }
  
  if (data.weight) {
    const weightValidation = validateWeight(data.weight);
    if (!weightValidation.isValid) {
      errors.push(weightValidation.error!);
    }
  }
  
  // Sanitize text inputs
  if (data.primaryConcern) {
    data.primaryConcern = sanitizeInput(data.primaryConcern);
  }
  
  if (data.additionalInfo) {
    data.additionalInfo = sanitizeInput(data.additionalInfo);
  }
  
  return { isValid: errors.length === 0, errors };
};

// Data retention helper - explains localStorage limitations
export const getDataRetentionInfo = () => {
  return {
    currentMethod: 'localStorage',
    limitation: 'Data persists until manually cleared or browser data is deleted',
    nhsRequirement: 'NHS requires automated data deletion after 7 years or patient request',
    recommendation: 'Production system needs server-side database with automated retention policies'
  };
};
