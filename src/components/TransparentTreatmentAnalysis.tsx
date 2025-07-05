
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { NICE_EVIDENCE_BASE, calculateTransparentScore } from "@/utils/clinicalEvidence";

interface TransparentTreatmentAnalysisProps {
  rawData: any;
  clinicalSummary: any;
}

const TransparentTreatmentAnalysis = ({ rawData, clinicalSummary }: TransparentTreatmentAnalysisProps) => {
  const age = parseInt(rawData.age || "50");
  const medicalHistory = rawData.personalMedicalHistory || [];
  const patientPreference = rawData.treatmentPreference || 'unsure';
  
  const hrtAnalysis = calculateTransparentScore(
    clinicalSummary.vasomotor.severity,
    medicalHistory,
    age,
    patientPreference
  );

  const getEvidenceForCase = () => {
    if (medicalHistory.includes('breast-cancer')) {
      return NICE_EVIDENCE_BASE['hrt-contraindicated'];
    } else if (clinicalSummary.vasomotor.severity === 'Severe') {
      return NICE_EVIDENCE_BASE['hrt-vasomotor-severe'];
    } else if (clinicalSummary.vasomotor.severity === 'Moderate') {
      return NICE_EVIDENCE_BASE['hrt-vasomotor-moderate'];
    }
    return NICE_EVIDENCE_BASE['lifestyle-general'];
  };

  const primaryEvidence = getEvidenceForCase();
  const lifestyleEvidence = NICE_EVIDENCE_BASE['lifestyle-general'];
  const cbtEvidence = NICE_EVIDENCE_BASE['cbt-psychological'];

  return (
    <div className="space-y-6">
      {/* Transparent Scoring Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Transparent Clinical Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">HRT Recommendation Score</span>
              <div className="flex items-center space-x-2">
                <Progress value={hrtAnalysis.score} className="w-32" />
                <span className="font-bold">{hrtAnalysis.score}/100</span>
                <Badge variant="outline" className="text-xs">
                  {hrtAnalysis.confidence}% confident
                </Badge>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Score Breakdown:</h4>
              <div className="space-y-2">
                {hrtAnalysis.breakdown.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="flex-1">{factor.factor}</span>
                    <span className={`font-medium ${factor.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {factor.points >= 0 ? '+' : ''}{factor.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {hrtAnalysis.uncertaintyFactors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Clinical Uncertainty Factors:</strong>
                  <ul className="mt-2 space-y-1">
                    {hrtAnalysis.uncertaintyFactors.map((factor, index) => (
                      <li key={index} className="text-sm">• {factor}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evidence-Based Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            Evidence-Based Treatment Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* HRT Recommendation */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Hormone Replacement Therapy</h4>
                <Badge className={`${hrtAnalysis.score >= 70 ? 'bg-green-500' : hrtAnalysis.score >= 40 ? 'bg-amber-500' : 'bg-gray-500'} text-white`}>
                  Evidence Grade {primaryEvidence.evidence.grade}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>Recommendation:</strong> {primaryEvidence.recommendation}
                </p>
                
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm"><strong>Evidence Source:</strong></p>
                  <p className="text-sm">{primaryEvidence.evidence.guideline}</p>
                  <p className="text-xs text-gray-600">{primaryEvidence.evidence.reference}</p>
                  <p className="text-xs text-gray-600">Study Type: {primaryEvidence.evidence.studyType}</p>
                </div>

                {primaryEvidence.contraindications.length > 0 && (
                  <div className="bg-red-50 p-3 rounded">
                    <p className="text-sm font-medium text-red-800">Contraindications:</p>
                    <ul className="text-sm text-red-700 mt-1">
                      {primaryEvidence.contraindications.map((contra, index) => (
                        <li key={index}>• {contra}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle Interventions */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Lifestyle Interventions</h4>
                <Badge className="bg-green-500 text-white">
                  Evidence Grade {lifestyleEvidence.evidence.grade}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>Recommendation:</strong> {lifestyleEvidence.recommendation}
                </p>
                
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm"><strong>Evidence Source:</strong></p>
                  <p className="text-sm">{lifestyleEvidence.evidence.guideline}</p>
                  <p className="text-xs text-gray-600">{lifestyleEvidence.evidence.reference}</p>
                  <p className="text-xs text-gray-600">Confidence: {lifestyleEvidence.evidence.confidence}%</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• Regular exercise (150 min/week)</div>
                  <div>• Balanced diet</div>
                  <div>• Stress management</div>
                  <div>• Sleep hygiene</div>
                </div>
              </div>
            </div>

            {/* CBT if applicable */}
            {clinicalSummary.psychological.severity !== 'None' && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Cognitive Behavioral Therapy</h4>
                  <Badge className="bg-blue-500 text-white">
                    Evidence Grade {cbtEvidence.evidence.grade}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    <strong>Indication:</strong> Psychological symptoms present
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Recommendation:</strong> {cbtEvidence.recommendation}
                  </p>
                  
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm"><strong>Evidence Source:</strong></p>
                    <p className="text-sm">{cbtEvidence.evidence.reference}</p>
                    <p className="text-xs text-gray-600">Confidence: {cbtEvidence.evidence.confidence}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Decision Support */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-900">Clinical Decision Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-purple-600" />
              <a href="https://www.nice.org.uk/guidance/ng23" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
                NICE NG23: Menopause Guidelines
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-purple-600" />
              <a href="https://www.womens-health-concern.org/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
                Women's Health Concern Resources
              </a>
            </div>
            <p className="text-purple-800 mt-3">
              <strong>Next Steps:</strong> Use this evidence-based analysis alongside clinical judgment and shared decision-making with the patient.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransparentTreatmentAnalysis;
