
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Download, Mail, ArrowLeft, Shield, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SymptomScoring from "@/components/SymptomScoring";
import TreatmentRecommendations from "@/components/TreatmentRecommendations";
import ClinicalAnalytics from "@/components/ClinicalAnalytics";

const GPResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Enhanced clinical data with detailed scoring
  const clinicalResults = {
    patientRef: "J.S. (DOB: 15/03/1968)",
    completedAt: new Date().toLocaleDateString(),
    sessionId: sessionId,
    riskLevel: "red",
    redFlags: [
      "Postmenopausal bleeding reported",
      "Unexplained weight loss (>5kg in 6 months)"
    ],
    detailedSymptoms: [
      {
        name: "Hot Flashes",
        score: 8,
        severity: "Severe",
        description: "10+ episodes daily, severely impacting daily activities and sleep quality",
        category: "vasomotor" as const
      },
      {
        name: "Night Sweats",
        score: 9,
        severity: "Severe",
        description: "Drenching sweats requiring clothing/bedding changes 3-4 times nightly",
        category: "vasomotor" as const
      },
      {
        name: "Mood Changes",
        score: 7,
        severity: "Significant",
        description: "Frequent mood swings, irritability, and anxiety episodes",
        category: "psychological" as const
      },
      {
        name: "Joint Pain",
        score: 6,
        severity: "Moderate",
        description: "Morning stiffness and aching in multiple joints",
        category: "physical" as const
      },
      {
        name: "Sleep Disturbance",
        score: 8,
        severity: "Severe",
        description: "Difficulty falling asleep, frequent night wakings",
        category: "sleep" as const
      },
      {
        name: "Libido Changes",
        score: 5,
        severity: "Moderate",
        description: "Noticeable decrease in sexual interest and arousal",
        category: "sexual" as const
      }
    ],
    treatmentOptions: [
      {
        name: "Hormone Replacement Therapy (HRT)",
        probability: 85,
        evidence: "Grade A - Multiple RCTs",
        suitability: 75,
        considerations: [
          "Most effective for vasomotor symptoms",
          "Monitor for bleeding investigation results",
          "Consider cardiovascular risk factors",
          "Regular review and monitoring required"
        ]
      },
      {
        name: "Selective Estrogen Receptor Modulators",
        probability: 65,
        evidence: "Grade B - Limited RCTs",
        suitability: 70,
        considerations: [
          "Alternative if HRT contraindicated",
          "Good for bone protection",
          "May help with mood symptoms",
          "Less effective for hot flashes"
        ]
      },
      {
        name: "Non-hormonal therapies",
        probability: 45,
        evidence: "Grade C - Observational studies",
        suitability: 85,
        considerations: [
          "SSRIs/SNRIs for mood and hot flashes",
          "Gabapentin for night sweats",
          "CBT for psychological symptoms",
          "Lifestyle modifications essential"
        ]
      }
    ],
    analyticsData: {
      symptomProgression: [
        { week: 0, severity: 4 },
        { week: 4, severity: 6 },
        { week: 8, severity: 7 },
        { week: 12, severity: 8 },
        { week: 16, severity: 8.5 }
      ],
      riskProfile: [
        { factor: "Cardiovascular", score: 7, maxScore: 10 },
        { factor: "Bone Health", score: 6, maxScore: 10 },
        { factor: "Psychological", score: 8, maxScore: 10 },
        { factor: "Metabolic", score: 7, maxScore: 10 },
        { factor: "Lifestyle", score: 5, maxScore: 10 }
      ],
      treatmentEffectiveness: [
        { treatment: "HRT - Combined", success: 85, evidence: "Meta-analysis of 15 RCTs" },
        { treatment: "Tibolone", success: 75, evidence: "Cochrane Review 2023" },
        { treatment: "Venlafaxine", success: 60, evidence: "6 RCTs, moderate evidence" },
        { treatment: "CBT", success: 70, evidence: "Multiple RCTs for psychological symptoms" }
      ]
    },
    patientProfile: {
      age: 56,
      riskFactors: ["Current smoker", "BMI >30", "Family history CVD"],
      preferences: ["Avoid hormones if possible", "Concerned about cancer risk", "Prefers natural approaches"]
    },
    riskFactors: {
      smoking: "Current smoker (10/day)",
      alcohol: "21 units/week",
      bmi: "32.1 (Obese Class I)",
      exercise: "Minimal activity",
      familyHistory: "Mother: breast cancer, CVD"
    },
    niceGuidelines: [
      "NG23: Menopause - diagnosis and management",
      "Consider urgent referral for postmenopausal bleeding",
      "Cardiovascular risk assessment indicated",
      "Shared decision making for HRT initiation"
    ],
    clinicalRecommendations: [
      "URGENT: Refer to gynaecology for postmenopausal bleeding investigation",
      "Consider HRT after bleeding investigation complete",
      "Cardiovascular risk assessment and management",
      "Smoking cessation support",
      "Weight management programme referral",
      "Bone density assessment (DEXA scan)",
      "Follow-up in 2 weeks"
    ]
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Advanced Clinical Assessment</h1>
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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Risk Level & Red Flags */}
          {clinicalResults.riskLevel === "red" && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-xl font-bold text-red-900">HIGH RISK - URGENT ACTION REQUIRED</h2>
                      {getRiskBadge(clinicalResults.riskLevel)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-red-800">Red Flags Identified:</h3>
                      {clinicalResults.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-red-600" />
                          <span className="text-red-800 font-medium">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Analytics */}
          <div className="mb-6">
            <ClinicalAnalytics 
              data={clinicalResults.analyticsData}
              overallRisk="high"
              confidenceLevel={92}
            />
          </div>

          {/* Detailed Symptom Scoring */}
          <div className="mb-6">
            <SymptomScoring symptoms={clinicalResults.detailedSymptoms} />
          </div>

          {/* Treatment Recommendations */}
          <div className="mb-6">
            <TreatmentRecommendations 
              treatments={clinicalResults.treatmentOptions}
              patientProfile={clinicalResults.patientProfile}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-amber-500" />
                  Risk Factor Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(clinicalResults.riskFactors).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-700">{value}</span>
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
                <div className="space-y-2">
                  {clinicalResults.niceGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{guideline}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinical Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Clinical Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clinicalResults.clinicalRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      rec.includes('URGENT') ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <p className={`${rec.includes('URGENT') ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p>Session ID: {sessionId} | Completed: {clinicalResults.completedAt} | Patient Ref: {clinicalResults.patientRef}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPResults;
