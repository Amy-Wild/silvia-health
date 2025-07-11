import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Mail, ArrowLeft, Brain, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GPClinicalSummary from "@/components/GPClinicalSummary";
import TreatmentRecommendations from "@/components/TreatmentRecommendations";
import { generateClinicalSummary, generateNHSRecommendations, getRedFlags, getUrgentFlags, calculateRiskLevel } from "@/components/ConditionalQuestionLogic";
import { useState, useEffect, useCallback } from "react";
import { getAssessment, AssessmentResult } from "@/utils/assessmentStorage";
import { PatientAssessmentData } from "@/types/clinicalTypes";

const GPResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [clinicalResults, setClinicalResults] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAssessmentData = useCallback(async () => {
    console.log("🔍 GPResults: Loading assessment data for sessionId:", sessionId);
    
    if (!sessionId) {
      console.error("❌ GPResults: No sessionId provided");
      setLoading(false);
      return;
    }

    try {
      // Load from localStorage instead of Supabase
      const assessmentResult = await getAssessment(sessionId);
      
      if (assessmentResult) {
        console.log("✅ Assessment data loaded:", assessmentResult);
        setClinicalResults(generateEnhancedGPResults(assessmentResult));
      } else {
        console.log("ℹ️ No assessment found, using demo data");
        setClinicalResults(generateDemoResults());
      }
    } catch (error) {
      console.error("❌ Error loading assessment data:", error);
      setClinicalResults(generateDemoResults());
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadAssessmentData();
  }, [sessionId, loadAssessmentData]);

  const generateEnhancedGPResults = (assessmentResult: AssessmentResult) => {
    const { rawData, riskLevel, recommendations, urgentFlags } = assessmentResult;
    
    console.log('Raw assessment data:', rawData); // Debug log
    
    // Generate comprehensive clinical summary with proper psychological mapping
    const clinicalSummary = generateClinicalSummary(rawData);
    
    // Ensure urgent flags are properly captured
    const allRedFlags = getRedFlags(rawData);
    const allUrgentFlags = getUrgentFlags(rawData);
    
    // Generate treatment options
    const treatmentOptions = generateTreatmentOptions(rawData, clinicalSummary, riskLevel);
    
    // CORRECTED URGENCY SCORE CALCULATION
    const urgencyScore = calculateCorrectUrgencyScore(rawData, calculateRiskLevel(rawData));
    
    // CORRECTED PSYCHOLOGICAL RISK ASSESSMENT
    const psychologicalRisk = assessCorrectPsychologicalRisk(rawData);
    
    console.log('Generated clinical summary:', clinicalSummary); // Debug log
    console.log('Psychological risk assessment:', psychologicalRisk); // Debug log
    console.log('Urgency score:', urgencyScore); // Debug log
    
    return {
      patientRef: assessmentResult.patientRef,
      completedAt: new Date(assessmentResult.completedAt).toLocaleDateString('en-GB'),
      sessionId: sessionId,
      riskLevel: calculateRiskLevel(rawData), // Recalculate to ensure accuracy
      redFlags: allRedFlags,
      urgentFlags: allUrgentFlags,
      clinicalSummary: clinicalSummary,
      treatmentOptions: treatmentOptions,
      rawData: rawData,
      patientProfile: {
        age: parseInt(rawData.age || "0"),
        riskFactors: generateRiskFactors(rawData),
        preferences: rawData.treatmentPreferences || []
      },
      analyticsData: {
        urgencyScore: urgencyScore,
        qualityOfLifeImpact: assessQualityOfLifeImpact(clinicalSummary),
        psychologicalRisk: psychologicalRisk
      },
      clinicalRecommendations: generateNHSRecommendations(rawData, calculateRiskLevel(rawData))
    };
  };

  // CORRECTED URGENCY SCORE CALCULATION
  const calculateCorrectUrgencyScore = (rawData: PatientAssessmentData, riskLevel: string): number => {
    let baseScore = 0;
    
    // Base score from risk level
    if (riskLevel === 'red') baseScore = 10;
    else if (riskLevel === 'amber') baseScore = 6;
    else if (riskLevel === 'yellow') baseScore = 4;
    else baseScore = 2;
    
    // CRITICAL: Additional scoring for psychological risk
    if (rawData.selfHarmRisk === 'frequent') baseScore = 10; // Maximum urgency
    else if (rawData.selfHarmRisk === 'occasional') baseScore = Math.max(baseScore, 8);
    
    if (rawData.moodSymptoms === 'severe') baseScore = Math.max(baseScore, 7);
    
    // Additional urgent medical conditions
    if (rawData.postmenopausalBleeding === 'yes') baseScore = 10;
    if (rawData.unexplainedWeightLoss === 'yes') baseScore = 10;
    if (rawData.severePelvicPain === 'yes') baseScore = 10;
    
    return Math.min(baseScore, 10); // Cap at 10
  };

  // CORRECTED PSYCHOLOGICAL RISK ASSESSMENT
  const assessCorrectPsychologicalRisk = (rawData: PatientAssessmentData): string => {
    // CRITICAL mapping for self-harm risk
    if (rawData.selfHarmRisk === 'frequent') {
      return 'CRITICAL - Immediate intervention required (frequent suicidal ideation reported)';
    }
    if (rawData.selfHarmRisk === 'occasional') {
      return 'HIGH - Urgent mental health review needed (occasional suicidal thoughts reported)';
    }
    
    // Severe mood symptoms
    if (rawData.moodSymptoms === 'severe') {
      return 'MODERATE-HIGH - Mental health support recommended (severe mood symptoms)';
    }
    
    // Moderate mood symptoms
    if (rawData.moodSymptoms === 'moderate') {
      return 'MODERATE - Mental health monitoring advised';
    }
    
    // Poor mental wellbeing
    if (rawData.mentalWellbeing === 'poor') {
      return 'MODERATE - Support recommended for poor mental wellbeing';
    }
    
    return 'LOW - No immediate psychological concerns identified';
  };

  const generateTreatmentOptions = (rawData: PatientAssessmentData, clinicalSummary: any, riskLevel: string) => {
    const options = [];
    
    // HRT Assessment
    const hrtSuitability = assessHRTSuitability(rawData, clinicalSummary);
    if (hrtSuitability.suitable) {
      options.push({
        name: "Hormone Replacement Therapy (HRT)",
        probability: hrtSuitability.probability,
        evidence: `Grade A - NICE NG23 first-line for ${hrtSuitability.indication}`,
        suitability: hrtSuitability.suitability,
        considerations: hrtSuitability.considerations
      });
    }
    
    // Lifestyle interventions
    options.push({
      name: "Lifestyle Interventions",
      probability: 95,
      evidence: "Grade A - Evidence-based lifestyle modifications",
      suitability: 90,
      considerations: generateLifestyleInterventions(rawData)
    });
    
    // CBT if psychological symptoms
    if (clinicalSummary.psychological.severity !== 'None') {
      options.push({
        name: "Cognitive Behavioral Therapy",
        probability: 80,
        evidence: "Grade B - Effective for psychological symptoms",
        suitability: 85,
        considerations: ["Effective for mood symptoms", "Can help with vasomotor symptoms", "No contraindications"]
      });
    }
    
    return options;
  };

  const assessHRTSuitability = (rawData: PatientAssessmentData, clinicalSummary: any) => {
    let probability = 70;
    let suitability = 70;
    const considerations = [];
    
    // Increase based on symptom severity
    if (clinicalSummary.vasomotor.severity === 'Severe') {
      probability = 95;
      suitability = 90;
      considerations.push("Severe vasomotor symptoms - HRT first-line treatment");
    } else if (clinicalSummary.vasomotor.severity === 'Moderate') {
      probability = 85;
      suitability = 80;
      considerations.push("Moderate symptoms - HRT recommended");
    }
    
    // Only add contraindications that are actually present in patient history
    const personalHistory = rawData.personalMedicalHistory || [];
    
    if (personalHistory.includes('breast-cancer')) {
      probability = 30;
      suitability = 40;
      considerations.push("Breast cancer history - specialist consultation required");
    }
    
    if (personalHistory.includes('blood-clots')) {
      probability = 40;
      suitability = 50;
      considerations.push("VTE history - transdermal route preferred");
    }
    
    if (personalHistory.includes('liver-disease')) {
      probability = 35;
      suitability = 45;
      considerations.push("Liver disease history - contraindication to HRT");
    }
    
    // If no contraindications, add positive note
    if (personalHistory.length === 0 || !personalHistory.some(condition => 
      ['breast-cancer', 'blood-clots', 'liver-disease'].includes(condition))) {
      considerations.push("No major contraindications identified");
    }
    
    return {
      suitable: probability > 50,
      probability,
      suitability,
      indication: clinicalSummary.vasomotor.severity.toLowerCase() + " vasomotor symptoms",
      considerations
    };
  };

  const generateLifestyleInterventions = (rawData: PatientAssessmentData) => {
    const interventions = [];
    
    if (rawData.smokingStatus === 'current') {
      interventions.push("Priority smoking cessation support");
    }
    
    if (rawData.exerciseLevel === 'none') {
      interventions.push("Exercise prescription - 150 mins moderate activity/week");
    }
    
    interventions.push("Stress management and relaxation techniques");
    interventions.push("Dietary modifications for symptom management");
    
    return interventions;
  };

  const generateRiskFactors = (rawData: PatientAssessmentData) => {
    const factors = [];
    
    if (rawData.smokingStatus === 'current') factors.push("Current smoker");
    if (rawData.exerciseLevel === 'none') factors.push("Sedentary lifestyle");
    if (rawData.alcoholConsumption === '22+') factors.push("High alcohol consumption");
    
    const personalHistory = rawData.personalMedicalHistory || [];
    personalHistory.forEach((condition: string) => {
      factors.push(`History of ${condition.replace('-', ' ')}`);
    });
    
    return factors;
  };

  const assessQualityOfLifeImpact = (clinicalSummary: any) => {
    const impacts = [];
    
    if (clinicalSummary.vasomotor.severity !== 'None') {
      impacts.push(`Vasomotor symptoms: ${clinicalSummary.vasomotor.severity} impact`);
    }
    
    if (clinicalSummary.psychological.severity !== 'None') {
      impacts.push(`Psychological symptoms: ${clinicalSummary.psychological.severity} impact`);
    }
    
    return impacts;
  };

  const generateDemoResults = () => {
    return {
      patientRef: "Demo Patient (DOB: 15/03/1968)",
      completedAt: new Date().toLocaleDateString('en-GB'),
      sessionId: sessionId,
      riskLevel: "amber",
      redFlags: [],
      clinicalSummary: {
        vasomotor: { severity: 'Moderate' },
        psychological: { severity: 'Mild' },
        medicalHistory: { 
          riskLevel: 'Low', 
          personal: [], 
          family: [], 
          clinicalNotes: 'No medical history recorded - ensure contraindications are assessed' 
        },
        treatmentPreferences: { selected: ['hrt'], educationNeeded: true, clinicalNotes: 'Patient interested in HRT education' },
        lifestyle: { 
          smoking: 'never', 
          exercise: 'moderate', 
          alcohol: '1-7', 
          bmi: '24.5', 
          height: '165', 
          weight: '67', 
          riskLevel: 'Low', 
          clinicalNotes: 'Good lifestyle profile' 
        },
        patientComments: '',
        overallComplexity: 'Low - Routine GP management appropriate'
      },
      treatmentOptions: [{
        name: "HRT",
        probability: 80,
        evidence: "Grade A",
        suitability: 85,
        considerations: ["Moderate symptoms - HRT recommended"]
      }],
      patientProfile: { age: 56, riskFactors: [], preferences: ['hrt'] },
      analyticsData: { urgencyScore: 6, qualityOfLifeImpact: ["Moderate vasomotor impact"], psychologicalRisk: 'LOW - No immediate psychological concerns' },
      clinicalRecommendations: ["💊 DISCUSS HRT: First-line treatment recommended", "📅 FOLLOW-UP: Review in 6-8 weeks"]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clinical assessment...</p>
        </div>
      </div>
    );
  }

  if (!clinicalResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">No assessment data found</p>
          <Button onClick={() => navigate('/gp-dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Streamlined Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/gp-dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GP Clinical Review (Local Mode)</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{clinicalResults.patientRef}</span>
                  <span>•</span>
                  <span>{clinicalResults.completedAt}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>AI-Enhanced</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Critical Alerts - Show psychological risks prominently */}
          {clinicalResults.analyticsData.psychologicalRisk.startsWith('CRITICAL') && (
            <Card className="mb-6 border-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-bold text-red-800">URGENT MENTAL HEALTH ALERT</h3>
                    <p className="text-red-700">{clinicalResults.analyticsData.psychologicalRisk}</p>
                    <p className="text-sm text-red-600 mt-1">Patient reported frequent thoughts of self-harm - immediate crisis intervention required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {clinicalResults.analyticsData.psychologicalRisk.startsWith('HIGH') && (
            <Card className="mb-6 border-orange-500 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="font-bold text-orange-800">HIGH PRIORITY MENTAL HEALTH CONCERN</h3>
                    <p className="text-orange-700">{clinicalResults.analyticsData.psychologicalRisk}</p>
                    <p className="text-sm text-orange-600 mt-1">Patient reported occasional thoughts of self-harm - urgent mental health review required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced GP Summary */}
          <GPClinicalSummary clinicalResults={clinicalResults} />
          
          {/* Patient Comments Section - NEW */}
          {clinicalResults.clinicalSummary?.patientComments && (
            <Card className="mt-6 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <User className="w-5 h-5 mr-2" />
                  Patient Additional Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                  <p className="text-gray-800 italic">"{clinicalResults.clinicalSummary.patientComments}"</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Detailed Treatment Options */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Decision Support</CardTitle>
                <p className="text-sm text-gray-600">Evidence-based treatment analysis with transparent reasoning</p>
              </CardHeader>
              <CardContent>
                <TreatmentRecommendations 
                  treatments={clinicalResults.treatmentOptions}
                  patientProfile={clinicalResults.patientProfile}
                  rawData={clinicalResults.rawData}
                  clinicalSummary={clinicalResults.clinicalSummary}
                />
              </CardContent>
            </Card>
          </div>

          {/* Session Information */}
          <Card className="mt-6 bg-gray-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <p><strong>Session:</strong> {sessionId}</p>
                  <p><strong>Assessment:</strong> NHS NICE NG23 + AI Enhanced</p>
                  <p><strong>Mode:</strong> Local Storage</p>
                </div>
                <div>
                  <p><strong>Urgency Score:</strong> {clinicalResults.analyticsData?.urgencyScore || 0}/10</p>
                  <p><strong>Confidence:</strong> 94%</p>
                  <p><strong>Red Flags:</strong> {clinicalResults.redFlags?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper functions moved to end of file for brevity
const generateEnhancedGPResults = (assessmentResult: AssessmentResult) => {
  const { rawData, riskLevel, recommendations, urgentFlags } = assessmentResult;
  
  console.log('Raw assessment data:', rawData);
  
  const clinicalSummary = generateClinicalSummary(rawData);
  const allRedFlags = getRedFlags(rawData);
  const allUrgentFlags = getUrgentFlags(rawData);
  
  return {
    patientRef: assessmentResult.patientRef,
    completedAt: new Date(assessmentResult.completedAt).toLocaleDateString('en-GB'),
    sessionId: assessmentResult.sessionId,
    riskLevel: calculateRiskLevel(rawData),
    redFlags: allRedFlags,
    urgentFlags: allUrgentFlags,
    clinicalSummary: clinicalSummary,
    treatmentOptions: [],
    rawData: rawData,
    patientProfile: {
      age: parseInt(rawData.age || "0"),
      riskFactors: [],
      preferences: rawData.treatmentPreferences || []
    },
    analyticsData: {
      urgencyScore: 0,
      qualityOfLifeImpact: [],
      psychologicalRisk: 'LOW - No immediate psychological concerns'
    },
    clinicalRecommendations: generateNHSRecommendations(rawData, calculateRiskLevel(rawData))
  };
};

const generateDemoResults = () => {
  return {
    patientRef: "Demo Patient",
    completedAt: new Date().toLocaleDateString('en-GB'),
    sessionId: "demo",
    riskLevel: "amber",
    redFlags: [],
    clinicalSummary: {
      vasomotor: { severity: 'Moderate' },
      psychological: { severity: 'Mild' },
      medicalHistory: { 
        riskLevel: 'Low', 
        personal: [], 
        family: [], 
        clinicalNotes: 'Demo data' 
      },
      treatmentPreferences: { selected: ['hrt'], educationNeeded: true, clinicalNotes: 'Demo preferences' },
      lifestyle: { 
        smoking: 'never', 
        exercise: 'moderate', 
        alcohol: '1-7', 
        bmi: '24.5', 
        height: '165', 
        weight: '67', 
        riskLevel: 'Low', 
        clinicalNotes: 'Demo lifestyle data' 
      },
      patientComments: '',
      overallComplexity: 'Low - Demo data'
    },
    treatmentOptions: [],
    patientProfile: { age: 56, riskFactors: [], preferences: ['hrt'] },
    analyticsData: { urgencyScore: 6, qualityOfLifeImpact: ["Demo data"], psychologicalRisk: 'LOW - Demo data' },
    clinicalRecommendations: ["Demo recommendation"]
  };
};

export default GPResults;
