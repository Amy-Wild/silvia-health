
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

  // Enhanced clinical data that matches patient assessment form responses
  const clinicalResults = {
    patientRef: "J.S. (DOB: 15/03/1968)",
    completedAt: new Date().toLocaleDateString(),
    sessionId: sessionId,
    riskLevel: "red",
    redFlags: [
      "Postmenopausal bleeding reported",
      "Severe physical symptoms requiring urgent assessment"
    ],
    detailedSymptoms: [
      {
        name: "Hot Flashes",
        score: 6,
        severity: "Moderate",
        description: "Daily episodes affecting work and daily activities, consistent with patient survey response of 'mild' frequency",
        category: "vasomotor" as const
      },
      {
        name: "Night Sweats",
        score: 5,
        severity: "Moderate", 
        description: "Occasional night sweats requiring clothing changes, aligning with assessment responses",
        category: "vasomotor" as const
      },
      {
        name: "Mood Changes",
        score: 7,
        severity: "Moderate",
        description: "Moderate mood swings and irritability as reported in psychological symptoms section",
        category: "psychological" as const
      },
      {
        name: "Bloating",
        score: 6,
        severity: "Moderate",
        description: "Abdominal bloating reported in physical symptoms assessment",
        category: "physical" as const
      },
      {
        name: "Headaches",
        score: 6,
        severity: "Moderate",
        description: "Regular headaches as indicated in physical symptoms survey",
        category: "physical" as const
      },
      {
        name: "Libido Changes",
        score: 5,
        severity: "Moderate",
        description: "Decreased sexual interest consistent with survey responses",
        category: "sexual" as const
      }
    ],
    treatmentOptions: [
      {
        name: "Hormone Replacement Therapy (HRT)",
        probability: 75,
        evidence: "Grade A - Multiple RCTs",
        suitability: 70,
        considerations: [
          "Effective for moderate vasomotor symptoms",
          "Consider patient's former smoking status",
          "Monitor for any contraindications",
          "Regular review and monitoring required"
        ]
      },
      {
        name: "Lifestyle Interventions",
        probability: 85,
        evidence: "Grade A - Strong evidence base",
        suitability: 90,
        considerations: [
          "Address sedentary lifestyle (no exercise reported)",
          "Weight management support",
          "Stress reduction techniques",
          "Dietary counseling for symptom management"
        ]
      },
      {
        name: "Non-hormonal therapies",
        probability: 65,
        evidence: "Grade B - Good evidence",
        suitability: 80,
        considerations: [
          "SSRIs for mood symptoms",
          "Herbal supplements consideration",
          "CBT for psychological wellbeing",
          "Alternative therapies as adjunct"
        ]
      }
    ],
    analyticsData: {
      symptomProgression: [
        { week: 0, severity: 3 },
        { week: 4, severity: 4 },
        { week: 8, severity: 5 },
        { week: 12, severity: 6 },
        { week: 16, severity: 6.5 }
      ],
      riskProfile: [
        { factor: "Cardiovascular", score: 5, maxScore: 10 },
        { factor: "Bone Health", score: 6, maxScore: 10 },
        { factor: "Psychological", score: 7, maxScore: 10 },
        { factor: "Metabolic", score: 6, maxScore: 10 },
        { factor: "Lifestyle", score: 8, maxScore: 10 }
      ],
      treatmentEffectiveness: [
        { treatment: "HRT - Combined", success: 75, evidence: "Moderate symptom severity - good candidate" },
        { treatment: "Lifestyle Changes", success: 85, evidence: "High priority given sedentary lifestyle" },
        { treatment: "Counseling Support", success: 70, evidence: "Moderate psychological symptoms present" }
      ]
    },
    patientProfile: {
      age: 56,
      riskFactors: ["Former smoker", "Sedentary lifestyle", "Moderate alcohol consumption"],
      preferences: ["Interested in natural approaches", "Concerned about medication risks", "Open to lifestyle changes"]
    },
    riskFactors: {
      smoking: "Former smoker (good - reduced risk)",
      alcohol: "1-7 units/week (within guidelines)",
      bmi: "Not calculated during assessment",
      exercise: "None reported (significant concern)",
      familyHistory: "Not assessed in current survey"
    },
    niceGuidelines: [
      "NG23: Menopause - diagnosis and management",
      "Lifestyle interventions as first-line approach",
      "Consider HRT for moderate symptoms",
      "Address exercise and weight management"
    ],
    clinicalRecommendations: [
      "Lifestyle counseling - priority intervention",
      "Exercise prescription and support",
      "Consider HRT discussion after lifestyle assessment",
      "Mood symptom monitoring and support",
      "Follow-up in 6-8 weeks to assess lifestyle changes",
      "Weight and BMI assessment at next visit",
      "Consider referral to menopause specialist if symptoms persist"
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
          {/* Risk Level Alert - Only show if there are actual red flags */}
          {clinicalResults.redFlags.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-xl font-bold text-orange-900">CLINICAL ATTENTION REQUIRED</h2>
                      <Badge className="bg-orange-500 text-white">REVIEW</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-orange-800">Clinical Flags:</h3>
                      {clinicalResults.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-800">{flag}</span>
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
            overallRisk="moderate"
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
                  Patient Risk Profile
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
                  {clinicalResults.niceGuidelines.map((guideline, index) => (
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
              <CardTitle>Clinical Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicalResults.clinicalRecommendations.map((rec, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPResults;
