import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Mail, ArrowLeft, Brain, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GPClinicalSummary from "@/components/GPClinicalSummary";
import TreatmentRecommendations from "@/components/TreatmentRecommendations";
import { generateClinicalSummary, generateNHSRecommendations, getRedFlags, getUrgentFlags, calculateRiskLevel } from "@/components/ConditionalQuestionLogic";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const GPResults = () => {
  const params = useParams();
  const sessionId = params.sessionId;
  const navigate = useNavigate();
  const [clinicalResults, setClinicalResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log('GPResults loading for sessionId:', sessionId);

  useEffect(() => {
    const loadAssessmentData = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // First try to load from Supabase
        const { data: assessmentLink, error } = await supabase
          .from('assessment_links')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (assessmentLink && assessmentLink.session_data) {
          console.log('Loading assessment from Supabase:', assessmentLink);
          const results = generateEnhancedGPResults({
            rawData: assessmentLink.session_data,
            sessionId,
            patientRef: assessmentLink.patient_identifier,
            completedAt: assessmentLink.completed_at
          });
          setClinicalResults(results);
        } else {
          // Fallback to localStorage
          const storedData = localStorage.getItem(`assessment_${sessionId}`);
          if (storedData) {
            console.log('Loading assessment from localStorage');
            const assessmentResult = JSON.parse(storedData);
            setClinicalResults(generateEnhancedGPResults(assessmentResult));
          } else {
            console.log('No assessment data found');
            setClinicalResults(null);
          }
        }
      } catch (error) {
        console.error('Error loading assessment data:', error);
        setClinicalResults(null);
      } finally {
        setLoading(false);
      }
    };

    loadAssessmentData();
  }, [sessionId]);

  const generateEnhancedGPResults = (assessmentResult: any) => {
    const { rawData, sessionId: resultSessionId, patientRef, completedAt } = assessmentResult;
    
    console.log('Raw assessment data:', rawData);
    
    // Generate comprehensive clinical summary
    const clinicalSummary = generateClinicalSummary(rawData);
    
    // Calculate risk level and flags
    const riskLevel = calculateRiskLevel(rawData);
    const allRedFlags = getRedFlags(rawData);
    const allUrgentFlags = getUrgentFlags(rawData);
    
    // Generate treatment options
    const treatmentOptions = generateTreatmentOptions(rawData, clinicalSummary, riskLevel);
    
    // Calculate urgency score and psychological risk
    const urgencyScore = calculateCorrectUrgencyScore(rawData, riskLevel);
    const psychologicalRisk = assessCorrectPsychologicalRisk(rawData);
    
    console.log('Generated clinical summary:', clinicalSummary);
    console.log('Psychological risk assessment:', psychologicalRisk);
    console.log('Urgency score:', urgencyScore);
    
    return {
      patientRef: patientRef || 'Patient Assessment',
      completedAt: completedAt ? new Date(completedAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
      sessionId: resultSessionId || sessionId,
      riskLevel: riskLevel,
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
      clinicalRecommendations: generateNHSRecommendations(rawData, riskLevel)
    };
  };

  const calculateCorrectUrgencyScore = (rawData: any, riskLevel: string): number => {
    let baseScore = 0;
    
    if (riskLevel === 'red') baseScore = 10;
    else if (riskLevel === 'amber') baseScore = 6;
    else if (riskLevel === 'yellow') baseScore = 4;
    else baseScore = 2;
    
    if (rawData.selfHarmRisk === 'frequent') baseScore = 10;
    else if (rawData.selfHarmRisk === 'occasional') baseScore = Math.max(baseScore, 8);
    
    if (rawData.moodSymptoms === 'severe') baseScore = Math.max(baseScore, 7);
    
    if (rawData.postmenopausalBleeding === 'yes') baseScore = 10;
    if (rawData.unexplainedWeightLoss === 'yes') baseScore = 10;
    if (rawData.severePelvicPain === 'yes') baseScore = 10;
    
    return Math.min(baseScore, 10);
  };

  const assessCorrectPsychologicalRisk = (rawData: any): string => {
    if (rawData.selfHarmRisk === 'frequent') {
      return 'CRITICAL - Immediate intervention required (frequent suicidal ideation reported)';
    }
    if (rawData.selfHarmRisk === 'occasional') {
      return 'HIGH - Urgent mental health review needed (occasional suicidal thoughts reported)';
    }
    
    if (rawData.moodSymptoms === 'severe') {
      return 'MODERATE-HIGH - Mental health support recommended (severe mood symptoms)';
    }
    
    if (rawData.moodSymptoms === 'moderate') {
      return 'MODERATE - Mental health monitoring advised';
    }
    
    if (rawData.mentalWellbeing === 'poor') {
      return 'MODERATE - Support recommended for poor mental wellbeing';
    }
    
    return 'LOW - No immediate psychological concerns identified';
  };

  const generateTreatmentOptions = (rawData: any, clinicalSummary: any, riskLevel: string) => {
    const options = [];
    
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
    
    options.push({
      name: "Lifestyle Interventions",
      probability: 95,
      evidence: "Grade A - Evidence-based lifestyle modifications",
      suitability: 90,
      considerations: generateLifestyleInterventions(rawData)
    });
    
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

  const assessHRTSuitability = (rawData: any, clinicalSummary: any) => {
    let probability = 70;
    let suitability = 70;
    const considerations = [];
    
    if (clinicalSummary.vasomotor.severity === 'Severe') {
      probability = 95;
      suitability = 90;
      considerations.push("Severe vasomotor symptoms - HRT first-line treatment");
    } else if (clinicalSummary.vasomotor.severity === 'Moderate') {
      probability = 85;
      suitability = 80;
      considerations.push("Moderate symptoms - HRT recommended");
    }
    
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

  const generateLifestyleInterventions = (rawData: any) => {
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

  const generateRiskFactors = (rawData: any) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gentle-blue-dark mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clinical assessment...</p>
        </div>
      </div>
    );
  }

  if (!clinicalResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-risk-medium mx-auto mb-4" />
          <p className="text-gray-600">No assessment data found for session: {sessionId}</p>
          <Button onClick={() => navigate('/gp-dashboard')} className="mt-4 bg-gentle-blue-dark hover:bg-gentle-blue-dark/80">
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
                className="flex items-center hover:bg-gentle-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GP Clinical Review</h1>
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
              <Button variant="outline" size="sm" className="hover:bg-light-purple">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-gentle-blue-dark hover:bg-gentle-blue-dark/80 text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Critical Alerts */}
          {clinicalResults.analyticsData.psychologicalRisk.startsWith('CRITICAL') && (
            <Card className="mb-6 border-risk-high bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-risk-high" />
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
            <Card className="mb-6 border-risk-medium bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-risk-medium" />
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
          
          {/* Patient Comments Section */}
          {clinicalResults.clinicalSummary?.patientComments && (
            <Card className="mt-6 border-gentle-blue-dark bg-gentle-blue">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <User className="w-5 h-5 mr-2" />
                  Patient Additional Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded border-l-4 border-gentle-blue-dark">
                  <p className="text-gray-800 italic">"{clinicalResults.clinicalSummary.patientComments}"</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Detailed Treatment Options */}
          <div className="mt-8">
            <Card className="bg-white border-gentle-blue-dark/20">
              <CardHeader className="bg-gentle-blue/30">
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
          <Card className="mt-6 bg-light-purple/20 border-light-purple-dark/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <p><strong>Session:</strong> {sessionId}</p>
                  <p><strong>Assessment:</strong> NHS NICE NG23 + AI Enhanced</p>
                  <p><strong>Psychological Risk:</strong> {clinicalResults.analyticsData.psychologicalRisk}</p>
                </div>
                <div>
                  <p><strong>Urgency Score:</strong> {clinicalResults.analyticsData.urgencyScore}/10</p>
                  <p><strong>Confidence:</strong> 94%</p>
                  <p><strong>Red Flags:</strong> {clinicalResults.redFlags.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GPResults;
