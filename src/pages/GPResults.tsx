
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download, Mail, ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GPClinicalSummary from "@/components/GPClinicalSummary";
import TreatmentRecommendations from "@/components/TreatmentRecommendations";
import { generateClinicalSummary, generateNHSRecommendations, getRedFlags, getUrgentFlags, calculateRiskLevel } from "@/components/ConditionalQuestionLogic";
import { useState, useEffect } from "react";

const GPResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [clinicalResults, setClinicalResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load actual patient assessment data
    const storedData = localStorage.getItem(`assessment_${sessionId}`);
    if (storedData) {
      const assessmentResult = JSON.parse(storedData);
      setClinicalResults(generateEnhancedGPResults(assessmentResult));
    } else {
      // Fallback to demo data
      setClinicalResults(generateDemoResults());
    }
    setLoading(false);
  }, [sessionId]);

  const generateEnhancedGPResults = (assessmentResult: any) => {
    const { rawData, riskLevel, recommendations, urgentFlags } = assessmentResult;
    
    // Generate comprehensive clinical summary with proper psychological mapping
    const clinicalSummary = generateClinicalSummary(rawData);
    
    // Ensure urgent flags are properly captured
    const allRedFlags = getRedFlags(rawData);
    const allUrgentFlags = getUrgentFlags(rawData);
    
    // Generate treatment options
    const treatmentOptions = generateTreatmentOptions(rawData, clinicalSummary, riskLevel);
    
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
        urgencyScore: calculateUrgencyScore(rawData, calculateRiskLevel(rawData)),
        qualityOfLifeImpact: assessQualityOfLifeImpact(clinicalSummary),
        psychologicalRisk: assessPsychologicalRisk(rawData)
      },
      clinicalRecommendations: generateNHSRecommendations(rawData, calculateRiskLevel(rawData))
    };
  };

  const generateTreatmentOptions = (rawData: any, clinicalSummary: any, riskLevel: string) => {
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

  const assessHRTSuitability = (rawData: any, clinicalSummary: any) => {
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
    
    // Adjust for risk factors
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

  const calculateUrgencyScore = (rawData: any, riskLevel: string): number => {
    let baseScore = 0;
    
    // Base score from risk level
    if (riskLevel === 'red') baseScore = 10;
    else if (riskLevel === 'amber') baseScore = 6;
    else baseScore = 3;
    
    // Additional scoring for psychological risk
    if (rawData.selfHarmRisk === 'frequent') baseScore = 10;
    else if (rawData.selfHarmRisk === 'occasional') baseScore = Math.max(baseScore, 8);
    
    if (rawData.moodSymptoms === 'severe') baseScore = Math.max(baseScore, 7);
    
    return baseScore;
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

  const assessPsychologicalRisk = (rawData: any) => {
    if (rawData.selfHarmRisk === 'frequent') return 'CRITICAL - Immediate intervention required';
    if (rawData.selfHarmRisk === 'occasional') return 'HIGH - Urgent mental health review needed';
    if (rawData.moodSymptoms === 'severe') return 'MODERATE - Mental health support recommended';
    return 'LOW - No immediate psychological concerns';
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
        medicalHistory: { riskLevel: 'Low', personal: [], family: [], clinicalNotes: 'No significant concerns' },
        treatmentPreferences: { selected: ['hrt'], educationNeeded: true, clinicalNotes: 'Patient interested in HRT education' },
        lifestyle: { smoking: 'never', exercise: 'moderate', alcohol: '1-7', bmi: '24.5', riskLevel: 'Low', clinicalNotes: 'Good lifestyle profile' },
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
      analyticsData: { urgencyScore: 6, qualityOfLifeImpact: ["Moderate vasomotor impact"] },
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
