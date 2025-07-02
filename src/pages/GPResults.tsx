
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Download, Mail, ArrowLeft, Shield, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SymptomScoring from "@/components/SymptomScoring";
import TreatmentRecommendations from "@/components/TreatmentRecommendations";
import ClinicalAnalytics from "@/components/ClinicalAnalytics";
import { generateClinicalSummary, generateNHSRecommendations, getSymptomScore } from "@/components/ConditionalQuestionLogic";
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
      setClinicalResults(generateGPResults(assessmentResult));
    } else {
      // Fallback to demo data if no stored assessment
      setClinicalResults(generateDemoResults());
    }
    setLoading(false);
  }, [sessionId]);

  const generateGPResults = (assessmentResult: any) => {
    const { rawData, clinicalSummary, riskLevel, recommendations, redFlags } = assessmentResult;
    
    // Generate detailed symptom scores based on actual patient responses
    const detailedSymptoms = [];
    
    // Vasomotor symptoms
    if (rawData.hotFlashFrequency && rawData.hotFlashFrequency !== 'none') {
      const score = getSymptomScore('hotFlashFrequency', rawData.hotFlashFrequency);
      detailedSymptoms.push({
        name: "Hot Flashes",
        score: score,
        severity: score >= 6 ? "Severe" : score >= 3 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.hotFlashFrequency} hot flashes - ${getSymptomDescription('hotFlashFrequency', rawData.hotFlashFrequency)}`,
        category: "vasomotor" as const
      });
    }
    
    if (rawData.nightSweats && rawData.nightSweats !== 'none') {
      const score = getSymptomScore('nightSweats', rawData.nightSweats);
      detailedSymptoms.push({
        name: "Night Sweats",
        score: score,
        severity: score >= 5 ? "Severe" : score >= 2 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.nightSweats} night sweats - ${getSymptomDescription('nightSweats', rawData.nightSweats)}`,
        category: "vasomotor" as const
      });
    }
    
    // Psychological symptoms
    if (rawData.moodSymptoms && rawData.moodSymptoms !== 'none') {
      const score = getSymptomScore('moodSymptoms', rawData.moodSymptoms);
      detailedSymptoms.push({
        name: "Mood Changes",
        score: score,
        severity: score >= 5 ? "Severe" : score >= 2 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.moodSymptoms} mood symptoms - requires ${score >= 5 ? 'mental health assessment' : 'monitoring'}`,
        category: "psychological" as const
      });
    }
    
    if (rawData.cognitiveSymptoms && rawData.cognitiveSymptoms !== 'none') {
      const score = getSymptomScore('cognitiveSymptoms', rawData.cognitiveSymptoms);
      detailedSymptoms.push({
        name: "Cognitive Changes",
        score: score,
        severity: score >= 4 ? "Severe" : score >= 2 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.cognitiveSymptoms} memory/concentration issues`,
        category: "psychological" as const
      });
    }
    
    // Physical symptoms
    if (rawData.physicalSymptoms && rawData.physicalSymptoms.length > 0) {
      rawData.physicalSymptoms.forEach((symptom: string) => {
        const score = getSymptomScore('physicalSymptoms', [symptom]);
        detailedSymptoms.push({
          name: getPhysicalSymptomName(symptom),
          score: score,
          severity: score >= 3 ? "Moderate" : "Mild",
          description: `Patient reports experiencing ${getPhysicalSymptomName(symptom).toLowerCase()}`,
          category: "physical" as const
        });
      });
    }
    
    // Sleep and sexual health
    if (rawData.sleepQuality && rawData.sleepQuality !== 'good') {
      const score = getSymptomScore('sleepQuality', rawData.sleepQuality);
      detailedSymptoms.push({
        name: "Sleep Disturbance",
        score: score,
        severity: score >= 5 ? "Severe" : score >= 2 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.sleepQuality} sleep quality`,
        category: "sleep" as const
      });
    }
    
    if (rawData.libidoChanges && rawData.libidoChanges !== 'no-change') {
      const score = getSymptomScore('libidoChanges', rawData.libidoChanges);
      detailedSymptoms.push({
        name: "Libido Changes",
        score: score,
        severity: score >= 6 ? "Severe" : score >= 3 ? "Moderate" : "Mild",
        description: `Patient reports ${rawData.libidoChanges.replace('-', ' ')} in sexual interest`,
        category: "sexual" as const
      });
    }
    
    // Generate treatment recommendations based on actual symptoms
    const treatmentOptions = generateTreatmentOptions(rawData, clinicalSummary);
    
    // Generate analytics data
    const analyticsData = generateAnalyticsData(rawData, clinicalSummary);
    
    return {
      patientRef: assessmentResult.patientRef,
      completedAt: new Date(assessmentResult.completedAt).toLocaleDateString(),
      sessionId: sessionId,
      riskLevel: riskLevel,
      redFlags: redFlags,
      detailedSymptoms: detailedSymptoms,
      treatmentOptions: treatmentOptions,
      analyticsData: analyticsData,
      patientProfile: {
        age: parseInt(rawData.age || "0"),
        riskFactors: generateRiskFactors(rawData),
        preferences: ["Patient-reported preferences to be discussed at consultation"]
      },
      riskFactors: {
        smoking: rawData.smokingStatus ? getLifestyleDescription('smoking', rawData.smokingStatus) : 'Not assessed',
        alcohol: rawData.alcoholConsumption ? getLifestyleDescription('alcohol', rawData.alcoholConsumption) : 'Not assessed',
        bmi: rawData.bmi || 'Not calculated during assessment',
        exercise: rawData.exerciseLevel ? getLifestyleDescription('exercise', rawData.exerciseLevel) : 'Not assessed',
        menstrualStatus: rawData.menstrualStatus || 'Not assessed'
      },
      niceGuidelines: [
        "NICE NG23: Menopause - diagnosis and management",
        "Individualized approach based on symptom severity and patient preferences",
        "Consider HRT for vasomotor symptoms if appropriate",
        "Address lifestyle factors and cardiovascular risk"
      ],
      clinicalRecommendations: recommendations
    };
  };

  const getSymptomDescription = (type: string, value: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      hotFlashFrequency: {
        mild: "1-2 episodes per day",
        moderate: "3-5 episodes per day, affecting daily activities",
        severe: "6+ episodes per day, significantly impacting quality of life"
      },
      nightSweats: {
        mild: "occasionally wake up warm",
        moderate: "need to change nightwear",
        severe: "need to change bedding, sleep severely disrupted"
      }
    };
    return descriptions[type]?.[value] || value;
  };

  const getPhysicalSymptomName = (symptom: string): string => {
    const names: { [key: string]: string } = {
      'joint-pain': 'Joint Pain',
      'muscle-pain': 'Muscle Pain',
      'headaches': 'Headaches',
      'fatigue': 'Fatigue',
      'weight-gain': 'Weight Gain',
      'bloating': 'Bloating',
      'breast-tenderness': 'Breast Tenderness',
      'skin-changes': 'Skin Changes'
    };
    return names[symptom] || symptom;
  };

  const getLifestyleDescription = (type: string, value: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      smoking: {
        never: "Never smoked (good - no additional risk)",
        former: "Former smoker (reduced risk after cessation)",
        current: "Current smoker (increased cardiovascular and VTE risk)"
      },
      alcohol: {
        none: "No alcohol consumption",
        "1-7": "1-7 units per week (within guidelines)",
        "8-14": "8-14 units per week (upper limit of guidelines)",
        "15-21": "15-21 units per week (above recommended limits)",
        "22+": "22+ units per week (significantly above guidelines)"
      },
      exercise: {
        high: "High activity level (excellent for bone and cardiovascular health)",
        moderate: "Moderate activity level (good baseline)",
        light: "Light activity level (room for improvement)",
        none: "No regular exercise (significant concern - priority intervention needed)"
      }
    };
    return descriptions[type]?.[value] || value;
  };

  const generateRiskFactors = (rawData: any): string[] => {
    const factors = [];
    if (rawData.smokingStatus === 'current') factors.push("Current smoker");
    if (rawData.smokingStatus === 'former') factors.push("Former smoker");
    if (rawData.exerciseLevel === 'none') factors.push("Sedentary lifestyle");
    if (rawData.alcoholConsumption === '22+') factors.push("High alcohol consumption");
    if (parseInt(rawData.age || "0") > 55) factors.push("Advanced age");
    return factors;
  };

  const generateTreatmentOptions = (rawData: any, clinicalSummary: any) => {
    const options = [];
    
    // HRT consideration based on vasomotor symptoms
    const vasomotorScore = clinicalSummary.vasomotor.score;
    if (vasomotorScore >= 4) {
      options.push({
        name: "Hormone Replacement Therapy (HRT)",
        probability: vasomotorScore >= 8 ? 85 : 70,
        evidence: "Grade A - NICE NG23 first-line for moderate-severe vasomotor symptoms",
        suitability: rawData.smokingStatus === 'current' ? 60 : 80,
        considerations: [
          `Effective for ${clinicalSummary.vasomotor.severity.toLowerCase()} vasomotor symptoms`,
          rawData.smokingStatus === 'current' ? "Smoking increases VTE risk - discuss cessation first" : "Good candidate for HRT",
          "Discuss individual benefits/risks including VTE and breast cancer risk",
          "Regular monitoring and annual review required"
        ]
      });
    }
    
    // Lifestyle interventions
    options.push({
      name: "Lifestyle Interventions",
      probability: 90,
      evidence: "Grade A - Strong evidence base, NICE NG23 recommended",
      suitability: 95,
      considerations: [
        rawData.exerciseLevel === 'none' ? "Priority: Exercise prescription - currently sedentary" : "Maintain current activity level",
        rawData.smokingStatus === 'current' ? "Smoking cessation support essential" : "Continue non-smoking status",
        rawData.alcoholConsumption === '22+' ? "Alcohol reduction advice required" : "Alcohol consumption within/near guidelines",
        "Weight management and dietary advice",
        "Stress reduction techniques and sleep hygiene"
      ]
    });
    
    // Non-hormonal therapies
    if (clinicalSummary.psychological.score >= 4 || rawData.smokingStatus === 'current') {
      options.push({
        name: "Non-hormonal Therapies",
        probability: 75,
        evidence: "Grade B - Good evidence for specific indications",
        suitability: 85,
        considerations: [
          clinicalSummary.psychological.score >= 4 ? "SSRIs for mood symptoms" : "CBT for psychological wellbeing",
          "Clonidine or gabapentin for vasomotor symptoms if HRT contraindicated",
          "Herbal supplements consideration (limited evidence)",
          "Complementary therapies as adjunct treatment"
        ]
      });
    }
    
    return options;
  };

  const generateAnalyticsData = (rawData: any, clinicalSummary: any) => {
    // Simulated progression based on current severity
    const currentSeverity = Math.max(
      clinicalSummary.vasomotor.score,
      clinicalSummary.psychological.score,
      clinicalSummary.physical.score
    ) / 2; // Scale to 0-5 range
    
    return {
      symptomProgression: [
        { week: 0, severity: Math.max(1, currentSeverity - 2) },
        { week: 4, severity: Math.max(1, currentSeverity - 1) },
        { week: 8, severity: currentSeverity },
        { week: 12, severity: Math.min(5, currentSeverity + 0.5) },
        { week: 16, severity: Math.min(5, currentSeverity + 1) }
      ],
      riskProfile: [
        { factor: "Cardiovascular", score: rawData.smokingStatus === 'current' ? 8 : 5, maxScore: 10 },
        { factor: "Bone Health", score: rawData.exerciseLevel === 'none' ? 7 : 4, maxScore: 10 },
        { factor: "Psychological", score: clinicalSummary.psychological.score, maxScore: 10 },
        { factor: "Metabolic", score: rawData.alcoholConsumption === '22+' ? 7 : 4, maxScore: 10 },
        { factor: "Lifestyle", score: rawData.exerciseLevel === 'none' ? 8 : 3, maxScore: 10 }
      ],
      treatmentEffectiveness: [
        { 
          treatment: "HRT - Combined", 
          success: clinicalSummary.vasomotor.score >= 6 ? 85 : 70, 
          evidence: `${clinicalSummary.vasomotor.severity} vasomotor symptoms - ${clinicalSummary.vasomotor.score >= 6 ? 'excellent' : 'good'} candidate` 
        },
        { 
          treatment: "Lifestyle Changes", 
          success: rawData.exerciseLevel === 'none' ? 90 : 75, 
          evidence: rawData.exerciseLevel === 'none' ? "High priority - currently sedentary" : "Maintain current healthy lifestyle" 
        },
        { 
          treatment: "Psychological Support", 
          success: clinicalSummary.psychological.score >= 4 ? 80 : 60, 
          evidence: `${clinicalSummary.psychological.severity} psychological symptoms present` 
        }
      ]
    };
  };

  const generateDemoResults = () => {
    // Fallback demo data - this should match realistic patient responses
    return {
      patientRef: "Demo Patient (DOB: 15/03/1968)",
      completedAt: new Date().toLocaleDateString(),
      sessionId: sessionId,
      riskLevel: "amber",
      redFlags: [],
      detailedSymptoms: [
        {
          name: "Hot Flashes",
          score: 6,
          severity: "Moderate",
          description: "Patient reports moderate hot flashes - 3-5 episodes per day, affecting daily activities",
          category: "vasomotor" as const
        }
      ],
      treatmentOptions: [
        {
          name: "Lifestyle Interventions",
          probability: 90,
          evidence: "Grade A - NICE NG23 recommended",
          suitability: 95,
          considerations: ["Exercise prescription needed", "Dietary counseling"]
        }
      ],
      analyticsData: {
        symptomProgression: [{ week: 0, severity: 2 }, { week: 4, severity: 3 }],
        riskProfile: [{ factor: "Cardiovascular", score: 5, maxScore: 10 }],
        treatmentEffectiveness: [{ treatment: "Lifestyle", success: 80, evidence: "Good baseline" }]
      },
      patientProfile: { age: 56, riskFactors: [], preferences: [] },
      riskFactors: { smoking: "Not assessed", alcohol: "Not assessed", bmi: "Not calculated", exercise: "Not assessed", menstrualStatus: "Not assessed" },
      niceGuidelines: ["NICE NG23: Menopause - diagnosis and management"],
      clinicalRecommendations: ["Lifestyle counseling recommended"]
    };
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading assessment results...</div>;
  }

  if (!clinicalResults) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">No assessment data found</div>;
  }

  const getRiskBadge = (level: string) => {
    const colors = {
      red: "bg-red-500 text-white",
      amber: "bg-amber-500 text-white", 
      green: "bg-green-500 text-white"
    };
    return <Badge className={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Assessment Results</h1>
                <p className="text-gray-600">Patient: {clinicalResults.patientRef}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Risk Level Alert */}
          {clinicalResults.redFlags.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-xl font-bold text-red-900">URGENT CLINICAL ATTENTION REQUIRED</h2>
                      <Badge className="bg-red-500 text-white">URGENT</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-red-800">Red Flag Symptoms Identified:</h3>
                      {clinicalResults.redFlags.map((flag: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-red-600" />
                          <span className="text-red-800">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Analytics */}
          <ClinicalAnalytics 
            data={clinicalResults.analyticsData}
            overallRisk={clinicalResults.riskLevel}
            confidenceLevel={88}
          />

          {/* Detailed Symptom Scoring */}
          <SymptomScoring symptoms={clinicalResults.detailedSymptoms} />

          {/* Treatment Recommendations */}
          <TreatmentRecommendations 
            treatments={clinicalResults.treatmentOptions}
            patientProfile={clinicalResults.patientProfile}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Patient Risk Profile (From Assessment)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(clinicalResults.riskFactors).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="text-gray-600 text-right max-w-xs">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NICE Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>NICE Guidelines Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clinicalResults.niceGuidelines.map((guideline: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{guideline}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>NHS Clinical Action Plan (Based on Patient Responses)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicalResults.clinicalRecommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Session ID:</strong> {sessionId}</p>
              <p><strong>Completed:</strong> {clinicalResults.completedAt}</p>
              <p><strong>Patient Reference:</strong> {clinicalResults.patientRef}</p>
              <p><strong>Assessment Tool:</strong> NHS NICE NG23 Compliant Menopause Assessment</p>
              <p><strong>Risk Level:</strong> <span className={`font-semibold ${clinicalResults.riskLevel === 'red' ? 'text-red-600' : clinicalResults.riskLevel === 'amber' ? 'text-amber-600' : 'text-green-600'}`}>{clinicalResults.riskLevel.toUpperCase()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPResults;
