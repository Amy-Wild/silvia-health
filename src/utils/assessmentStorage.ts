
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

interface SessionData {
  riskLevel?: string;
  urgentFlags?: string[];
  clinicalSummary?: any;
  recommendations?: any;
  rawData?: any;
  carePath?: string;
  patientRef?: string;
  dateOfBirth?: string;
  age?: number;
}

export const storeAssessment = async (assessment: StoredAssessment): Promise<boolean> => {
  try {
    console.log("💾 Saving assessment", assessment.session_id, assessment);
    
    // Store in Supabase if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log("👤 Supabase user:", user ? `${user.email} (${user.id})` : 'Not authenticated');
    
    if (user) {
      console.log("🔄 Attempting to save to Supabase assessment_links table...");
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
        console.error('❌ Error storing assessment in Supabase:', error);
        console.log("🔄 Falling back to localStorage...");
        storeInLocalStorage(assessment);
        return true;
      } else {
        console.log('✅ Assessment successfully stored in Supabase');
      }
    } else {
      console.log('⚠️ No user authenticated, storing in localStorage');
      storeInLocalStorage(assessment);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error storing assessment:', error);
    console.log("🔄 Falling back to localStorage...");
    storeInLocalStorage(assessment);
    return true;
  }
};

const storeInLocalStorage = (assessment: StoredAssessment) => {
  console.log('💾 Storing assessment in localStorage', assessment.session_id);
  localStorage.setItem(`assessment_${assessment.session_id}`, JSON.stringify(assessment));
  
  const existingIds = getStoredAssessmentIds();
  if (!existingIds.includes(assessment.session_id)) {
    existingIds.push(assessment.session_id);
    localStorage.setItem('assessment_ids', JSON.stringify(existingIds));
  }
  console.log('✅ Stored in localStorage. Current assessment IDs:', existingIds);
};

const getStoredAssessmentIds = (): string[] => {
  const stored = localStorage.getItem('assessment_ids');
  return stored ? JSON.parse(stored) : [];
};

const isSessionData = (data: any): data is SessionData => {
  return data && typeof data === 'object';
};

export const loadAllAssessments = async (): Promise<StoredAssessment[]> => {
  try {
    console.log('🔍 Loading all assessments...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('🔍 Loading assessments from Supabase for user:', user.email, user.id);
      const { data, error } = await supabase
        .from('assessment_links')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      console.log('📊 Raw Supabase query result:', { data, error });

      if (!error && data) {
        console.log('✅ Fetched assessments from Supabase:', data);
        const processedData = data.map(item => {
          const sessionData: SessionData = isSessionData(item.session_data) ? item.session_data : {};
          
          return {
            id: item.id,
            session_id: item.id,
            patient_ref: item.patient_identifier,
            completed_at: item.completed_at || new Date().toISOString(),
            risk_level: sessionData.riskLevel || 'unknown',
            urgent_flags: sessionData.urgentFlags || [],
            clinical_summary: sessionData.clinicalSummary || {},
            recommendations: sessionData.recommendations || {},
            raw_data: sessionData.rawData || {},
            care_path: sessionData.carePath,
            date_of_birth: sessionData.dateOfBirth,
            age: sessionData.age,
            created_by: item.created_by
          };
        });
        console.log('✅ Processed Supabase data:', processedData);
        return processedData;
      } else {
        console.error('❌ Error loading from Supabase:', error);
      }
    }
    
    console.log('🔍 Loading assessments from localStorage');
    return loadFromLocalStorage();
  } catch (error) {
    console.error('❌ Error loading assessments:', error);
    return loadFromLocalStorage();
  }
};

const loadFromLocalStorage = (): StoredAssessment[] => {
  console.log('🔍 Loading from localStorage...');
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
  
  console.log('📋 Loading assessments from localStorage, found IDs:', assessmentIds);
  
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
        console.error(`❌ Error parsing assessment ${sessionId}:`, error);
      }
    }
  }
  
  console.log('✅ Loaded assessments from localStorage:', assessments);
  return assessments.sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );
};

export const loadSingleAssessment = async (sessionId: string): Promise<StoredAssessment | null> => {
  try {
    console.log('🔍 Loading single assessment for sessionId:', sessionId);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('🔍 Checking Supabase for assessment...');
      const { data, error } = await supabase
        .from('assessment_links')
        .select('*')
        .eq('id', sessionId)
        .eq('status', 'completed')
        .single();

      console.log('📊 Supabase single query result:', { data, error });

      if (!error && data) {
        console.log('✅ Found assessment in Supabase:', data);
        const sessionData: SessionData = isSessionData(data.session_data) ? data.session_data : {};
        
        return {
          id: data.id,
          session_id: data.id,
          patient_ref: data.patient_identifier,
          completed_at: data.completed_at || new Date().toISOString(),
          risk_level: sessionData.riskLevel || 'unknown',
          urgent_flags: sessionData.urgentFlags || [],
          clinical_summary: sessionData.clinicalSummary || {},
          recommendations: sessionData.recommendations || {},
          raw_data: sessionData.rawData || {},
          care_path: sessionData.carePath,
          date_of_birth: sessionData.dateOfBirth,
          age: sessionData.age,
          created_by: data.created_by
        };
      }
    }
    
    console.log('🔍 Trying localStorage for sessionId:', sessionId);
    const stored = localStorage.getItem(`assessment_${sessionId}`);
    if (stored) {
      const assessment = JSON.parse(stored);
      console.log('✅ Found assessment in localStorage:', assessment);
      return {
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
      };
    }
    
    console.log('❌ No assessment found for sessionId:', sessionId);
    return null;
  } catch (error) {
    console.error('❌ Error loading single assessment:', error);
    return null;
  }
};
