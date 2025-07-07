
import { supabase } from "@/integrations/supabase/client";

export interface StoredAssessment {
  id: string;
  session_id: string;
  patient_ref: string;
  date_of_birth?: string;
  age?: number;
  completed_at: string;
  risk_level: string;
  urgent_flags: string[];
  clinical_summary: any;
  recommendations: any;
  raw_data: any;
  care_path?: string;
  created_by?: string;
}

export const storeAssessment = async (assessment: StoredAssessment): Promise<boolean> => {
  try {
    // Store in Supabase if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('assessment_links')
        .insert({
          id: assessment.session_id,
          patient_identifier: assessment.patient_ref,
          created_by: user.id,
          status: 'completed',
          completed_at: assessment.completed_at,
          session_data: {
            riskLevel: assessment.risk_level,
            urgentFlags: assessment.urgent_flags,
            clinicalSummary: assessment.clinical_summary,
            recommendations: assessment.recommendations,
            rawData: assessment.raw_data,
            carePath: assessment.care_path,
            patientRef: assessment.patient_ref,
            dateOfBirth: assessment.date_of_birth,
            age: assessment.age
          }
        });

      if (error) {
        console.error('Error storing assessment in Supabase:', error);
        // Fall back to localStorage
        storeInLocalStorage(assessment);
        return true;
      }
    } else {
      // Not authenticated, store in localStorage
      storeInLocalStorage(assessment);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing assessment:', error);
    storeInLocalStorage(assessment);
    return true;
  }
};

const storeInLocalStorage = (assessment: StoredAssessment) => {
  // Store individual assessment with unique key
  localStorage.setItem(`assessment_${assessment.session_id}`, JSON.stringify(assessment));
  
  // Also maintain a list of all assessment IDs
  const existingIds = getStoredAssessmentIds();
  if (!existingIds.includes(assessment.session_id)) {
    existingIds.push(assessment.session_id);
    localStorage.setItem('assessment_ids', JSON.stringify(existingIds));
  }
};

const getStoredAssessmentIds = (): string[] => {
  const stored = localStorage.getItem('assessment_ids');
  return stored ? JSON.parse(stored) : [];
};

export const loadAllAssessments = async (): Promise<StoredAssessment[]> => {
  try {
    // Try to load from Supabase first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('assessment_links')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (!error && data) {
        return data.map(item => ({
          id: item.id,
          session_id: item.id,
          patient_ref: item.patient_identifier,
          completed_at: item.completed_at || new Date().toISOString(),
          risk_level: item.session_data?.riskLevel || 'unknown',
          urgent_flags: item.session_data?.urgentFlags || [],
          clinical_summary: item.session_data?.clinicalSummary || {},
          recommendations: item.session_data?.recommendations || {},
          raw_data: item.session_data?.rawData || {},
          care_path: item.session_data?.carePath,
          date_of_birth: item.session_data?.dateOfBirth,
          age: item.session_data?.age,
          created_by: item.created_by
        }));
      }
    }
    
    // Fall back to localStorage
    return loadFromLocalStorage();
  } catch (error) {
    console.error('Error loading assessments:', error);
    return loadFromLocalStorage();
  }
};

const loadFromLocalStorage = (): StoredAssessment[] => {
  const assessments: StoredAssessment[] = [];
  const assessmentIds = getStoredAssessmentIds();
  
  // Also check for any assessments stored with the old key pattern
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('assessment_') && key !== 'assessment_ids') {
      const sessionId = key.replace('assessment_', '');
      if (!assessmentIds.includes(sessionId)) {
        assessmentIds.push(sessionId);
      }
    }
  }
  
  // Load all assessments
  for (const sessionId of assessmentIds) {
    const stored = localStorage.getItem(`assessment_${sessionId}`);
    if (stored) {
      try {
        const assessment = JSON.parse(stored);
        assessments.push({
          id: assessment.sessionId || sessionId,
          session_id: assessment.sessionId || sessionId,
          patient_ref: assessment.patientRef || 'Unknown Patient',
          completed_at: assessment.completedAt || new Date().toISOString(),
          risk_level: assessment.riskLevel || 'unknown',
          urgent_flags: assessment.urgentFlags || [],
          clinical_summary: assessment.clinicalSummary || {},
          recommendations: assessment.recommendations || {},
          raw_data: assessment.rawData || {},
          care_path: assessment.carePath,
          date_of_birth: assessment.dateOfBirth,
          age: assessment.age
        });
      } catch (error) {
        console.error(`Error parsing assessment ${sessionId}:`, error);
      }
    }
  }
  
  // Sort by completion date (most recent first)
  return assessments.sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );
};
