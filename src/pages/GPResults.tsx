import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Mail, Download } from "lucide-react";
import { loadSingleAssessment, type StoredAssessment } from "@/utils/assessmentStorage";

const GPResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<StoredAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      console.log('🔍 Loading results for', sessionId);
      loadAssessmentResults();
    }
  }, [sessionId]);

  const loadAssessmentResults = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 GP Results: Loading single assessment for sessionId:', sessionId);
      
      const assessmentData = await loadSingleAssessment(sessionId);
      console.log('📊 GP Results: Loaded assessment data:', assessmentData);
      
      if (assessmentData) {
        setAssessment(assessmentData);
      } else {
        console.log('❌ GP Results: No assessment found for sessionId:', sessionId);
        setError('Assessment not found');
      }
    } catch (err) {
      console.error('❌ GP Results: Error loading assessment:', err);
      setError('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'urgent':
      case 'high':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600';
      case 'amber':
      case 'moderate':
      case 'medium':
        return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600';
      case 'green':
      case 'low':
      default:
        return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'red':
      case 'urgent':
      case 'high':
        return 'HIGH RISK';
      case 'amber':
      case 'moderate':
      case 'medium':
        return 'MODERATE RISK';
      case 'green':
      case 'low':
      default:
        return 'LOW RISK';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SILVIA Clinical Portal</h1>
                <p className="text-sm text-gray-600">
                  <strong>S</strong>ymptom <strong>I</strong>ntake & <strong>L</strong>iaison for <strong>V</strong>ital <strong>I</strong>nsight & <strong>A</strong>ssessment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-green-100 text-green-700 border-green-200">
                System Active
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading && <div className="text-center">Loading assessment data...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {assessment && (
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white shadow-md rounded-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{assessment.patient_ref}</CardTitle>
                <CardDescription>
                  Completed: {formatDate(assessment.completed_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge className={`mt-2 ${getRiskBadgeClass(assessment.risk_level)}`}>
                    {getRiskLabel(assessment.risk_level)}
                  </Badge>
                </div>
                <div className="mb-4">
                  <h3 className="text-md font-semibold">Clinical Summary</h3>
                  <p className="text-gray-700">{JSON.stringify(assessment.clinical_summary)}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-md font-semibold">Recommendations</h3>
                  <p className="text-gray-700">{JSON.stringify(assessment.recommendations)}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-md font-semibold">Urgent Flags</h3>
                  {assessment.urgent_flags.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {assessment.urgent_flags.map((flag, index) => (
                        <li key={index} className="text-red-500">{flag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">No urgent flags.</p>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button onClick={() => navigate('/gp/dashboard')} variant="secondary">
                    Back to Dashboard
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Patient
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GPResults;
